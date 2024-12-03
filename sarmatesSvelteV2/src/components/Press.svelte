<script lang="ts">
    import { onMount } from "svelte";
    import { translations, loadTranslations } from '../stores/translationStore';
    import Card from "./Cards.svelte";
    import Modal from "./Modal.svelte";

    interface PressItem {
        id: number;
        title: string;
        image: string;
        content: string;
        date: string;
        link: string;
    }

    let press: PressItem[] = [];
    let selectedPress: PressItem | null = null;

    async function fetchPress(): Promise<void> {
        try {
            const response = await fetch('http://localhost:3000/api/press');
            if (response.ok) {
                press = await response.json();
            } else {
                console.error('Failed to fetch press:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching press:', error);
        }
    }

    function selectPress(item: PressItem) {
        selectedPress = item;
    }

    function closeModal() {
        selectedPress = null;
    }

    onMount(() => {
        const userLang = navigator.language || navigator.language;
        const lang = userLang.split('-')[0]; // 'fr', 'en', 'es'
        loadTranslations(lang);
        fetchPress();
    });
</script>

<section id="press">
    <h2>{$translations.press}</h2>
    <div class="content">
        <ul class="press-list">
            {#each press as item}
                <Card 
                    title={item.title}
                    image={`http://localhost:3000${item.image}`}
                    content={item.content}
                    onClick={() => selectPress(item)}
                />
            {/each}
        </ul>
    </div>


    {#if selectedPress}
        <Modal 
            title={selectedPress.title}
            image={`http://localhost:3000${selectedPress.image}`}
            content={selectedPress.content}
            date={selectedPress.date}
            link={selectedPress.link}
            onClose={closeModal}
        />
    {/if}
</section>

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