<script lang="ts">
    import { onMount } from 'svelte';
    import AdminHeader from '../../components/adminHeader.svelte';
    import Cards from '../../components/Cards.svelte';
    import CardsPress from '../../components/CardsPress.svelte';
    import Modal from '../../components/Modal.svelte';
    import { getUploadUrl } from '$lib/config';
    import { api } from '$lib/services/api';
    import type { NewsItem, PressItem, LiveItem } from '$lib/types';

    let news: NewsItem[] = [];
    let press: PressItem[] = [];
    let live: LiveItem[] = [];

    let selectedItem: NewsItem | PressItem | LiveItem | null = null;
    let isModalOpen = false;

    async function fetchData(): Promise<void> {
        try {
            const [newsData, pressData, liveData] = await Promise.all([
                api.getNews(),
                api.getPress(),
                api.getLive()
            ]);
            
            news = newsData;
            press = pressData;
            live = liveData;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function openModal(item: NewsItem | PressItem | LiveItem) {
        selectedItem = item;
        isModalOpen = true;
    }

    function closeModal() {
        selectedItem = null;
        isModalOpen = false;
    }

    onMount(fetchData);
</script>
<header>

</header>
    <AdminHeader />
<main>
    
    <h1>Admin Dashboard</h1>

    <section>
        <!-- News section -->
        <h2>Last News</h2>
        <div >
            <ul class="adminList">
                {#each news.slice(0, 3) as item}
            <li>
                <Cards 
                    title={item.title} 
                    thumbnail={getUploadUrl(item.thumbnail)} 
                    content={item.content} 
                    onClick={() => openModal(item)} 
                />
            </li>
        {/each}
            </ul>
        </div>
    </section>
    <!-- Press section -->
    <section>
        <h2>Last Press</h2>
        <ul class="adminList">
            {#each press.slice(0, 3) as item}
            <li>
                <CardsPress 
                    title={item.title} 
                    image={getUploadUrl(item.image)} 
                    content={item.content} 
                    link={item.link} 
                    onClick={() => openModal(item)} 
                />
            </li>
            {/each}
        </ul>
    </section>
    <!-- event section -->
    <section>
        <h2>Last Live Events</h2>
        <ul class="adminList">
            {#each live.slice(0, 3) as item}
                <li>
                    <Cards 
                        title={item.event_name} 
                        thumbnail={getUploadUrl(item.image)} 
                        content={item.address} 
                        onClick={() => openModal(item)} 
                        />
                </li>
            {/each}
        </ul>
    </section>
    <!-- modal component -->
    {#if isModalOpen && selectedItem}
        {#if 'event_name' in selectedItem}
            <Modal
                title={selectedItem.event_name}
                image={getUploadUrl(selectedItem.image)}
                content={selectedItem.address}
                date={selectedItem.event_date}
                link={selectedItem.link}
                onClose={closeModal}
            />
        {:else if 'link' in selectedItem}
            <Modal
                title={selectedItem.title}
                image={getUploadUrl(selectedItem.image)}
                content={selectedItem.content}
                date={selectedItem.date}
                link={selectedItem.link}
                onClose={closeModal}
            />
        {:else}
            <Modal
                title={selectedItem.title}
                image={getUploadUrl(selectedItem.image)}
                content={selectedItem.content}
                date={selectedItem.date}
                onClose={closeModal}
            />
        {/if}
    {/if}
    
</main>

<style lang="scss">
    @import "../../style/adminStyle.scss";

    ul {
        list-style: none;
        padding: 0;
    }

    .modal-toggle {
        display: none;
    }
</style>