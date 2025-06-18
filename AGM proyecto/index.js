document.addEventListener("DOMContentLoaded", function () {
  // Elementos de la galería
  const galleryItems = document.querySelectorAll(".gallery-item img");
  const fullscreenGallery = document.querySelector(".fullscreen-gallery");
  const fullscreenImg = document.querySelector(".fullscreen-img");
  const closeBtn = document.querySelector(".close-gallery");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const imageCounter = document.querySelector(".image-counter");

  let currentIndex = 0;
  const images = Array.from(galleryItems).map((img) => ({
    src: img.src,
    alt: img.alt,
  }));

  // Abrir galería
  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      currentIndex = parseInt(this.getAttribute("data-index"));
      updateFullscreenImage();
      fullscreenGallery.style.display = "flex";
      document.body.style.overflow = "hidden"; // Evitar scroll del body
    });
  });

  // Cerrar galería
  closeBtn.addEventListener("click", closeGallery);

  // Cerrar con ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeGallery();
    }
  });

  // Navegación
  prevBtn.addEventListener("click", showPrevImage);
  nextBtn.addEventListener("click", showNextImage);

  // Navegación con teclado
  document.addEventListener("keydown", function (e) {
    if (fullscreenGallery.style.display === "flex") {
      if (e.key === "ArrowLeft") {
        showPrevImage();
      } else if (e.key === "ArrowRight") {
        showNextImage();
      }
    }
  });

  // Funciones
  function closeGallery() {
    fullscreenGallery.style.display = "none";
    document.body.style.overflow = "auto";
  }

  function updateFullscreenImage() {
    fullscreenImg.src = images[currentIndex].src;
    fullscreenImg.alt = images[currentIndex].alt;
    imageCounter.textContent = `${currentIndex + 1} / ${images.length}`;
  }

  function showPrevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateFullscreenImage();
  }

  function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateFullscreenImage();
  }
});
