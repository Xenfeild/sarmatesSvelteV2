<script lang="ts">
    import sarmatesLogo from "/src/lib/img/logo/logo_sarmates_modified.svg";
    import frenchFlag from "/src/lib/img/icons8-france-circulaire-48.webp";
    import englishFlag from "/src/lib/img/icons8-anglais-48.webp";
    import spanishFlag from "/src/lib/img/icons8-espagne2-circulaire-48.webp";
    // import { createEventDispatcher } from "svelte";
    import { translations, loadTranslations } from "../stores/translationStore";
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
  
    // navbar fonctions
    let isNavVisible = false;
  
    function toggleNav() {
      isNavVisible = !isNavVisible;
    }
  
    // language selector
    let selectedFlag = englishFlag;
  
    onMount(() => {
      loadTranslations('fr'); // Charger les traductions par défaut
    });
  
    function handleLanguageChange(lang: string) {
      loadTranslations(lang);
      switch (lang) {
        case 'fr':
          selectedFlag = frenchFlag;
          break;
        case 'en':
          selectedFlag = englishFlag;
          break;
        case 'es':
          selectedFlag = spanishFlag;
          break;
      }
    }
  
  </script>
  
  <style lang="scss">
    // @import "../style/style.scss";
    @import "../style/header.scss";
    // @import "../style/burgerSVG.scss";
  
  </style>
  
  <header>
    <a href="/">
      <img src="{sarmatesLogo}" alt="logo">
    </a>
    <!-- button nav -->
    <button class="burger-menu" on:click={toggleNav}>
      <svg class="hb" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" stroke="#eee" stroke-width=".6" fill="rgba(0,0,0,0)" stroke-linecap="round" style="cursor: pointer">
        <path d="M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7">
          <animate dur="0.2s" attributeName="d" values="M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7;M3,3L5,5L7,3M5,5L5,5M3,7L5,5L7,7" fill="freeze" begin="start.begin" />
          <animate dur="0.2s" attributeName="d" values="M3,3L5,5L7,3M5,5L5,5M3,7L5,5L7,7;M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7" fill="freeze" begin="reverse.begin" />
        </path>
        <rect width="10" height="10" stroke="#fff">
          <animate dur="2s" id="reverse" attributeName="width" begin="click" />
        </rect>
        <rect width="10" height="10" stroke="#fff">
          <animate dur="0.001s" id="start" attributeName="width" values="10;0" fill="freeze" begin="click" />
          <animate dur="0.001s" attributeName="width" values="0;10" fill="freeze" begin="reverse.begin" />
        </rect>
      </svg>
    </button>
    <nav class="{isNavVisible ? 'navVisible' : ''}">
      <ul>
        <li><a href="/#news">{$translations.news}</a></li>
        <li><a href="/#live">{$translations.live}</a></li>
        <li><a href="/#press">{$translations.press}</a></li>
        <li><a href="/#biography">{$translations.biography}</a></li>
        <li><a href="/#discography">{$translations.discography}</a></li>
        <li><a href="/#galleries">{$translations.galleries}</a></li>
        <li class="legal-mention">{$translations.legalMentions}</li>
        <div class="language-selector">
          <img src={selectedFlag} alt="Selected Language" class="selected">
          <div class="dropdown-content">
            <img src={frenchFlag} alt="Français" class="flag" on:click={() => handleLanguageChange('fr')}>
            <img src={englishFlag} alt="English" class="flag" on:click={() => handleLanguageChange('en')}>
            <img src={spanishFlag} alt="Español" class="flag" on:click={() => handleLanguageChange('es')}>
          </div>
        </div>
      </ul>
    </nav> 
  </header>