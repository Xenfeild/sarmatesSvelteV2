<script lang="ts">
    export let title: string;
    export let image: string;
    export let content: string;
    export let date: string;
    export let link: string | null = null;
    export let onClose: () => void;

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            onClose();
        }
    }
</script>

<div class="modal" role="dialog" aria-modal="true" on:keydown={handleKeydown}>
    <div class="modal-content">
        <button class="close" on:click={onClose} aria-label="Close modal">&times;</button>
        <h2>{title}</h2>
        <div class="modal-body">
            <img src={image} alt={title} />
            <p>{content}</p>
            <p>{date}</p>
            <a href={link} target="_blank">{link}</a>
        </div>
    </div>
</div>

<style lang="scss">
    @import '../style/style.scss';

    .modal {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 15%;
        left: 0;
        width: 100%;
        height: 70%;
        background: rgba(0, 0, 0, 0.5);
        outline: none;
        z-index: 1000;
    }

    .modal-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        background: $fourth-color;
        backdrop-filter: blur(5px);
        padding: 2rem;
        border-radius: 8px;
        max-height: 85%;
        width: 90%;
        max-height: calc(100vh - 100px); /* Limite la hauteur maximale en dessous du header */
        overflow-y: auto; /* Ajoute un défilement vertical */
        position: relative;
        h2 {
            margin-bottom: 1rem;
        }
        img {
            max-width: 90%;
            margin-bottom: 1rem;
        }
        p {
            font-size: clamp(12px, 1.5vw, 1.5rem);
            font-weight: 200;
            margin-bottom: 1rem;
        }
    }

    .modal-body {
        max-height: calc(100vh - 200px); /* Limite la hauteur maximale du contenu */
        

    }

    .close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 1.5rem;
        cursor: pointer;
        background: none;
        border: none;
        color: #fff;
    }
</style>