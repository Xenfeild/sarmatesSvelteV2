<script lang="ts">
    export let title: string;
    export let image: string;
    export let content: string;
    export let onClick: () => void;

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            onClick();
        }
    }

    function getExcerpt(content: string, length: number = 50): string {
        if (!content) return '';
        return content.length > length ? content.substring(0, length) + '...' : content;
    }
</script>

<div class="card" tabindex="0" on:click={onClick} on:keydown={handleKeydown}>
    <h3>{title}</h3>
    <img src={image} alt={title} />
    <p class="excerpt">{getExcerpt(content)}</p>
</div>

<style lang="scss">
    @import '../style/style.scss';
    .card {
        background: $fourth-color;
        backdrop-filter: blur(5px);
        border: 1px solid transparent;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        padding: 1rem;
        width: 322px;
        height: 400px;
        transition: transform 0.2s;
        outline: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        margin: 1rem;
            img {
             width: 290px;
             height: 250px;
             border-radius: 4px;
             object-fit: cover;
        }
    }

    .card:hover {
        border: 1px solid $third-color;
    }



    .card h3 {
        margin: 1rem 0 0;
        text-align: center;
        color: $secondary-color;
        font-family: $title-font;
        font-size: 1.5rem;
    }

    .excerpt {
        font-size: 0.875rem;
        margin-top: 0.5rem;
        text-align: center;
    }
</style>