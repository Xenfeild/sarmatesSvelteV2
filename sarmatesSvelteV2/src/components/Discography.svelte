<script>
    import { onMount } from "svelte";
    import { translations, loadTranslations } from '../stores/translationStore';

    onMount(() => {
        const userLang = navigator.language || navigator.language;
        const lang = userLang.split('-')[0]; // 'fr', 'en', 'es'
        loadTranslations(lang);
    });
</script>

<section id="discography">
    <h2>{$translations.discography}</h2>
    <div class="content">
        <div class="container">
            <h3>Sarmates</h3>
            <iframe style="border-radius:12px" src="https://open.spotify.com/embed/artist/0W6mPvqyV2o6BxJsLh2u1N?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
    </div>
</section> 

<style lang="scss">
    @import "../style/style.scss";

    .container{
        width: 90%;
        h3 {
            text-align: center;
            font-family: $title-font;
            font-size: 2rem;
            font-weight: 400;
            margin-bottom: 1rem;
        }
        }
</style>