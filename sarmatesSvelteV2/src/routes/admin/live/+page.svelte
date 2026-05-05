<script lang="ts">
    import { onMount } from 'svelte';
	import AdminHeader from '../../../components/adminHeader.svelte';
    import { getUploadUrl } from '$lib/config';
    import { api } from '$lib/services/api';
    import type { LiveItem } from '$lib/types';

    let live: LiveItem[] = [];
    let newEventName: string = '';
    let newAddress: string = '';
    let newEventDate: string = '';
    let newLink: string = '';
    let newImage: File | null = null;
    let editEventName: string = '';
    let editLiveId: number | null = null;
    let editAddress: string = '';
    let editEventDate: string = '';
    let editLink: string = '';
    let editImage: string = '';
    let previewImage: string | null = null;
    let imageError: string = '';

    async function fetchLive(): Promise<void> {
        try {
            live = await api.getLive();
        } catch (error) {
            console.error('Error fetching live events:', error);
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

    async function addLive(): Promise<void> {
        const formData = new FormData();
        formData.append('event_name', newEventName);
        formData.append('address', newAddress);
        formData.append('event_date', newEventDate);
        formData.append('link', newLink);
        if (newImage) {
            formData.append('image', newImage);
        }

        try {
            await api.createLive(formData);
            await fetchLive();
            newEventName = '';
            newAddress = '';
            newEventDate = '';
            newLink = '';
            newImage = null;
            previewImage = null;
            imageError = '';
        } catch (error) {
            console.error('Error adding live event:', error);
            imageError = error instanceof Error ? error.message : "Erreur lors de l'ajout de l'événement.";
        }
    }

    async function deleteLive(id: number): Promise<void> {
        try {
            await api.deleteLive(id);
            await fetchLive();
        } catch (error) {
            console.error('Error deleting live event:', error);
        }
    }

    function startEdit(item: LiveItem): void {
        editLiveId = item.id;
        editEventName = item.event_name;
        editAddress = item.address;
        editEventDate = item.event_date;
        editLink = item.link;
        editImage = item.image;
        previewImage = getUploadUrl(item.image);

        setTimeout(() => {
            const editSection = document.getElementById('edit-section');
            if (editSection) {
                editSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100); // Délai de 100ms
    }


    async function updateLive(): Promise<void> {
        if (editLiveId === null) return;

        const formData = new FormData();
        formData.append('event_name', editEventName);
        formData.append('address', editAddress);
        formData.append('event_date', editEventDate);
        formData.append('link', editLink);
        if (newImage) {
            formData.append('image', newImage);
        } else {
            formData.append('image', editImage);
        }

        try {
            await api.updateLive(editLiveId, formData);
            await fetchLive();
            editLiveId = null;
            editEventName = '';
            editAddress = '';
            editEventDate = '';
            editLink = '';
            editImage = '';
            previewImage = null;
            imageError = '';
        } catch (error) {
            console.error('Error updating live event:', error);
            imageError = error instanceof Error ? error.message : 'Erreur lors de la mise à jour.';
        }
    }

    onMount(fetchLive);
</script>

<main>
    <AdminHeader />
    <h1>Live Events</h1>

    <h2>Add Live Event</h2>
    <div class="form">
        <input type="text" bind:value={newEventName} placeholder="Event Name" />
        <input type="text" bind:value={newAddress} placeholder="Address" />
        <input type="date" bind:value={newEventDate} placeholder="Event Date" />
        <input type="text" bind:value={newLink} placeholder="Link" />
        <input type="file" accept="image/*" on:change={selectImage} />
        {#if imageError}<p class="error">{imageError}</p>{/if}
        <button on:click={addLive}>Add</button>
    </div>

    {#if editLiveId !== null}
        <h2 id="edit-section">Edit Live Event</h2>
        <div class="form">
            <input type="text" bind:value={editEventName} placeholder="Event Name" />
            <input type="text" bind:value={editAddress} placeholder="Address" />
            <input type="date" bind:value={editEventDate} placeholder="Event Date" />
            <input type="text" bind:value={editLink} placeholder="Link" />
            <input type="file" accept="image/*" on:change={selectImage} />
            {#if imageError}<p class="error">{imageError}</p>{/if}
            <button on:click={updateLive}>Update</button>
            <button on:click={() => { editLiveId = null; previewImage = null; }}>Cancel</button>
        </div>
        <div class="form">
            <h3>{editEventName}</h3>
            {#if previewImage}
                <img src={previewImage} alt="Preview" />
            {:else}
                <img src={getUploadUrl(editImage)} alt="Preview" />
            {/if}
            <p>{editAddress}</p>
            <p>{editEventDate}</p>
            <button on:click={() => window.open(editLink)}>Link</button>
            <!-- <p>{editLink}</p> -->
        </div>
    {/if}

    <div class="adminContainer">
        <ul>
            {#each live as item}
                <li class="liveList">
                    <div id="liveInfoTop">
                        <img src={getUploadUrl(item.image)} alt={item.address} />
                    </div>
                    <div id="liveInfoMiddle">
                        <h3>{item.event_name}</h3>
                        <p>{item.address}</p>
                    </div>
                    <div id="liveInfoBottom">
                        <h4>{item.event_date}</h4>
                    <!-- <p>{item.link}</p> -->
                        <button on:click={() => window.open(item.link)}>Link</button>
                    </div>
                </li>
                <div class="adminBtn">
                    <button on:click={() => startEdit(item)}>Edit</button>
                    <button on:click={() => deleteLive(item.id)}>Delete</button>
                </div>
            {/each}
        </ul>
    </div>
</main>

<style lang="scss">
    @import "../../../style/adminStyle.scss";

    .error {
        color: #ff4444;
        font-size: 0.85rem;
        margin-top: 0.25rem;
    }
    
    // Styles spécifiques à la page LIVE
    .liveList {
        background-color: #333;
        width: 85%;
        border-radius: 10px;
        padding: 1rem;
        margin: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 90%;
        text-align: center;
        
        img {
            margin: 1rem 0;
            width: 100%;
            aspect-ratio: 1/1;
            object-fit: contain;
        }
        
        #liveInfoTop{
            width: 100%;
        }
        
        #liveInfoMiddle {
            h3 {
                font-family: "Lexend Exa", sans-serif;
            }
        }
        
        #liveInfoBottom {
            display: flex;
            flex-direction: column;
            button {
                margin-bottom: 1rem;
                cursor: pointer;
            }
        }
    }

    @media (min-width: 785px) {
        .liveList {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            
            #liveInfoTop {
                width: 30%;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    max-height: 200px;
                    max-width: 200px;
                }
            }
            
            #liveInfoMiddle {
                width: 30%;
                text-align: center;
            }
            
            #liveInfoBottom {
                width: 30%;
            }
        }
    }
</style>