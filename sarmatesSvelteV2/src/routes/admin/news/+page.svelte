<script lang="ts">
    import { onMount } from 'svelte';
    import AdminHeader from '../../../components/adminHeader.svelte';
    import { getUploadUrl } from '$lib/config';
    import { api } from '$lib/services/api';
    import type { NewsItem } from '$lib/types';

    let news: NewsItem[] = [];
    let newTitle: string = '';
    let newImage: File | null = null;
    let newContent: string = '';
    let editId: number | null = null;
    let editTitle: string = '';
    let editImage: string = '';
    let editThumbnail: string = '';
    let editContent: string = '';
    let previewImage: string | null = null;
    let imageError: string = '';

    async function fetchNews(): Promise<void> {
        try {
            news = await api.getNews();
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    }

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

    function selectImage(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            const file = target.files[0];
            if (!allowedImageTypes.includes(file.type)) {
                imageError = 'Format non autorisé. Seules les images JPEG, PNG et WebP sont acceptées.';
                newImage = null;
                previewImage = null;
                target.value = '';
                return;
            }
            imageError = '';
            newImage = file;
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
            await api.post('/api/news', formData);
            // ...log supprimé pour préprod...
            await fetchNews();
            newTitle = '';
            newImage = null;
            newContent = '';
            previewImage = null;
            imageError = '';
        } catch (error) {
            console.error('Error adding news:', error);
            imageError = error instanceof Error ? error.message : "Erreur lors de l'ajout de l'actualité.";
        }
    }

    async function deleteNews(id: number): Promise<void> {
        try {
            // ...log supprimé pour préprod...
            await api.delete('/api/news', id);
            // ...log supprimé pour préprod...
            await fetchNews();
        } catch (error) {
            console.error('Error deleting news:', error);
        }
    }

    function startEdit(item: NewsItem): void {
        editId = item.id;
        editTitle = item.title;
        editImage = item.image;
        editThumbnail = item.thumbnail;
        editContent = item.content;
        previewImage = getUploadUrl(item.image);

        // Faire défiler la page vers l'élément <h2>Editer Actualité</h2>
        setTimeout(() => {
            const editSection = document.getElementById('edit-section');
            if (editSection) {
                editSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100); // Délai de 100ms
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
            formData.append('thumbnail', editThumbnail);
        }

        try {
            await api.put('/api/news', editId, formData);
            await fetchNews();
            editId = null;
            editTitle = '';
            editImage = '';
            editThumbnail = '';
            editContent = '';
            previewImage = null;
            imageError = '';
        } catch (error) {
            console.error('Error updating news:', error);
            imageError = error instanceof Error ? error.message : 'Erreur lors de la mise à jour.';
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
        {#if imageError}<p class="error">{imageError}</p>{/if}
        <textarea bind:value={newContent} placeholder="Content"></textarea>
        <button on:click={addNews}>Ajouter</button>
    </div>

    {#if editId !== null}
    <h2 id="edit-section">Editer Actualité</h2>
        <div class="form">
            <h3>{editTitle}</h3>
            {#if previewImage}
                <img src={previewImage} alt="Preview" />
            {:else}
                <img src={getUploadUrl(editImage)} alt="Preview" />
            {/if}
            <p>{editContent}</p>
        </div>
        <div class="form">
            <input type="text" bind:value={editTitle} placeholder="Title" />
            <input type="file" accept="image/*" on:change={selectImage} />
            {#if imageError}<p class="error">{imageError}</p>{/if}
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
                    <img src={getUploadUrl(item.image)} alt={item.title} />
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

    .error {
        color: #ff4444;
        font-size: 0.85rem;
        margin-top: 0.25rem;
    }
</style>