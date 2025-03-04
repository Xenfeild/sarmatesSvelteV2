<script lang="ts">
	import Footer from "../../components/Footer.svelte";
    import Header from "../../components/header.svelte";
    import { onMount } from "svelte";
    import { translations, loadTranslations } from "../../stores/translationStore";

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
<main>
    <header>
        <Header/>
    </header>
    <section>
        
        <div>
        <h1>{$translations.live}</h1>
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
    </div>
    <Footer />
    </section>
</main>

<style lang="scss">
    @import "../../style/style.scss";
    section {
        padding-top: 5rem;
        background-color: black;
        background-image: url(../../lib/img/back_sarmates.webp);
        color: $secondary-color;
        background-attachment: fixed;
    }
    h1 {
        font-size: 3rem;
        text-align: center;
        margin-bottom: 2rem;
        font-family: $title-font;
        font-weight: 400;
        text-shadow: 4px 4px 3px #000000;
    }
    .noBackground #live {
    background-image: none;
}
.container{
        width: 90%;
        padding: 4rem;
        margin-bottom: 3rem;
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