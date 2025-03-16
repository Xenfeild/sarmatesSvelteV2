<script>
  import { onMount } from "svelte";
  import { translations, loadTranslations } from '../stores/translationStore';
  import ContactForm from "./ContactForm.svelte";
  import NewsletterForm from "./NewsletterForm.svelte";

  let showModal = false;
  let showNewsletterModal = false; // Ajout de la variable

  function openModal() {
      showModal = true;
  }

  function closeModal() {
      showModal = false;
  }

  function openNewsletterModal() {
      showNewsletterModal = true;
  }

  function closeNewsletterModal() {
      showNewsletterModal = false;
  }

  /**
   * Handle form submit event
   * @param {CustomEvent} event
   */
  function handleFormSubmit(event) {
      const formData = event.detail;
      console.log('Form data :', formData);
      closeModal();
  }

  onMount(() => {
      const userLang = navigator.language || navigator.language;
      const lang = userLang.split('-')[0]; // 'fr', 'en', 'es'
      loadTranslations(lang);
  });
</script>

<footer>
  <!-- social icons div -->
  <div class="socialIcon">
      <a target="_blank" href="https://www.facebook.com/sarmates"><i class="fa-brands fa-facebook"></i></a>
      <a target="_blank" href="https://www.instagram.com/sarmates.music/?hl=fr"><i class="fa-brands fa-instagram"></i></a>
      <a target="_blank" href="https://open.spotify.com/intl-fr/artist/0W6mPvqyV2o6BxJsLh2u1N"><i class="fa-brands fa-spotify"></i></a>
      <a target="_blank" href="https://music.apple.com/fr/artist/sarmates/1753128367"><i class="fa-brands fa-itunes"></i></a>
      <a target="_blank" href="https://www.deezer.com/fr/artist/270656742"><i class="fa-brands fa-deezer"></i></a>
      <a target="_blank" href="https://www.youtube.com/@SarmatesMusic"><i class="fa-brands fa-youtube"></i></a>
      <a target="_blank" href="https://sarmates.bandcamp.com/album/sarmates"><i class="fa-brands fa-bandcamp"></i></a>
      <a target="_blank" href="https://soundcloud.com/we-are-sarmates"><i class="fa-brands fa-soundcloud"></i></a>
      <a href="javascript:void(0);" on:click={openModal}><i class="fa-sharp fa-solid fa-envelope"></i></a>
  </div>

  <!-- newsletter div -->
  <div class="newsletter">
      <button title="Newsletter button" on:click={openNewsletterModal}>Newsletter</button>
  </div>
  
  <!-- legal mentions -->
  <nav class="mentionsLink">
      <ul>
          <li></li>
          <li><a href="/legalMentions" class="footer-link">{$translations.legalMentions}</a></li>
      </ul>
  </nav>
</footer>

<ContactForm show={showModal} close={closeModal} on:submit={handleFormSubmit} />
<NewsletterForm show={showNewsletterModal} close={closeNewsletterModal} />

<style lang="scss">
  @import "..//style/footer.scss";
</style>