<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    function logout() {
        localStorage.removeItem('token');
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
    @import "../style/adminStyle.scss";

    .admin-header {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        padding: 1rem;
        background-color: #33333388;
        color: #fff;
        margin: 0;

        nav ul {
            display: flex;
            list-style: none;
            padding: 0;

            li {
                margin-right: 1rem;

                a, button {
                    color: #fff;
                    text-decoration: none;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: clamp(1rem, 2vw, 1.5rem);
                }

                button:hover, a:hover {
                    color: #ffda32;
                }
            }
        }
    }
</style>