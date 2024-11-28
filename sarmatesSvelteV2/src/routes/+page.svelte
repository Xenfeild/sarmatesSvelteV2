<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../components/header.svelte";
    import CarousselHero from "../components/carousselHero.svelte";
    import { translations, loadTranslations } from '../stores/translationStore';
    import News from "../components/News.svelte";
    import Live from "../components/Live.svelte";
    import Biography from "../components/Biography.svelte";
    import Discography from "../components/Discography.svelte";
    import Galeries from "../components/Galeries.svelte";
    import Footer from "../components/Footer.svelte";

    onMount(() => {
        const userLang = navigator.language || navigator.language;
        const lang = userLang.split('-')[0]; // 'fr', 'en', 'es'
        loadTranslations(lang);
    });

    // function changeLanguage(lang: string) {
    //     loadTranslations(lang);
    // }
</script>


<main>
    <Header/>
    <CarousselHero />
    <News />
    <Live />
    <Biography />
    <Discography />
    <Galeries />
    <Footer />
</main>

<style lang="scss">
    @import "../style/style.scss";


</style>
