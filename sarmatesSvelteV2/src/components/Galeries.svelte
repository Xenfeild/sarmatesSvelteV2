<script>
    import { onMount } from "svelte";
    import { translations, loadTranslations } from '../stores/translationStore';
    import Carousel from "./Carousel.svelte";

    onMount(() => {
        const userLang = navigator.language || navigator.language;
        const lang = userLang.split('-')[0]; // 'fr', 'en', 'es'
        loadTranslations(lang);
    });
</script>

<section id="galleries">
    <h2>{$translations.galleries}</h2>
    <div class="content">
        <h3>Clips</h3>
        <div id="clip">
            <div class="video">
                <h4>Kötüyüm</h4>
                <iframe src="https://www.youtube.com/embed/PmH27yiXOk0?si=XMyQlidhVp1RSsFz" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
            <div class="video">
                <h4>Legion</h4>
                <iframe src="https://www.youtube.com/embed/VF_lY4yQNVU?si=WiRwkt7kxkqElJN_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>

        </div>
        <h3>Photo</h3>
        <div id="photo">
            <Carousel/>
        </div>
    </div>
</section>

<style lang="scss">
    @import "../style/style.scss";

    .content {
        flex-direction: column;
        align-items: space-around;
        padding-bottom: 5rem;
    }

    #clip {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        margin: 2rem 0;
        iframe {
            width: clamp(200px, 80vw, 800px);
            height: clamp(150px, 40vw, 500px);
        }
    }

    .video {
        margin: 1rem;
        h4 {
            color: $secondary-color;
            background-color: rgba(0, 0, 0, 0.429);
            text-align: center;
            font-family: $title-font;
            font-weight: 400;
            font-size: 1.5rem;
            padding: 0.5rem;
            text-shadow: 4px 4px 3px #000000;
        }
    }

    h3{
        color: $secondary-color;
        font-family: $title-font;
        font-weight: 400;
        font-size: 2rem;
        margin: 1rem 0;
        text-shadow: 4px 4px 3px #000000;
    }
</style>