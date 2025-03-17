<script lang="ts">
    import { onMount } from 'svelte';
	import AdminHeader from '../../components/adminHeader.svelte';
    import Cards from '../../components/Cards.svelte';
    import CardsPress from '../../components/CardsPress.svelte';
    import Modal from '../../components/Modal.svelte';

    interface NewsItem {
        id: number;
        title: string;
        image: string;
        thumbnail: string;
        content: string;
        date: string;
    }

    interface PressItem {
        id: number;
        title: string;
        image: string;
        content: string;
        date: string;
        link: string;
    }

    interface LiveItem {
        id: number;
        event_name: string;
        image: string;
        address: string;
        event_date: string;
        link: string;
    }

    let news: NewsItem[] = [];
    let press: PressItem[] = [];
    let live: LiveItem[] = [];

    let selectedItem: NewsItem | PressItem | LiveItem | null = null;
    let isModalOpen = false;

    async function fetchData(): Promise<void> {
        try {
            const token = document.cookie.split('=')[1];

            const newsResponse = await fetch('http://localhost:3000/api/news');
            if (newsResponse.ok) {
                news = await newsResponse.json();
            }

            const pressResponse = await fetch('http://localhost:3000/api/press');
            if (pressResponse.ok) {
                press = await pressResponse.json();
            }

            const liveResponse = await fetch('http://localhost:3000/api/live');
            if (liveResponse.ok) {
                live = await liveResponse.json();
            }
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

<main>
    <AdminHeader />
    <h1>Admin Dashboard</h1>

    <section>
        <!-- News section -->
        <h2>Last News</h2>
        <div >
            <ul class="adminList">
                {#each news.slice(0, 3) as item, index}
            <li>
                <Cards 
                    title={item.title} 
                    thumbnail={`http://localhost:3000${item.thumbnail}`} 
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
            {#each press.slice(0, 3) as item, index}
            <li>
                <CardsPress 
                    title={item.title} 
                    image={`http://localhost:3000${item.image}`} 
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
            {#each live.slice(0, 3) as item, index}
                <li>
                    <Cards 
                        title={item.event_name} 
                        thumbnail={`http://localhost:3000${item.image}`} 
                        content={item.address} 
                        onClick={() => openModal(item)} 
                        />
                </li>
            {/each}
        </ul>
    </section>
    <!-- modal component -->
    {#if isModalOpen && selectedItem}
    <Modal
        title={selectedItem.title || selectedItem.event_name}
        image={`http://localhost:3000${selectedItem.image}`}
        content={selectedItem.content || selectedItem.address}
        date={selectedItem.date || selectedItem.event_date}
        link={selectedItem.link}
        onClose={closeModal}
    />
{/if}
    
</main>

<style lang="scss">
    @import "../../style/adminStyle.scss";

    ul {
        list-style: none;
        padding: 0;
    }

    .adminList {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .modalImg {
            width: 290px;
            height: 300px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            margin: 1rem;
        }
        li {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 1rem;
            width: 300px;
            text-align: center;
            border: 2px solid transparent;
            h3 {
                margin: 1rem;
                text-shadow: 4px 4px 3px #000000;
            }
            img {
                width: 500px;
                object-fit: cover;
            }
        }
    }

    .modal-toggle {
        display: none;
    }
</style>