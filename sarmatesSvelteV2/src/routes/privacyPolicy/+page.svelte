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
                <h1>{$translations.privacyPolicy_title}</h1>
                <div id="legal">
                    <p class="last-update"><em>{$translations.privacyPolicy_lastUpdate}</em></p>
                    
                    <!-- Section 1 -->
                    <h3>{$translations.privacyPolicy_section1_title}</h3>
                    <p>{$translations.privacyPolicy_section1_p1}</p>
                    <p>{$translations.privacyPolicy_section1_p2}</p>
                    <p>{$translations.privacyPolicy_section1_p3}</p>
                    <p>{$translations.privacyPolicy_section1_p4}</p>
                    
                    <!-- Section 2 -->
                    <h3>{$translations.privacyPolicy_section2_title}</h3>
                    <p>{$translations.privacyPolicy_section2_p1}</p>
                    
                    <h4>{$translations.privacyPolicy_section2_subsection1_title}</h4>
                    <p>{$translations.privacyPolicy_section2_subsection1_p1}</p>
                    <p>{$translations.privacyPolicy_section2_subsection1_p2}</p>
                    <p>{$translations.privacyPolicy_section2_subsection1_p3}</p>
                    <p>{$translations.privacyPolicy_section2_subsection1_p4}</p>
                    <p>{$translations.privacyPolicy_section2_subsection1_p5}</p>
                    <p>{$translations.privacyPolicy_section2_subsection1_p6}</p>
                    
                    <h4>{$translations.privacyPolicy_section2_subsection2_title}</h4>
                    <p>{$translations.privacyPolicy_section2_subsection2_p1}</p>
                    <p>{$translations.privacyPolicy_section2_subsection2_p2}</p>
                    <p>{$translations.privacyPolicy_section2_subsection2_p3}</p>
                    <p>{$translations.privacyPolicy_section2_subsection2_p4}</p>
                    
                    <!-- Section 3 -->
                    <h3>{$translations.privacyPolicy_section3_title}</h3>
                    <p>{$translations.privacyPolicy_section3_p1}</p>
                    <p>{$translations.privacyPolicy_section3_p2}</p>
                    <p>{$translations.privacyPolicy_section3_p3}</p>
                    <p>{$translations.privacyPolicy_section3_p4}</p>
                    
                    <!-- Section 4 -->
                    <h3>{$translations.privacyPolicy_section4_title}</h3>
                    <p>{$translations.privacyPolicy_section4_p1}</p>
                    <p>{$translations.privacyPolicy_section4_p2}</p>
                    <p>{$translations.privacyPolicy_section4_p3}</p>
                    <p>{$translations.privacyPolicy_section4_p4}</p>
                    <p>{$translations.privacyPolicy_section4_p5}</p>
                    
                    <!-- Section 5 -->
                    <h3>{$translations.privacyPolicy_section5_title}</h3>
                    <p>{$translations.privacyPolicy_section5_p1}</p>
                    <p>{$translations.privacyPolicy_section5_p2}</p>
                    <p>{$translations.privacyPolicy_section5_p3}</p>
                    
                    <!-- Section 6 -->
                    <h3>{$translations.privacyPolicy_section6_title}</h3>
                    <p>{$translations.privacyPolicy_section6_p1}</p>
                    <p>{$translations.privacyPolicy_section6_p2}</p>
                    <p>{$translations.privacyPolicy_section6_p3}</p>
                    <p><strong>{$translations.privacyPolicy_section6_p4}</strong></p>
                    <p>{$translations.privacyPolicy_section6_p5}</p>
                    <p>{$translations.privacyPolicy_section6_p6}</p>
                    
                    <!-- Section 7 -->
                    <h3>{$translations.privacyPolicy_section7_title}</h3>
                    <p>{$translations.privacyPolicy_section7_p1}</p>
                    <p>{$translations.privacyPolicy_section7_p2}</p>
                    <p>{$translations.privacyPolicy_section7_p3}</p>
                    <p><strong>{$translations.privacyPolicy_section7_p4}</strong></p>
                    <p>{$translations.privacyPolicy_section7_p5}</p>
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
                margin-top: 2rem;
                margin-bottom: 1rem;
            }
            h4 {
                font-size: 1.2rem;
                font-weight: 400;
                margin-top: 1.5rem;
                margin-bottom: 0.8rem;
            }
            p {
                margin-top: 1rem;
                font-size: 1rem;
                font-weight: 200;
                line-height: 1.6;
                white-space: pre-wrap;
            }
            p.last-update {
                font-size: 0.9rem;
                color: #ccc;
            }
            a {
                color: $third-color;
                font-weight: bold;
            }
            strong {
                font-weight: 400;
                color: #e0e0e0;
            }
        }
    }

    


</style>