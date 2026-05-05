<script lang="ts">
    import { onMount } from "svelte";
    import { translations, loadTranslations } from '../stores/translationStore';
    import { api } from '$lib/services/api';
    import { getUploadUrl } from '$lib/config';
    import type { PressItem } from '$lib/types';
    import Card from "./CardsPress.svelte";

    let press: PressItem[] = [];

    async function fetchPress(): Promise<void> {
        try {
            press = await api.getPress();
        } catch (error) {
            console.error('Error fetching press:', error);
        }
    }


    onMount(() => {
        const userLang = navigator.language || navigator.language;
        const lang = userLang.split('-')[0]; // 'fr', 'en', 'es'
        loadTranslations(lang);
        fetchPress();
    });
</script>

<h2>{$translations.press}</h2>
<div class="content">
    <ul class="press-list">
        {#each press as item}
            <Card
                title={item.title}
                image={getUploadUrl(item.image)}
                content={item.content}
                link={item.link}
            />
        {/each}
    </ul>
</div>

<style lang="scss">
    @import "../style/style.scss";

    .press-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        margin: 2rem;
    }
</style>