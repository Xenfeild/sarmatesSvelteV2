<script lang="ts">
    import { onMount } from 'svelte';
	import AdminHeader from '../../components/adminHeader.svelte';

    interface NewsItem {
        id: number;
        title: string;
        image: string;
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

    onMount(fetchData);
</script>

<main>
    <AdminHeader />
    <h1>Admin Dashboard</h1>

    <section>
        <h2>Last News</h2>
        <div >
            <ul class="adminList">
                {#each news.slice(0, 3) as item, index}
                    <li>
                        <label for={`news-modal-${index}`}>
                            <h3>{item.title}</h3>
                            <img src={`http://localhost:3000${item.image}`} alt={item.title} class="modalImg"/>
                        </label>
                        <input type="checkbox" id={`news-modal-${index}`} class="modal-toggle" />
                        <div class="modal">
                            <div class="modal-content">
                                <label for={`news-modal-${index}`} class="close">&times;</label>
                                <h2>{item.title}</h2>
                                <img src={`http://localhost:3000${item.image}`} alt={item.title} />
                                <p>{item.content}</p>
                            </div>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
    </section>
    <section>
        <h2>Last Press</h2>
        <ul class="adminList">
            {#each press.slice(0, 3) as item, index}
                <li>
                    <label for={`press-modal-${index}`}>
                        <h3>{item.title}</h3>
                        <img src={`http://localhost:3000${item.image}`} alt={item.title} />
                    </label>
                    <input type="checkbox" id={`press-modal-${index}`} class="modal-toggle" />
                    <div class="modal">
                        <div class="modal-content">
                            <label for={`press-modal-${index}`} class="close">&times;</label>
                            <h2>{item.title}</h2>
                            <img src={`http://localhost:3000${item.image}`} alt={item.title} />
                            <p>{item.content}</p>
                            <a href={item.link} target="_blank">Read More</a>
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
    </section>
    <section>
        <h2>Last Live Events</h2>
        <ul class="adminList">
            {#each live.slice(0, 3) as item, index}
                <li>
                    <label for={`live-modal-${index}`}>
                        <h3>{item.event_name}</h3>
                        <img src={`http://localhost:3000${item.image}`} alt={item.event_name} />
                    </label>
                    <input type="checkbox" id={`live-modal-${index}`} class="modal-toggle" />
                    <div class="modal">
                        <div class="modal-content">
                            <label for={`live-modal-${index}`} class="close">&times;</label>
                            <h2>{item.event_name}</h2>
                            <img src={`http://localhost:3000${item.image}`} alt={item.event_name} />
                            <p>{item.address}</p>
                            <p>{item.event_date}</p>
                            <a href={item.link} target="_blank">Go to event page</a>
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
    </section>
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
        .modalImg{
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
            // background-color: var(--clr-secondary-50);
            text-align: center;
            border: 2px solid transparent;
            h3 {
                margin: 1rem;
                text-shadow: 4px 4px 3px #000000
            }
            img {
                width: 500px;
                // height: 243px;
                object-fit: cover;
            }
        }
    }
    .modal-toggle {
        display: none;
    }

    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        justify-content: center;
        align-items: center;
    }

    .modal-toggle:checked + .modal {
        display: flex;
    }

    .modal-content {
        display: flex;
        flex-direction: column;
        background: #ffc014a8;
        padding: 2rem;
        border-radius: 8px;
        // width: 100%;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow-y: scroll;
    }

    .close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }

    img {
        max-width: 100%;
        height: auto;
        margin-bottom: 1rem;
    }
</style>