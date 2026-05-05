<script lang="ts">
    let images = [
        '/img/galeries/1.webp',
        '/img/galeries/2.webp',
        '/img/galeries/3.webp',
        '/img/galeries/4.webp',
        '/img/galeries/5.webp',
        '/img/galeries/6.webp',
        '/img/galeries/7.webp',
        '/img/galeries/8.webp',
        '/img/galeries/9.webp',
        '/img/galeries/10.webp',
        '/img/galeries/11.webp',
        '/img/galeries/12.webp',
        '/img/galeries/13.webp',
        '/img/galeries/14.webp',
        '/img/galeries/15.webp',
        '/img/galeries/16.webp',
        '/img/galeries/17.webp',
        '/img/galeries/18.webp',
        '/img/galeries/19.webp',
    ];
    let currentIndex = 0;
    let showModal = false;
    let modalImage = '';

  
    function next() {
      currentIndex = (currentIndex + 1) % images.length;
    }
  
    function prev() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
    }

    function openModal(image: string) {
        modalImage = image;
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }
  </script>
  
  <style lang="scss">
    @import "../style/style.scss";
    .carousel {
      display: flex;
      justify-content: center;
      /* position: relative; */
      height: clamp(150px, 40vw, 479px);
      width: clamp(200px, 80vw, 720px);
      align-items: center;
      background-color: #00000048;
      backdrop-filter: blur(10px);
      margin: auto;
      overflow: hidden;
    }
    .carousel img {
      width: 100%;
      display: block;
      object-fit: cover;
      cursor: pointer;
      &:hover{
        border: 10px;
        border-color: #ff9634;
      }
    }
    .carousel-buttons {
      position: absolute;
      top: 50%;
      width: 100%;
      display: flex;
      justify-content: space-between;
      transform: translateY(-50%);
    }
    .carousel-button {
      background: rgba(0, 0, 0, 0.5);
      color: #ff9634;
      border: none;
      padding: 10px;
      cursor: pointer;
    }

    .modal {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 1000;
    }

    .modal img {
        max-width: 90%;
        max-height: 90%;
        position: relative;
        z-index: 1;
    }

    .modal-close {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        z-index: 2;
    }

    .modal-backdrop {
        position: absolute;
        inset: 0;
        background: transparent;
        border: none;
        cursor: pointer;
        width: 100%;
        height: 100%;
        z-index: 0;
    }

    .carousel-img-btn {
        background: none;
        border: none;
        padding: 0;
        width: 100%;
        display: block;
        cursor: pointer;
    }
  </style>
  
  <div class="carousel">
    {#if images.length > 0}
        <button class="carousel-img-btn" on:click={() => openModal(images[currentIndex])} aria-label="Agrandir la photo {currentIndex + 1} de la galerie">
            <img src={images[currentIndex]} alt="Galerie Sarmates {currentIndex + 1}" loading="lazy">
        </button>
        <div class="carousel-buttons">
            <button class="carousel-button" on:click={prev}>❮</button>
            <button class="carousel-button" on:click={next}>❯</button>
        </div>
    {/if}
</div>
  {#if showModal}
    <div class="modal" role="dialog" aria-modal="true">
        <button class="modal-backdrop" on:click={closeModal} aria-label="Fermer la galerie"></button>
        <button class="modal-close" on:click={closeModal} aria-label="Fermer">&times;</button>
        <img src={modalImage} alt="Vue agrandie - galerie Sarmates" loading="lazy">
    </div>
{/if}