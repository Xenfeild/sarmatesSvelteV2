<script>
    import { onMount } from "svelte";
    import { translations, loadTranslations } from '../stores/translationStore';

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
        <a target="_blank" href="https://www.youtube.com/@SarmatesMusic"><i class="fa-brands fa-youtube"></i></a>
        <a target="_blank" href="https://soundcloud.com/we-are-sarmates"><i class="fa-brands fa-soundcloud"></i></a>
        <a href="#contactPop"><i class="fa-sharp fa-solid fa-envelope"></i></a>
    </div>

    <!-- newsletter div -->
    <div class="newsletter">
      <a href="#popupNewsletter"><button title="Newsletter button">Newsletter</button></a>
    </div>
    
    <!-- legal mentions -->
    <nav class="mentionsLink">
      <ul>
        <li>           
        </li>
        <li><a href="/es/legalNotice_es.html" class="footer-link">{$translations.legalMentions}</a></li>
        <!-- <li><a href="" class="footer-link">CGU</a></li> -->
      </ul>
    </nav>
  </footer>

  <style lang="scss">
    @import "../style/footer.scss";
</style>