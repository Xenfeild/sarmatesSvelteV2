<script lang="ts">
    import { onMount } from 'svelte';

    interface PressItem {
        id: number;
        title: string;
        image: string;
        content: string;
        date: string;
        link: string;
    }

    let press: PressItem[] = [];
    let newTitle: string = '';
    let newImage: File | null = null;
    let newContent: string = '';
    let newLink: string = '';
    let editId: number | null = null;
    let editTitle: string = '';
    let editImage: string = '';
    let editContent: string = '';
    let editLink: string = '';
    let previewImage: string | null = null;

    async function fetchPress(): Promise<void> {
        try {
            const response = await fetch('http://localhost:3000/api/press');
            if (response.ok) {
                const data = await response.json();
                press = data;
                console.log('Press data:', press);
            } else {
                console.error('Failed to fetch press data', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching press data:', error);
        }
    }

    function selectImage(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            newImage = target.files[0];
            previewImage = URL.createObjectURL(newImage);
        }
    }

    async function addPress(): Promise<void> {
        const formData = new FormData();
        formData.append('title', newTitle);
        if (newImage) {
            formData.append('image', newImage);
        }
        formData.append('content', newContent);
        formData.append('date', new Date().toISOString());
        formData.append('link', newLink);

        try {
            const response = await fetch('http://localhost:3000/api/press', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                fetchPress();
                newTitle = '';
                newImage = null;
                newContent = '';
                newLink = '';
                previewImage = null;
            } else {
                console.error('Failed to add press');
            }
        } catch (error) {
            console.error('Error adding press:', error);
        }
    }

    function editPress(item: PressItem): void {
        editId = item.id;
        editTitle = item.title;
        editImage = item.image;
        editContent = item.content;
        editLink = item.link;
    }

    async function updatePress(): Promise<void> {
        const formData = new FormData();
        formData.append('title', editTitle);
        if (newImage) {
            formData.append('image', newImage);
        }
        formData.append('content', editContent);
        formData.append('date', new Date().toISOString());
        formData.append('link', editLink);

        try {
            const response = await fetch(`http://localhost:3000/api/press/${editId}`, {
                method: 'PUT',
                body: formData
            });
            if (response.ok) {
                fetchPress();
                editId = null;
                editTitle = '';
                editImage = '';
                editContent = '';
                editLink = '';
                previewImage = null;
            } else {
                console.error('Failed to update press');
            }
        } catch (error) {
            console.error('Error updating press:', error);
        }
    }

    async function deletePress(id: number): Promise<void> {
        try {
            const response = await fetch(`http://localhost:3000/api/press/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchPress();
            } else {
                console.error('Failed to delete press');
            }
        } catch (error) {
            console.error('Error deleting press:', error);
        }
    }

    // function handleFileChange(event: Event): void {
    //     const target = event.target as HTMLInputElement;
    //     if (target.files && target.files.length > 0) {
    //         newImage = target.files[0];
    //         previewImage = URL.createObjectURL(newImage);
    //     }
    // }

    // function handleEditFileChange(event: Event): void {
    //     const target = event.target as HTMLInputElement;
    //     if (target.files && target.files.length > 0) {
    //         newImage = target.files[0];
    //         previewImage = URL.createObjectURL(newImage);
    //     }
    // }

    onMount(fetchPress);
</script>

<main>
    <h1>Presse</h1>

    <h2>Ajouter article de presse</h2>
    <div class="form">
        <input type="text" bind:value={newTitle} placeholder="Title" />
        <input type="file" accept="image/*" on:change={selectImage} />
        <textarea bind:value={newContent} placeholder="Content"></textarea>
        <input type="text" bind:value={newLink} placeholder="Link" />
        <button on:click={addPress}>Ajouter</button>
    </div>

    {#if editId !== null}
        <h2>Editer article de presse</h2>
        <div class="form">
            <input type="text" bind:value={editTitle} placeholder="Title" />
            <input type="file" accept="image/*" on:change={selectImage} />
            <textarea bind:value={editContent} placeholder="Content"></textarea>
            <input type="text" bind:value={editLink} placeholder="Link" />
            <button on:click={updatePress}>Mettre à jour</button>
        </div>
    {/if}

    <ul>
        {#each press as item}
            <li>
                <h2>{item.title}</h2>
                <img src={`http://localhost:3000${item.image}`} alt={item.title} />
                <p>{item.content}</p>
                <p>{item.date}</p>
                <a href={item.link} target="_blank">Read more</a>
                <button on:click={() => editPress(item)}>Edit</button>
                <button on:click={() => deletePress(item.id)}>Delete</button>
            </li>
        {/each}
    </ul>
</main>

<style lang="scss">
    @import '../../../style/adminStyle.scss';
</style>