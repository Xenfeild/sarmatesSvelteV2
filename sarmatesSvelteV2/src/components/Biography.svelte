<script lang="ts">
    import { onMount } from "svelte";
    import { translations, loadTranslations } from '../stores/translationStore';
    import BiographyCard from "./BiographyCard.svelte";
    import BiographyModal from "./BiographyModal.svelte";
    import type { BiographyItem } from '$lib/types';

    let selectedBiography: BiographyItem | null = null;

    function selectBiography(item: BiographyItem) {
        selectedBiography = item;
    }

    function closeModal() {
        selectedBiography = null;
    }

    onMount(() => {
        const userLang = navigator.language || navigator.language;
        const lang = userLang.split('-')[0]; // 'fr', 'en', 'es'
        loadTranslations(lang);
    });

    // Contenu biographie complète pour la modale
    $: fullBiographyContent = {
        name: "Sarmates",
        image: "/img/fire.webp",
        role: $translations.biography,
        content: `${$translations.biography1}

${$translations.biography2}

${$translations.biography3}`,
        // Images supplémentaires pour la modale
        additionalImages: [
            "/img/concert-85.webp",
            "/img/concert-14.webp"
        ]
    };

    $: biographyItems = [
        {
            name: "Laurent Broda",
            image: "/img/singer_bio.webp",
            role: $translations.singer,
            content: $translations.singerBio
        },
        {
            name: "Davroriin Sirok",
            image: "/img/saz_bio.webp",
            role: $translations.sarmata,
            content: $translations.sarmataBio
        },
        {
            name: "Victor Poulain",
            image: "/img/guitar_bio.webp",
            role: $translations.guitar,
            content: $translations.guitarBio
        },
        {
            name: "Antonio Xenfeild",
            image: "/img/bass_bio.webp",
            role: $translations.bass,
            content: $translations.bassBio
        },
        {
            name: "Jérémy Marie",
            image: "/img/drum_bio.webp",
            role: $translations.drum,
            content: $translations.drumBio
        }
    ];

</script>

<section id="biography">
    <h2>{$translations.biography}</h2>
    <div class="content">
        <div class="container">
            <!-- biography Content - Introduction toujours visible -->
            <div class="paragraph">
                <p>{$translations.biography1}</p>
                <img src="/img/fire.webp" alt="Fire" loading="lazy">
            </div>
            <button on:click={() => selectBiography(fullBiographyContent)} title="voir biographie complète">
                Voir la biographie complète
            </button>
        </div>
    </div>
    <h2>{$translations.lineUp}</h2>
    <div class="content">
        <ul class="biography-list">
            {#each biographyItems as item}
                <BiographyCard 
                    name={item.name}
                    image={item.image}
                    role={item.role}
                    onClick={() => selectBiography(item)}
                />
            {/each}
        </ul>
    </div>
    {#if selectedBiography}
        <BiographyModal 
            name={selectedBiography.name}
            image={selectedBiography.image}
            role={selectedBiography.role}
            content={selectedBiography.content}
            onClose={closeModal}
        />
    {/if}
</section>

<style lang="scss">
    @import "../style/style.scss";

    #biography {
        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: max-height 0.3s ease-in-out;
            overflow: hidden;
            // max-height: 500px; /* Hauteur par défaut */

            &.expanded {
                max-height: none; /* Hauteur agrandie */
            }
        }

        .container {
            max-width: 90%;
            margin: 0 auto;
            transition: height 0.3s ease-in-out;
            height: auto;
            margin: 2rem;

            &.expanded {
                height: auto; /* Hauteur agrandie */
            }
        }

        .paragraph {
            margin-bottom: 1rem;
            display: flex;
            flex-direction: column; /* Par défaut en colonne */

            @media (min-width: 785px) {
                flex-direction: row; /* En ligne pour les écrans plus larges */
            }
        }

        p {
            font-size: clamp(12px, 1.5vw, 1.5rem);
            margin-bottom: 1rem;
            font-weight: 200;
            text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
            width: 90%; /* Largeur par défaut pour les petits écrans */

            @media (min-width: 785px) {
                width: 50%; /* Largeur pour les écrans plus larges */
                padding: 1rem;
            }
        }

        img {
            max-width: 90%; /* Largeur par défaut pour les petits écrans */
            height: auto;
            border-radius: 4px;
            object-fit: contain;
            margin-bottom: 1rem;

            @media (min-width: 785px) {
                max-width: 50%; /* Largeur pour les écrans plus larges */
                padding: 1rem;
            }
        }
        .biography-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        margin: 2rem;
    }
    }
</style>