<script lang="ts">
    import { onMount } from 'svelte';
    import AdminHeader from '../../../components/adminHeader.svelte';
    import { getUploadUrl } from '$lib/config';
    import { api } from '$lib/services/api';
    import type { PressItem } from '$lib/types';

    let press: PressItem[] = [];
    let newTitle: string = '';
    let newImage: File | null = null;
    let newContent: string = '';
    let newLink: string = '';
    let editId: number | null = null;
    let editTitle: string = '';
    let editContent: string = '';
    let editLink: string = '';
    let previewImage: string | null = null;
    let imageError: string = '';

    async function fetchPress(): Promise<void> {
        try {
            press = await api.getPress();
        } catch (error) {
            console.error('Error fetching press data:', error);
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
            await api.post('/api/press', formData);
            fetchPress();
            newTitle = '';
            newImage = null;
            newContent = '';
            newLink = '';
            previewImage = null;
            imageError = '';
        } catch (error) {
            console.error('Error adding press:', error);
            imageError = error instanceof Error ? error.message : "Erreur lors de l'ajout de l'article.";
        }
    }

    function editPress(item: PressItem): void {
        editId = item.id;
        editTitle = item.title;
        editContent = item.content;
        editLink = item.link;
        previewImage = getUploadUrl(item.image);
        setTimeout(() => {
            const editSection = document.getElementById('edit-section');
            if (editSection) {
                editSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

    async function updatePress(): Promise<void> {
        if (editId === null) return;

        const formData = new FormData();
        formData.append('title', editTitle);
        if (newImage) {
            formData.append('image', newImage);
        }
        formData.append('content', editContent);
        formData.append('date', new Date().toISOString());
        formData.append('link', editLink);

        try {
            await api.put('/api/press', editId, formData);
            fetchPress();
            editId = null;
            editTitle = '';
            editContent = '';
            editLink = '';
            previewImage = null;
            imageError = '';
        } catch (error) {
            console.error('Error updating press:', error);
            imageError = error instanceof Error ? error.message : 'Erreur lors de la mise à jour.';
        }
    }

    async function deletePress(id: number): Promise<void> {
        try {
            await api.delete('/api/press', id);
            fetchPress();
        } catch (error) {
            console.error('Error deleting press:', error);
        }
    }

    onMount(fetchPress);
</script>

<main>
    <AdminHeader />
    <h1>Presse</h1>

    <h2>Ajouter article de presse</h2>
    <div class="form">
        <input type="text" bind:value={newTitle} placeholder="Title" />
        <input type="file" accept="image/*" on:change={selectImage} />
        {#if imageError}<p class="error">{imageError}</p>{/if}
        {#if previewImage}
            <div class="preview">
                <img src={previewImage} alt="Preview" />
            </div>
        {/if}
        <textarea bind:value={newContent} placeholder="Content"></textarea>
        <input type="text" bind:value={newLink} placeholder="Link" />
        <button on:click={addPress}>Ajouter</button>
    </div>

    {#if editId !== null}
        <h2 id="edit-section">Editer article de presse</h2>
        <div class="form">
            <input type="text" bind:value={editTitle} placeholder="Title" />
            <input type="file" accept="image/*" on:change={selectImage} />
            {#if imageError}<p class="error">{imageError}</p>{/if}
            {#if previewImage}
                <div class="preview">
                    <img src={previewImage} alt="Preview" />
                </div>
            {/if}
            <textarea bind:value={editContent} placeholder="Content"></textarea>
            <input type="text" bind:value={editLink} placeholder="Link" />
            <button on:click={updatePress}>Mettre à jour</button>
            <button on:click={() => { editId = null; previewImage = null; }}>Annuler</button>
        </div>
    {/if}

    <ul class="form">
        {#each press as item}
            <li>
                <h2>{item.title}</h2>
                <img src={getUploadUrl(item.image)} alt={item.title} />
                <p>{item.content}</p>
                <p>{item.date}</p>
                <a href={item.link} target="_blank">Voir l'article au complet</a>
                <button on:click={() => editPress(item)}>Edit</button>
                <button on:click={() => deletePress(item.id)}>Delete</button>
            </li>
        {/each}
    </ul>
</main>

<style lang="scss">
    @import '../../../style/adminStyle.scss';
    
    .error {
        color: #ff4444;
        font-size: 0.85rem;
        margin-top: 0.25rem;
    }
    
    // Styles spécifiques à la page PRESS
    a {
        font-family: "lexend exa", sans-serif;
        text-shadow: 3px 3px 2px #000000;
        color: #0066cc;
        
        &:hover {
            color: #ff9634;
        }
    }
    
    .preview img {
        max-width: 700px;
        display: block;
        margin: 1rem auto;
        border-radius: 5px;
    }
</style>