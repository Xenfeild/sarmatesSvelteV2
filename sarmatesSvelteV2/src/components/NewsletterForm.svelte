<script>
    export let show = false;
    export let close;
</script>

{#if show}
    <div class="modal-backdrop" role="button" tabindex="-1" aria-label="Fermer" on:click={close} on:keydown={(e) => e.key === 'Escape' && close()}></div>
    <div class="modal">
        <button class="close" on:click={close}>X</button>
        <iframe title="Newsletter Sarmates" width="540" height="750" src="https://7acde5b9.sibforms.com/serve/MUIFAH-gEOkgkmiRBMZOq1mGKs4N-PNsigOPpsLKIATLom0zFP1FmlgMWJE-Re2U9HEJTFNu9IhL16ZW-n3TzvB6ydCE2IUcw4McmsF5qDEjMcIFq2Msy--3C0p462YlwOEc1khP_MvKzMFB1Qq2U__8HRCRJPsKJI2QQlFW14RY-W-CeXA0cNB21TT5WCHGCJOYzRDBsRaF4bZh" frameborder="0" scrolling="auto" allowfullscreen style="display: block;margin-left: auto;margin-right: auto;max-width: 100%;"></iframe>
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