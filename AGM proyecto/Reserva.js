//Autenticación y llenado de datos
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    localStorage.setItem("returnUrl", window.location.href);
    localStorage.setItem("loginMessage", "Por favor, inicie sesión para iniciar su reserva.");

    window.location.href = "Sesion.html";
  } else {
    document.getElementById("nombre").value = user.name || "";
    document.getElementById("correo").value = user.email || "";
  }

  const params = new URLSearchParams(window.location.search);
  const paquete = params.get("paquete");
  if (paquete) {
    document.getElementById("paquete").value = decodeURIComponent(paquete);
  }

  // Validar fecha mínima: no permitir años pasados
  const fechaInput = document.getElementById("fecha");
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  const fechaMinima = `${yyyy}-${mm}-${dd}`;
  fechaInput.min = fechaMinima;

  //  al enviar formulario
  const formulario = document.querySelector("form");
  formulario.addEventListener("submit", function (e) {
    const fechaSeleccionada = new Date(fechaInput.value);
    if (fechaSeleccionada < hoy.setHours(0, 0, 0, 0)) {
      e.preventDefault();
      alert("La fecha del evento no puede ser anterior a hoy.");
    }
    
  });