<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../components/header.svelte";
    import CarousselHero from "../components/carousselHero.svelte";
    import { translations, loadTranslations } from '../stores/translationStore';
    import News from "../components/News.svelte";
    import Live from "../components/Live.svelte";
    import Press from "../components/Press.svelte";
    import Biography from "../components/Biography.svelte";
    import Discography from "../components/Discography.svelte";
    import Galeries from "../components/Galeries.svelte";
    import Footer from "../components/Footer.svelte";

    onMount(() => {
        const userLang = navigator.language || navigator.language;
        const lang = userLang.split('-')[0]; // 'fr', 'en', 'es'
        loadTranslations(lang);
    });
</script>

<main>
    <Header/>
    <section id="/">
        <CarousselHero />
    </section>
    <section id="news">
        <News />
    </section>
    <section id="live">
        <Live />
        <div class="link">
            <a href="live">
                <button>{$translations.allLive}</button>
            </a>
        </div>
    </section>
    <section id="press">
        <Press />
    </section>
    <section id="biography">
        <Biography />
    </section>
    <section id="discography">
        <Discography />
    </section>
    <section class="galeries">
        <Galeries />
    </section>
    <Footer />
</main>

<style lang="scss">
    @import "../style/style.scss";
</style>
