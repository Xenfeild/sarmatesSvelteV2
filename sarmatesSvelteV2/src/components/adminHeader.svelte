<script lang="ts">
    import { goto } from '$app/navigation';
    import { getApiUrl } from '$lib/config';

    async function logout() {
        await fetch(getApiUrl('/api/logout'), {
            method: 'POST',
            credentials: 'include'
        });
        goto('/admin/login');
    }
</script>

<header class="admin-header">
    <nav>
        <ul>
            <li><a href="/admin">Home</a></li>
            <li><a href="/admin/news">News</a></li>
            <li><a href="/admin/press">Press</a></li>
            <li><a href="/admin/live">Live</a></li>
            <li><button on:click={logout}>Logout</button></li>
        </ul>
    </nav>
</header>

<style lang="scss">
    $primary-color: #0d0d0d;
    $secondary-color: #fff;
    $third-color: #ff9634;
    $title-font: 'Lexend Exa', sans-serif;

    .admin-header {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        background-color: $primary-color;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        
        nav ul {
            display: flex;
            list-style: none;
            padding: 0;
            margin: 0;
            gap: 2rem;

            li a, li button {
                color: $secondary-color;
                text-decoration: none;
                background: none;
                border: none;
                cursor: pointer;
                font-size: clamp(1rem, 2vw, 1.5rem);
                font-family: $title-font;
                padding: 0.5rem;
                
                &:hover {
                    color: $third-color;
                }
            }
            
            li button {
                background-color: $third-color;
                color: $primary-color;
                border-radius: 5px;
                
                &:hover {
                    background-color: darken($third-color, 10%);
                    color: $secondary-color;
                }
            }
        }
    }
</style>