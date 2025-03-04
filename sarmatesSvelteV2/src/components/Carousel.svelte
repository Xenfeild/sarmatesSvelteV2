<script lang="ts">
    let images = [
        'src/lib/img/galeries/1.webp',
        'src/lib/img/galeries/2.webp',
        'src/lib/img/galeries/3.webp',
        'src/lib/img/galeries/4.webp',
        'src/lib/img/galeries/5.webp',
        'src/lib/img/galeries/6.webp',
        'src/lib/img/galeries/7.webp',
        'src/lib/img/galeries/8.webp',
        'src/lib/img/galeries/9.webp',
        'src/lib/img/galeries/10.webp',
        'src/lib/img/galeries/11.webp',
        'src/lib/img/galeries/12.webp',
        'src/lib/img/galeries/13.webp',
        'src/lib/img/galeries/14.webp',
        'src/lib/img/galeries/15.webp',
        'src/lib/img/galeries/16.webp',
        'src/lib/img/galeries/17.webp',
        'src/lib/img/galeries/18.webp',
        'src/lib/img/galeries/19.webp',
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
  
  <style>
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
    }
  </style>
  
  <div class="carousel">
    {#if images.length > 0}
        <img src={images[currentIndex]} alt="Photo ${currentIndex + 1}" on:click={() => openModal(images[currentIndex])}>
        <div class="carousel-buttons">
            <button class="carousel-button" on:click={prev}>❮</button>
            <button class="carousel-button" on:click={next}>❯</button>
        </div>
    {/if}
</div>
  {#if showModal}
    <div class="modal" on:click={closeModal}>
        <button class="modal-close" on:click={closeModal}>&times;</button>
        <img src={modalImage} alt="Modal Image">
    </div>
{/if}