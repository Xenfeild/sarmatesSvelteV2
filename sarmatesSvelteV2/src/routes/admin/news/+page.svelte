<script lang="ts">
    import { onMount } from 'svelte';
	import AdminHeader from '../../../components/adminHeader.svelte';

    interface NewsItem {
        id: number;
        title: string;
        image: string;
        content: string;
        date: string;
    }

    let news: NewsItem[] = [];
    let newTitle: string = '';
    let newImage: File | null = null;
    let newContent: string = '';
    let editId: number | null = null;
    let editTitle: string = '';
    let editImage: string = '';
    let editContent: string = '';
    let previewImage: string | null = null;

    async function fetchNews(): Promise<void> {
        try {
            const response = await fetch('http://localhost:3000/api/news');
            if (response.ok) {
                const data = await response.json();
                news = data;
            } else {
                console.error('Failed to fetch news:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    }

    function selectImage(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            newImage = target.files[0];
            previewImage = URL.createObjectURL(newImage);
        }
    }

    async function addNews(): Promise<void> {
        const formData = new FormData();
        formData.append('title', newTitle);
        formData.append('content', newContent);
        if (newImage) {
            formData.append('image', newImage);
        }

        try {
            const response = await fetch('http://localhost:3000/api/news', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log('News added successfully');
                await fetchNews();
                newTitle = '';
                newImage = null;
                newContent = '';
                previewImage = null;
            } else {
                const errorText = await response.text();
                console.error('Failed to add news:', response.status, response.statusText, errorText);
            }
        } catch (error) {
            console.error('Error adding news:', error);
        }
    }

    async function deleteNews(id: number): Promise<void> {
        try {
            console.log(`Sending DELETE request for news ID: ${id}`);
            const response = await fetch(`http://localhost:3000/api/news/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log('News deleted successfully');
                await fetchNews();
            } else {
                const errorText = await response.text();
                console.error('Failed to delete news:', response.status, response.statusText, errorText);
            }
        } catch (error) {
            console.error('Error deleting news:', error);
        }
    }

    function startEdit(item: NewsItem): void {
        editId = item.id;
        editTitle = item.title;
        editImage = item.image;
        editContent = item.content;
        previewImage = `http://localhost:3000${item.image}`;
    }

    async function updateNews(): Promise<void> {
        if (editId === null) return;

        const formData = new FormData();
        formData.append('title', editTitle);
        formData.append('content', editContent);
        if (newImage) {
            formData.append('image', newImage);
        } else {
            formData.append('image', editImage);
        }

        try {
            const response = await fetch(`http://localhost:3000/api/news/${editId}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                await fetchNews();
                editId = null;
                editTitle = '';
                editImage = '';
                editContent = '';
                previewImage = null;
            } else {
                console.error('Failed to update news:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating news:', error);
        }
    }

    onMount(fetchNews);
</script>

<main>
    <AdminHeader />
    <h1>Actualité</h1>

    <h2>Ajouter actualité</h2>
    <div class="form">
        <input type="text" bind:value={newTitle} placeholder="Title" />
        <input type="file" accept="image/*" on:change={selectImage} />
        <textarea bind:value={newContent} placeholder="Content"></textarea>
        <button on:click={addNews}>Ajouter</button>
    </div>

    {#if editId !== null}
        <h2>Editer Actualité</h2>
        <div class="form">
            <h3>{editTitle}</h3>
            {#if previewImage}
                <img src={previewImage} alt="Preview" />
            {:else}
                <img src={`http://localhost:3000${editImage}`} alt="Preview" />
            {/if}
            <p>{editContent}</p>
        </div>
        <div class="form">
            <input type="text" bind:value={editTitle} placeholder="Title" />
            <input type="file" accept="image/*" on:change={selectImage} />
            <textarea bind:value={editContent} placeholder="Content"></textarea>
            <div class="adminBtn">
                <button on:click={updateNews}>Modifier</button>
                <button on:click={() => { editId = null;    previewImage = null; }}>Annuler</button>
            </div>
        </div>
    {/if}
    
    <div>
        <ul class="form">
            {#each news as item}
                <li>
                    <h3>{item.title}</h3>
                    <img src={`http://localhost:3000${item.image}`} alt={item.title} />
                    <p>{item.content}</p>
                    <div class="adminBtn">
                        <button on:click={() => startEdit(item)}>Modifier</button>
                        <button on:click={() => deleteNews(item.id)}>Supprimer</button>
                    </div>
                </li>
            {/each}
        </ul>
    </div>
</main>

<style lang="scss">
    @import '../../../style/adminStyle.scss';
</style>