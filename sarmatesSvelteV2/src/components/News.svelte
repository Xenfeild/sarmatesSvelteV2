<script lang="ts">
    import { onMount } from "svelte";
    import { translations, loadTranslations } from '../stores/translationStore';
    import Card from "./Cards.svelte";
    import Modal from "./Modal.svelte";

    interface NewsItem {
        id: number;
        title: string;
        image: string;
        content: string;
        date: string;
    }

    let news: NewsItem[] = [];
    let selectedNews: NewsItem | null = null;

    async function fetchNews(): Promise<void> {
        try {
            const response = await fetch('http://localhost:3000/api/news');
            if (response.ok) {
                news = await response.json();
            } else {
                console.error('Failed to fetch news:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    }

    function selectNews(item: NewsItem) {
        selectedNews = item;
    }

    function closeModal() {
        selectedNews = null;
    }

    onMount(() => {
        const userLang = navigator.language || navigator.language;
        const lang = userLang.split('-')[0]; // 'fr', 'en', 'es'
        loadTranslations(lang);
        fetchNews();
    });
</script>
    <h2>{$translations.news}</h2>
    <div class="content">
        <ul class="news-list">
            {#each news as item}
                <Card 
                    title={item.title}
                    image={`http://localhost:3000${item.image}`}
                    content={item.content}
                    onClick={() => selectNews(item)}
                />
            {/each}
        </ul>
    </div>


    {#if selectedNews}
        <Modal 
            title={selectedNews.title}
            image={`http://localhost:3000${selectedNews.image}`}
            content={selectedNews.content}
            date={selectedNews.date}
            onClose={closeModal}
        />
    {/if}

<style lang="scss">
    @import "../style/style.scss";

    .news-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        margin: 2rem;
    }
</style>