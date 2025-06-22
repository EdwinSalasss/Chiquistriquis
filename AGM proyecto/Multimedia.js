document.addEventListener("DOMContentLoaded", function () {
  // Inicializar animaciones
  initAnimations();

  // Configurar galería de imágenes
  setupImageGallery();

  // Configurar botón de carga más
  setupLoadMoreButton();

  // Configurar testimonios
  setupTestimonials();

  // Configurar eventos de hover
  setupHoverEffects();
});

function initAnimations() {
  // Agregar clase animated a elementos con atributos data-animate
  document.querySelectorAll("[data-animate]").forEach((element) => {
    const animation = element.getAttribute("data-animate");
    element.classList.add("animate__animated", `animate__${animation}`);
  });
}

function setupImageGallery() {
  // Elementos de la galería
  const galleryItems = document.querySelectorAll(".gallery-item");
  const fullscreenGallery = document.querySelector(".fullscreen-gallery");
  const fullscreenImg = document.querySelector(".fullscreen-img");
  const closeBtn = document.querySelector(".close-gallery");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const imageCounter = document.querySelector(".image-counter");

  let currentIndex = 0;
  const images = Array.from(galleryItems).map((item, index) => ({
    src: item.querySelector("img").src,
    alt: item.querySelector("img").alt,
    index: index,
  }));

  // Abrir galería al hacer clic en cualquier parte del gallery-item
  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      currentIndex = parseInt(
        this.querySelector("img").getAttribute("data-index")
      );
      openGallery();
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
    if (fullscreenGallery.classList.contains("active")) {
      if (e.key === "ArrowLeft") {
        showPrevImage();
      } else if (e.key === "ArrowRight") {
        showNextImage();
      }
    }
  });

  // Funciones de la galería
  function openGallery() {
    updateFullscreenImage();
    fullscreenGallery.style.display = "flex";
    document.body.style.overflow = "hidden";

    // Pequeño retraso para activar la opacidad (para la transición)
    setTimeout(() => {
      fullscreenGallery.classList.add("active");
    }, 10);
  }

  function closeGallery() {
    fullscreenGallery.classList.remove("active");

    // Esperar a que termine la transición de opacidad antes de ocultar
    setTimeout(() => {
      fullscreenGallery.style.display = "none";
      document.body.style.overflow = "auto";
    }, 300);
  }

  function updateFullscreenImage() {
    const imgData = images.find((img) => img.index === currentIndex);
    if (imgData) {
      fullscreenImg.src = imgData.src;
      fullscreenImg.alt = imgData.alt;
      imageCounter.textContent = `${currentIndex + 1} / ${images.length}`;

      // Agregar animación al cambiar imagen
      fullscreenImg.classList.add("animate__animated", "animate__fadeIn");
      setTimeout(() => {
        fullscreenImg.classList.remove("animate__animated", "animate__fadeIn");
      }, 500);
    }
  }

  function showPrevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateFullscreenImage();
  }

  function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateFullscreenImage();
  }
}

function setupLoadMoreButton() {
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (!loadMoreBtn) return;

  loadMoreBtn.addEventListener("click", function () {
    // Simular carga de más elementos
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';

    // Simular retraso de red
    setTimeout(() => {
      // Aquí iría la lógica para cargar más imágenes
      // Por ahora solo mostramos un mensaje
      alert("Se cargarían más eventos en una implementación real");

      // Restaurar el botón
      this.innerHTML = '<i class="fas fa-plus-circle"></i> Cargar más eventos';

      // Agregar animación de confirmación
      this.classList.add("animate__animated", "animate__pulse");
      setTimeout(() => {
        this.classList.remove("animate__animated", "animate__pulse");
      }, 1000);
    }, 1500);
  });
}

function setupTestimonials() {
  const testimonialItems = document.querySelectorAll(".testimonial-item");
  if (testimonialItems.length === 0) return;

  let currentTestimonial = 0;

  // Rotar testimonios cada 5 segundos
  setInterval(() => {
    testimonialItems[currentTestimonial].classList.remove("animate__fadeIn");
    testimonialItems[currentTestimonial].style.display = "none";

    currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;

    testimonialItems[currentTestimonial].style.display = "block";
    testimonialItems[currentTestimonial].classList.add(
      "animate__animated",
      "animate__fadeIn"
    );
  }, 5000);
}

function setupHoverEffects() {
  // Efecto hover para los items de video
  const videoItems = document.querySelectorAll(".video-item");
  videoItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      const videoWrapper = this.querySelector(".video-wrapper");
      if (videoWrapper) {
        videoWrapper.style.transform = "scale(1.02)";
        videoWrapper.style.transition = "transform 0.3s ease";
      }
    });

    item.addEventListener("mouseleave", function () {
      const videoWrapper = this.querySelector(".video-wrapper");
      if (videoWrapper) {
        videoWrapper.style.transform = "scale(1)";
      }
    });
  });

  // Efecto hover para los botones sociales
  const socialLinks = document.querySelectorAll(".social-links a");
  socialLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.classList.add("animate__animated", "animate__rubberBand");
    });

    link.addEventListener("mouseleave", function () {
      this.classList.remove("animate__animated", "animate__rubberBand");
    });
  });
}
