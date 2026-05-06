<script lang="ts">
    import { onMount } from "svelte";
    import { translations, loadTranslations } from '../../stores/translationStore';
    import Footer from "../../components/Footer.svelte";
    import Header from "../../components/header.svelte";

    onMount(() => {
        const savedLang = document.cookie.split('; ').find(r => r.startsWith('lang='))?.split('=')[1];
        if (savedLang) {
            loadTranslations(savedLang);
        } else {
            const browserLang = (navigator.language || 'en').split('-')[0];
            const supportedLangs = ['fr', 'es', 'en'];
            const lang = supportedLangs.includes(browserLang) ? browserLang : 'en';
            loadTranslations(lang);
        }
    }); 
</script>
<main>
    <Header />
        <section>
            <div>
                <h1>{$translations.legalNotice}</h1>
                <div id="legal">
                    <p>{$translations.legalP1}</p>
                    <h3>{$translations.websitePublishing}</h3>
                    <p>{$translations.legalP2}</p>
                    <p>{$translations.legalP3}</p>
                    <h3>{$translations.hosting}</h3>
                    <p>{$translations.legalP4}</p>
                    <h3>{$translations.publicationDirector}</h3>
                    <p>{$translations.legalP5}</p>
                    <h3>{$translations.contactUs}</h3>
                    <p>{$translations.legalP6} : +33770041366</p>
                    <p>{$translations.legalP7} : admin@sarmates-music.com</p>
                    <p>{$translations.legalP8} : 21 avenue de Bretagne - 76100 ROUEN</p>
                    <h3>{$translations.personalData}</h3>
                    <p>{$translations.legalP9}</p>
                    <p>{$translations.legalP10} <a href="https://www.legalstart.fr/">Legalstart.fr.</a></p>
                </div>
            </div>
        </section>
    <Footer />
</main>
<style lang="scss">
    @import "../../style/style.scss";


    section{
        background-image: url("../../lib/img/back_sarmates.webp");
        background-attachment: fixed;
        background-position: center;
        padding: 1rem;
    }
    div { 
        font-family: $title-font;
        h1 {
            font-weight: 400;
            text-align: center;
            font-size: 3rem;
            color: white;
            padding-top: 7rem;
        }
        #legal {
            background-color: rgba(0, 0, 0, 0.808);
            padding: 2rem;
            margin: 2rem;
            border-radius: 8px;
            color: white;
            h3 {
                font-size: 1.5rem;
                font-weight: 400;
                margin-top: 1rem;
            }
            p {
                margin-top: 1rem;
                font-size: 1rem;
                font-weight: 200;
            }
            a {
                color: $third-color;
                font-weight: bold;
            }
        }
    }

    


</style>