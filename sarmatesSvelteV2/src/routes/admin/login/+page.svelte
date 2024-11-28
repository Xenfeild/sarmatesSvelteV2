<script lang="ts">
    import { goto } from '$app/navigation';
    let username = '';
    let password = '';
    let errorMessage = '';

    async function login() {
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                document.cookie = `token=${data.token}; Path=/; HttpOnly`;
                goto('/admin');
            } else {
                errorMessage = 'Invalid username or password';
            }
        } catch (error) {
            console.error('Error logging in:', error);
            errorMessage = 'An error occurred. Please try again.';
        }
    }
</script>

<main>
    <h1>Admin Login</h1>
    <form on:submit|preventDefault={login}>
        <label for="username">Username</label>
        <input type="text" id="username" bind:value={username} required />
        
        <label for="password">Password</label>
        <input type="password" id="password" bind:value={password} required />
        
        {#if errorMessage}
            <p class="error">{errorMessage}</p>
        {/if}
        
        <button type="submit">Login</button>
    </form>
</main>

<style lang="scss">
    @import "../../../style/adminStyle.scss";
    .error {
        color: red;
    }
    input {
        color: #000;
    }
</style>