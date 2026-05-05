<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { translations, loadTranslations } from "../stores/translationStore";

    // Imports images résolus par Vite (valides en dev et en prod)
    import pochetteDesktop from '$lib/img/pochette_sarmates.png';
    import pochetteMobile from '$lib/img/m/pochette_sarmates.png';
    import leoff1Img from '$lib/img/leoff1.webp';
    import sarmates29Img from '$lib/img/Sarmates_shoot-29.webp';
    import spotifyLogo from '$lib/img/spotify.webp';
    import appleMusicLogo from '$lib/img/icons8-music-500.webp';
    import deezerLogo from '$lib/img/deezer.webp';
    import bandcampLogo from '$lib/img/bandcamp.webp';
    import youtubeLogo from '$lib/img/icons8-youtube-500.webp';

    const currentIndex = writable(0);

    const items = [
        { 
            type: 'image', 
            src: pochetteDesktop,
            srcMobile: pochetteMobile,
            alt: 'Image 1', 
            text: 'caption1', 
            logos: [
                { src: spotifyLogo, alt: 'Spotify logo', url: 'https://open.spotify.com/intl-fr/artist/0W6mPvqyV2o6BxJsLh2u1N' },
                { src: appleMusicLogo, alt: 'Apple_music logo', url: 'https://music.apple.com/fr/artist/sarmates/1753128367' },
                { src: deezerLogo, alt: 'Deezer logo', url: 'https://www.deezer.com/fr/artist/270656742' },
                { src: bandcampLogo, alt: 'bandcamp logo', url: 'https://sarmates.bandcamp.com/album/sarmates?from=search&search_item_id=1280216646&search_item_type=a&search_match_part=%3F&search_page_id=3699891871&search_page_no=1&search_rank=1&search_sig=8d02d4a16dbc3663c3d0e7cfa4648846' },
                { src: youtubeLogo, alt: 'youtube logo', url: 'https://www.youtube.com/channel/UCD7GKasfYOhxACI6XQZgUvw' }
            ]
        },
        { 
            type: 'image', 
            src: leoff1Img,
            alt: 'Hellfest off affiche', 
            text: 'caption2', 
            cta: { url: '#galleries', text: 'watchVideo' }
        },
        { 
            type: 'video', 
            src: '/introSarmates.mp4', 
            alt: 'Video 1', 
            text: 'caption2', 
            cta: { url: '#galleries', text: 'watchVideo' }
        },
        { 
            type: 'image', 
            src: sarmates29Img,
            alt: 'Image 1', 
            text: 'caption3', 
            cta: { url: '#galleries', text: 'goToGaleries' }
        },
    ];

    let interval: ReturnType<typeof setInterval>;

    onMount(() => {
        const savedLang = document.cookie.split('; ').find(r => r.startsWith('lang='))?.split('=')[1] || 'fr';
        loadTranslations(savedLang);
        startCarousel();
    });

    function startCarousel() {
        interval = setInterval(() => {
            currentIndex.update(n => (n + 1) % items.length);
        }, 10000); // Change toutes les 5 secondes
    }

    function selectItem(index: number) {
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
                    {#if item.srcMobile}
                        <picture>
                            <source media="(max-width: 785px)" srcset={item.srcMobile}>
                            <img src={item.src} alt={item.alt} />
                        </picture>
                    {:else}
                        <img src={item.src} alt={item.alt} />
                    {/if}
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
        <button class:active={$currentIndex === index} on:click={() => selectItem(index)}></button>
        {/each}
    </div>
</section>


<style lang="scss">
    @import "../style/carousselHero.scss";



</style>