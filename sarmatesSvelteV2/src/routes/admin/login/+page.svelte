<script lang="ts">
    import { goto } from '$app/navigation';
    import { getApiUrl } from '$lib/config';
    let username = '';
    let password = '';
    let errorMessage = '';

    async function login() {
        try {
            const response = await fetch(getApiUrl('/api/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                goto('/admin');
            } else if (response.status === 429) {
                const data = await response.json();
                errorMessage = data.error || 'Trop de tentatives de connexion. Réessayez dans 15 minutes.';
            } else {
                const remaining = response.headers.get('RateLimit-Remaining');
                const attemptsLeft = remaining !== null ? parseInt(remaining) : null;
                if (attemptsLeft !== null && attemptsLeft <= 7) {
                    const plural = attemptsLeft > 1 ? 's' : '';
                    errorMessage = `Identifiant ou mot de passe incorrect. ${attemptsLeft} tentative${plural} restante${plural}.`;
                } else {
                    errorMessage = 'Identifiant ou mot de passe incorrect.';
                }
            }
        } catch (error) {
            console.error('Error logging in:', error);
            errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
    }
</script>

<main>
    <h1>Admin Login</h1>
    <div class="form">
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
    </div>
</main>

<style lang="scss">
    @import "../../../style/adminStyle.scss";

    .form{
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 95vh;
        justify-content: center;
        font-family: $title-font;
        
    }
    .error {
        color: red;
    }
    input {
        color: #000;
    }
</style>