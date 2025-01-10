<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { translations, loadTranslations } from "../stores/translationStore";

    // Store index of the current carousel item
    const currentIndex = writable(0);

    // array carousel items
    let items = [
        { 
            type: 'image', 
            src: 'pochette_sarmates.png', 
            alt: 'Image 1', 
            text: 'caption1', 
            logos: [
                { src: '../src/lib/img/spotify.png', alt: 'Spotify logo', url: 'https://open.spotify.com/intl-fr/artist/0W6mPvqyV2o6BxJsLh2u1N' },
                { src: '../src/lib/img/deezer.png', alt: 'Deezer logo', url: 'https://www.deezer.com/fr/artist/270656742' },
                { src: '../src/lib/img/bandcamp.png', alt: 'bandcamp logo', url: 'https://sarmates.bandcamp.com/album/sarmates?from=search&search_item_id=1280216646&search_item_type=a&search_match_part=%3F&search_page_id=3699891871&search_page_no=1&search_rank=1&search_sig=8d02d4a16dbc3663c3d0e7cfa4648846' }
            ]
        },
        { 
            type: 'video', 
            src: 'introSarmates.mp4', 
            alt: 'Video 1', 
            text: 'caption2', 
            cta: { url: '#', text: 'watchVideo' }
        },
        { 
            type: 'image', 
            src: 'Sarmates_shoot-29.webp', 
            alt: 'Image 1', 
            text: 'caption3', 
            cta: { url: '#', text: 'goToGaleries' }
        },
    ];

    let interval: number;

    onMount(() => {
        console.log('Component mounted');
        loadTranslations('en'); // load translations default language
        adjustPaths();
        startCarousel();
        // window.addEventListener('resize', debounce(adjustPaths, 200)); // Ajouter un écouteur d'événement pour ajuster les chemins lors du redimensionnement de la fenêtre
        // return () => {
            // clearInterval(interval);
            // window.removeEventListener('resize', debounce(adjustPaths, 200));
        // };
    });


    function debounce(func: (...args: any[]) => void, wait: number) {
        let timeout: number | undefined;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = window.setTimeout(() => func(...args), wait);
        };
    }

    function adjustPaths() {
    const basePath = window.innerWidth < 785 ? '../src/lib/img/m/' : '../src/lib/img/';
    const timestamp = new Date().getTime();
    items = items.map(item => {
        const newSrc = `${basePath}${item.src}?t=${timestamp}`;
        console.log(`Adjusting path for ${item.src} to ${newSrc}`);
        return {
            ...item,
            src: newSrc
        };
    });
}

    function startCarousel() {
        interval = setInterval(() => {
            currentIndex.update(n => (n + 1) % items.length);
        }, 10000); // Change toutes les 5 secondes
    }

    function selectItem(index: number) {
        console.log(`selectItem called with index: ${index}`);
        currentIndex.set(index);
        clearInterval(interval);
        startCarousel();
    }
</script>

<section class="carousel">
    <div class="carousel-inner">
        {#each items as item , index}
            <div class="carousel-item { $currentIndex === index ? 'active' : '' }">
                {#if item.type === 'image'}
                    <img src={item.src} alt={item.alt} />
                {:else if item.type === 'video'}
                    <video src={item.src} muted loop autoplay></video>
                {/if}
                <div class="carousel-caption">
                    <p>{$translations[item.text]}</p>
                    {#if item.logos}
                        <div class="carousel-logos">
                            {#each item.logos as logo}
                                <a href={logo.url} target="_blank" rel="noopener">
                                    <img src={logo.src} alt={logo.alt} class="carousel-logo" />
                                </a>
                            {/each}
                        </div>
                    {:else}
                        <a href={item.cta.url} class="carousel-cta">{$translations[item.cta.text]}</a>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
    <div class="carouselShadow"></div> <!-- Ajout de l'élément pour l'ombre -->
    <div class="carousel-indicators">
        {#each items as _, index}
        <button class:active={$currentIndex === index} on:click={() => {
            console.log(`Button clicked with index: ${index}`);
            selectItem(index);
        }}></button>
        {/each}
    </div>
</section>


<style lang="scss">
    @import "../style/carousselHero.scss";



</style>