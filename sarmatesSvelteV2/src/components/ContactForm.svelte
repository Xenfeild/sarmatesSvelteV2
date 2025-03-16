<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let show = false;
    export let close;

    let firstName = '';
    let lastName = '';
    let email = '';
    let company = '';
    let message = '';

    function handleFormSubmit () {
        const formData = {
            firstName,
            lastName,
            email,
            company,
            message
        };
        dispatch('submit', formData);
    }
</script>

{#if show}
    <div class="modal-backdrop" on:click={close}></div>
    <div class="modal">
        <button class="close" on:click={close}>X</button>
        <form on:submit|preventDefault={handleFormSubmit}>
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" bind:value={firstName} required>
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" bind:value={lastName} required>
            <label for="email">Email</label>
            <input type="email" id="email" bind:value={email} required>
            <label for="company">Company</label>
            <input type="text" id="company" bind:value={company}>
            <label for="message">Message</label>
            <textarea id="message" bind:value={message} required></textarea>
            <button type="submit">Submit</button>
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