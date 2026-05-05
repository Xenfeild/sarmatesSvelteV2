<script lang="ts">
    export let name: string;
    export let image: string;
    export let role: string;
    export let content: string;
    export let onClose: () => void;

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            onClose();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="biography-modal">
    <div class="modal-content">
        <button class="close" on:click={onClose} aria-label="Close modal">&times;</button>
        <h2>{name}</h2>
        <div class="modal-body">
            {#if name === "Sarmates"}
                <!-- Contenu spécial pour la biographie complète -->
                <div class="paragraph">
                    <p>{content.split('\n\n')[0]}</p>
                    <img src="/img/fire.webp" alt="Feu sur scène lors d'un concert de Sarmates" loading="lazy" />
                </div>
                <div class="paragraph">
                    <img src="/img/concert-85.webp" alt="Concert Sarmates" loading="lazy" />
                    <p>{content.split('\n\n')[1]}</p>
                </div>
                <div class="paragraph">
                    <p>{content.split('\n\n')[2]}</p>
                    <img src="/img/concert-14.webp" alt="Scène Sarmates" loading="lazy" />
                </div>
            {:else}
                <!-- Contenu normal pour les membres -->
                <img src={image} alt={name} loading="lazy" />
                <p class="role">{role}</p>
                <p>{content}</p>
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    @import '../style/style.scss';
    .biography-modal {
        display: flex;
        justify-content: center;
        align-items: flex-start; /* Alignement en haut pour permettre le scroll */
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        outline: none;
        z-index: 1000;
        padding: 2rem 1rem; /* Padding pour éviter les bords */
        overflow-y: auto; /* Scroll sur le container principal */
    }

    .modal-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        background: $fourth-color;
        backdrop-filter: blur(5px);
        padding: 2rem;
        border-radius: 8px;
        width: 80%;
        margin: 2rem auto; /* Centré avec marge */
        position: relative;
        h2 {
            margin-bottom: 1rem;
        }
        img {
            max-width: 90%;
            margin-bottom: 1rem;
        }
        .role {
            font-size: 1rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }
        p {
            font-size: clamp(12px, 1.5vw, 1.5rem);
            font-weight: 200;
            margin-bottom: 1rem;
        }
        
        .paragraph {
            margin-bottom: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            
            img {
                max-width: 90%; /* Même taille que Biography originale */
                height: auto;
                border-radius: 4px;
                object-fit: contain;
                margin-bottom: 1rem;
            }
            
            @media (min-width: 785px) {
                flex-direction: row;
                align-items: flex-start;
                
                img {
                    max-width: 50%; /* Même taille que Biography originale */
                    padding: 1rem;
                    margin: 0;
                }
                
                p {
                    flex: 1;
                    text-align: left;
                }
            }
        }
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