<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { getApiUrl } from "$lib/config";
    const dispatch = createEventDispatcher();

    export let show = false;
    export let close;

    let firstName = '';
    let lastName = '';
    let email = '';
    let company = '';
    let message = '';
    let website = '';

    let sending = false;
    let success: boolean | null = null;
    let errorMsg = '';

    async function handleFormSubmit () {
        sending = true;
        success = null;
        errorMsg = '';
        try {
            const response = await fetch(getApiUrl('/send-email'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, company, message, website })
            });
            const data = await response.json();
            if (response.ok) {
                success = true;
                dispatch('submit', { firstName, lastName, email, company, message });
                firstName = lastName = email = company = message = '';
                website = '';
            } else {
                success = false;
                errorMsg = data.error || data.message || "Erreur lors de l'envoi. Merci de réessayer.";
            }
        } catch {
            success = false;
            errorMsg = 'Erreur réseau ou serveur.';
        } finally {
            sending = false;
        }
    }
</script>

{#if show}
    <div class="modal-backdrop" role="button" tabindex="-1" aria-label="Fermer" on:click={close} on:keydown={(e) => e.key === 'Escape' && close()}></div>
    <div class="modal">
        <button class="close" on:click={close}>X</button>
        <form on:submit|preventDefault={handleFormSubmit}>
          <div class="honeypot" aria-hidden="true">
            <label for="contactWebsite">Website</label>
            <input type="text" id="contactWebsite" name="website" bind:value={website} tabindex="-1" autocomplete="off">
          </div>
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" bind:value={firstName} maxlength="50" required>
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" bind:value={lastName} maxlength="50" required>
            <label for="email">Email</label>
            <input type="email" id="email" bind:value={email} maxlength="254" required>
            <label for="company">Company</label>
            <input type="text" id="company" bind:value={company} maxlength="100">
            <label for="message">Message</label>
            <textarea id="message" bind:value={message} maxlength="5000" required></textarea>
            <button type="submit" disabled={sending}>{sending ? 'Envoi...' : 'Submit'}</button>
            {#if success === true}
                <p style="color:green;">Message envoyé !</p>
            {:else if success === false}
                <p style="color:red;">{errorMsg}</p>
            {/if}
        </form>
    </div>
{/if}

<style lang="scss">
    @import "../style/footer.scss";
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: $fourth-color;
    backdrop-filter: blur(5px);
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    width: clamp(300px, 50%, 600px);
  }
  .close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  form {
    display: flex;
    flex-direction: column;
    font-family: $title-font;
  }
  .honeypot {
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }
  label {
    margin-top: 1rem;
  }
  input, textarea {
    margin-top: 0.5rem;
    padding: 0.5rem;
    font-size: 1rem;
    color: $primary-color;
    width: clamp(200px, 100%, 500px);
  }
  button {
    margin-top: 1rem;
    padding: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
  }
</style>