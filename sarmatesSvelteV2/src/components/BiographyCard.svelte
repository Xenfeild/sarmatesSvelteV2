<script lang="ts">
    export let name: string;
    export let image: string;
    export let role: string;
    export let onClick: () => void;

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            onClick();
        }
    }
</script>

<div class="biography-card" tabindex="0" on:click={onClick} on:keydown={handleKeydown}>
    <h3>{name}</h3>
    <img src={image} alt={name} />
    <p class="role">{role}</p>
</div>

<style lang="scss">
    @import '../style/style.scss';

    .biography-card {
        background: $fourth-color;
        backdrop-filter: blur(5px);
        border: 1px solid transparent;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        padding: 1rem;
        width: 300px;
        height: 463px;
        transition: transform 0.2s;
        outline: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        margin: 1rem;
    }

    .biography-card:hover {
        border: 1px solid $third-color;
    }

    .biography-card img {
        width: 250px;
        height: 350px;
        border-radius: 4px;
        object-fit: cover;
    }

    .biography-card h3 {
        margin: 1rem  0;
        text-align: center;
        color: $secondary-color;
    }

    .role {
        font-size: 0.875rem;
        margin: 1rem 0;
        text-align: center;
    }
</style>