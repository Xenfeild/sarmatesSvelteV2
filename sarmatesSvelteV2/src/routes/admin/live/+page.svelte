<script lang="ts">
    import { onMount } from 'svelte';

    interface LiveItem {
        id: number;
        event_name: string;
        image: string;
        address: string;
        event_date: string;
        link: string;
    }

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

    async function fetchLive(): Promise<void> {
        try {
            const response = await fetch('http://localhost:3000/api/live');
            if (response.ok) {
                const data = await response.json();
                live = data;
            } else {
                console.error('Failed to fetch live events:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching live events:', error);
        }
    }

    function selectImage(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            newImage = target.files[0];
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
            const response = await fetch('http://localhost:3000/api/live', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log('Live event added successfully');
                await fetchLive();
                newEventName = '';
                newAddress = '';
                newEventDate = '';
                newLink = '';
                newImage = null;
                previewImage = null;
            } else {
                const errorText = await response.text();
                console.error('Failed to add live event:', response.status, response.statusText, errorText);
            }
        } catch (error) {
            console.error('Error adding live event:', error);
        }
    }

    async function deleteLive(id: number): Promise<void> {
        try {
            console.log(`Sending DELETE request for live event ID: ${id}`);
            const response = await fetch(`http://localhost:3000/api/live/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log('Live event deleted successfully');
                await fetchLive();
            } else {
                const errorText = await response.text();
                console.error('Failed to delete live event:', response.status, response.statusText, errorText);
            }
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
        previewImage = `http://localhost:3000${item.image}`;
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
            const response = await fetch(`http://localhost:3000/api/live/${editLiveId}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                await fetchLive();
                editLiveId = null;
                editEventName = '';
                editAddress = '';
                editEventDate = '';
                editLink = '';
                editImage = '';
                previewImage = null;
            } else {
                console.error('Failed to update live event:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating live event:', error);
        }
    }

    onMount(fetchLive);
</script>

<main>
    <h1>Live Events</h1>

    <h2>Add Live Event</h2>
    <div class="form">
        <input type="text" bind:value={newEventName} placeholder="Event Name" />
        <input type="text" bind:value={newAddress} placeholder="Address" />
        <input type="date" bind:value={newEventDate} placeholder="Event Date" />
        <input type="text" bind:value={newLink} placeholder="Link" />
        <input type="file" accept="image/*" on:change={selectImage} />
        <button on:click={addLive}>Add</button>
    </div>

    {#if editLiveId !== null}
        <h2>Edit Live Event</h2>
        <div class="form">
            <input type="text" bind:value={editEventName} placeholder="Event Name" />
            <input type="text" bind:value={editAddress} placeholder="Address" />
            <input type="date" bind:value={editEventDate} placeholder="Event Date" />
            <input type="text" bind:value={editLink} placeholder="Link" />
            <input type="file" accept="image/*" on:change={selectImage} />
            <button on:click={updateLive}>Update</button>
            <button on:click={() => { editLiveId = null; previewImage = null; }}>Cancel</button>
        </div>
        <div class="form">
            <h3>{editEventName}</h3>
            {#if previewImage}
                <img src={previewImage} alt="Preview" />
            {:else}
                <img src={`http://localhost:3000${editImage}`} alt="Preview" />
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
                        <img src={`http://localhost:3000${item.image}`} alt={item.address} />
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

<style>
    @import "../../../style/adminStyle.scss";
</style>