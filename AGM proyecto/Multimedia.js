document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("lightgallery")) {
    const gallery = lightGallery(document.getElementById("lightgallery"), {
      selector: ".gallery-item",
      download: false,
      zoom: true,
      share: false,
      swipeToClose: true, // Permite cerrar deslizando hacia abajo
      closable: true,
      escKey: true,
    });

    // Mostrar/ocultar botón de cerrar
    gallery.on("onAfterOpen", function () {
      document.getElementById("lg-close").style.display = "block";
    });

    gallery.on("onBeforeClose", function () {
      document.getElementById("lg-close").style.display = "none";
    });

    // Evento para el botón de cerrar
    document
      .getElementById("close-gallery-btn")
      .addEventListener("click", function () {
        gallery.destroy();
        document.getElementById("lg-close").style.display = "none";
      });

    // También permitir cerrar con ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        gallery.destroy();
        document.getElementById("lg-close").style.display = "none";
      }
    });
  }

  // Inicializar animaciones WOW.js
  new WOW().init();

  // Cargar videos de YouTube de forma diferida para mejor rendimiento
  const lazyLoadVideos = () => {
    const videoWrappers = document.querySelectorAll(".video-wrapper");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const iframe = entry.target.querySelector("iframe");
            if (iframe && !iframe.src) {
              iframe.src = iframe.dataset.src;
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    videoWrappers.forEach((wrapper) => {
      observer.observe(wrapper);
    });
  };

  lazyLoadVideos();

  // Simulador de carrusel de testimonios (puedes reemplazar con un slider real)
  const testimonials = [
    {
      quote:
        "El lugar perfecto para nuestra boda. Las fotos quedaron espectaculares!",
      author: "María González",
    },
    {
      quote:
        "Excelente atención y servicio. Todos quedaron encantados con el evento.",
      author: "Juan Pérez",
    },
    {
      quote: "El mejor lugar para eventos en la ciudad. Volveremos sin duda.",
      author: "Carlos Rodríguez",
    },
  ];

  const testimonialElement = document.querySelector(".testimonial");
  if (testimonialElement) {
    let currentTestimonial = 0;

    setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      testimonialElement.style.opacity = 0;

      setTimeout(() => {
        testimonialElement.innerHTML = `
                    <p>"${testimonials[currentTestimonial].quote}"</p>
                    <cite>- ${testimonials[currentTestimonial].author}</cite>
                `;
        testimonialElement.style.opacity = 1;
      }, 500);
    }, 5000);
  }

  // Sistema de login (si es necesario)
  const loginNavLink = document.getElementById("login-nav-link");
  const loginNavText = document.getElementById("login-nav-text");

  if (loginNavLink && loginNavText) {
    // Verificar si el usuario está logueado
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userName = localStorage.getItem("userName") || "";

    if (isLoggedIn && userName) {
      loginNavText.textContent = `Hola, ${userName}`;
    }

    loginNavLink.addEventListener("click", function (e) {
      if (isLoggedIn) {
        e.preventDefault();
        // Aquí podrías mostrar un menú desplegable con opciones
        alert(`Bienvenido de nuevo, ${userName}`);
      }
      // Si no está logueado, el enlace seguirá su comportamiento normal
    });
  }
});
