<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    const consentGiven = writable(false);
    const nonEssentialCookiesAccepted = writable(false);

    onMount(() => {
        const consent = localStorage.getItem("cookieConsent");
        const nonEssentialConsent = localStorage.getItem("nonEssentialCookieConsent");
        console.log("Consent from localStorage:", consent);
        if (consent === "true") {
            consentGiven.set(true);
        }
        if (nonEssentialConsent === "true") {
            nonEssentialCookiesAccepted.set(true);
        }
    });

    function acceptCookies() {
        console.log("Accepting cookies");
        localStorage.setItem("cookieConsent", "true");
        localStorage.setItem("nonEssentialCookieConsent", "true");
        consentGiven.set(true);
        nonEssentialCookiesAccepted.set(true);
    }

    function rejectNonEssentialCookies() {
        console.log("Rejecting non-essential cookies");
        localStorage.setItem("nonEssentialCookieConsent", "false");
        nonEssentialCookiesAccepted.set(false);
    }
</script>

<style lang="scss">
    @import "../style/style.scss";
    .cookie-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #000000;
        color: #ffffff;
        padding: 10 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 3000;
    }
    .cookie-banner p {
        margin: 0;
    }
    .cookie-banner button {
        background-color: #ff9634;
        color: #000000;
        border: none;
        padding: 1px;
        cursor: pointer;
        margin: 0 10px;
        &:hover {
            background-color: darken($color:#dd6e06, $amount: 0);
            color: $secondary-color;
        }
    }
</style>

{#if !$consentGiven}
    <div class="cookie-banner">
        <p>Nous utilisons des cookies fonctionnels pour améliorer votre expérience. Ces cookies sont obligatoires. Vous pouvez choisir de refuser les cookies non essentiels.</p>
        <button on:click={acceptCookies}>Accepter tous les cookies</button>
        <button on:click={rejectNonEssentialCookies}>Refuser les cookies non essentiels</button>
    </div>
{/if}