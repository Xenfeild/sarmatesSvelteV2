<script lang="ts">
    import { onMount } from "svelte";
    import { translations, loadTranslations } from "../stores/translationStore";
    
    interface LiveItem {
        id: number;
        event_name: string;
        image: string;
        address: string;
        event_date: string;
        link: string;
    }

    let liveItems: LiveItem[] = [];

    onMount(async () => {
        const userLang = navigator.language || navigator.language;
        const lang = userLang.split('-')[0]; // 'fr', 'en', 'es'
        loadTranslations(lang);

        try {
            const response = await fetch('http://localhost:3000/api/live');
            if (response.ok) {
                liveItems = await response.json();
            } else {
                console.error('Failed to fetch live events:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching live events:', error);
        }
    });
</script>

<section id="live">
    <h2>{$translations.live}</h2>
    <div class="content">
        <div class="container">
            {#each liveItems as item}
                <div class="liveItem">
                    <div class="top">
                        <img src={item.image} alt={item.event_name} />
                    </div>
                    <div class="middle">
                        <h2>{item.event_name}</h2>
                        <p>{item.address}</p>
                    </div>
                    <div class="bottom">
                        <p>{item.event_date}</p>
                        <a href={item.link} target="_blank">
                            <button>{$translations.seeEvent}</button>
                        </a>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<style lang="scss">
    @import "../style/style.scss";
    .container{
        width: 90%;
        padding: 4rem;
    }

    .liveItem {
        display: flex;
        flex-direction: column;
        text-align: center;
        width: 100%;
        margin-bottom: 2rem;
        @media (min-width: 768px) {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }

        .top{
            height: 340px;
            width: 250px;
            img {
                height: 100%;
                width: 100%;
                object-fit: cover;
            }
        }
        p {
            margin: 1rem 0;
            font-size: clamp(1rem, 2vw, 1.5rem);
            font-weight: 300;
        }

        button {
            margin: 1rem 0;
        }
    }
</style>