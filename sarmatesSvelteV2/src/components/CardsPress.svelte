<script lang="ts">
    export let title: string;
    export let image: string;
    export let content: string;
    export let link: string;
    
    function getExcerpt(content: string, length: number = 50): string {
        if (!content) return '';
        return content.length > length ? content.substring(0, length) + '...' : content;
    }
</script>


<!-- <div class="card" tabindex="0" on:click={onClick} on:keydown={handleKeydown}> -->
<a class="card" href={link} target="_blank" tabindex="0">
    <h3>{title}</h3>
    <div class="imgBox">
        <img src={image} alt={title} />
    </div>
    <p class="excerpt">{getExcerpt(content)}</p>
</a>
<!-- </div> -->

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
        height: 430px;
        transition: transform 0.2s;
        outline: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        margin: 1rem;
        .imgBox{
            width: 290px;
            height: 250px;
            
            img {
             width: 100%;
             height: 100%;
             border-radius: 4px;
             object-fit: contain;
        }
        }
            
    }

    .card:hover {
        border: 1px solid $third-color;
    }



    .card h3 {
        margin: 0.5rem 0 0;
        text-align: center;
        color: $secondary-color;
        font-family: $title-font;
        font-size: 1.1rem;
    }

    .excerpt {
        font-size: 0.875rem;
        margin-top: 0.5rem;
        text-align: center;
    }
</style>