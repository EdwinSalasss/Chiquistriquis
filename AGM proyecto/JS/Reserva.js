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

const fechaInput = document.getElementById("fecha");
const hoy = new Date();
const fechaMinima = new Date();

// Establecer fecha mínima a 3 días desde hoy
fechaMinima.setDate(hoy.getDate() + 3);

// Formato YYYY-MM-DD para establecer en el input
const yyyy = fechaMinima.getFullYear();
const mm = String(fechaMinima.getMonth() + 1).padStart(2, '0');
const dd = String(fechaMinima.getDate()).padStart(2, '0');
fechaInput.min = `${yyyy}-${mm}-${dd}`;

// Mostrar u ocultar los datos de la tarjeta según método seleccionado
const metodoPago = document.getElementById("metodoPago");
const datosTarjeta = document.getElementById("datosTarjeta");
const datosPaypal = document.getElementById("datosPaypal");

metodoPago.addEventListener("change", () => {
  const datosTarjeta = document.getElementById("datosTarjeta");
  const datosPaypal = document.getElementById("datosPaypal");

  const tipoTarjetas = document.querySelectorAll('input[name="tipoTarjeta"]');
  const numeroTarjeta = document.getElementById("numeroTarjeta");
  const vencimiento = document.getElementById("vencimiento");
  const cvv = document.getElementById("cvv");

  const paypalCorreo = document.getElementById("paypalCorreo");
  const paypalPassword = document.getElementById("paypalPassword");

  if (metodoPago.value === "tarjeta") {
    datosTarjeta.style.display = "block";
    datosPaypal.style.display = "none";

    // Activar requeridos para tarjeta
    tipoTarjetas.forEach(r => r.required = true);
    numeroTarjeta.required = true;
    vencimiento.required = true;
    cvv.required = true;

    // Quitar requeridos de PayPal
    paypalCorreo.required = false;
    paypalPassword.required = false;
  } else if (metodoPago.value === "paypal") {
    datosTarjeta.style.display = "none";
    datosPaypal.style.display = "block";

    // Activar requeridos para PayPal
    paypalCorreo.required = true;
    paypalPassword.required = true;

    // Quitar requeridos de tarjeta
    tipoTarjetas.forEach(r => r.required = false);
    numeroTarjeta.required = false;
    vencimiento.required = false;
    cvv.required = false;
  } else {
    // Quitar todos los requeridos si no hay método seleccionado
    tipoTarjetas.forEach(r => r.required = false);
    numeroTarjeta.required = false;
    vencimiento.required = false;
    cvv.required = false;

    paypalCorreo.required = false;
    paypalPassword.required = false;

    datosTarjeta.style.display = "none";
    datosPaypal.style.display = "none";
  }
});

// Validar que solo se escriban números en el teléfono
const telefonoInput = document.getElementById("telefono");
telefonoInput.addEventListener("input", () => {
  telefonoInput.value = telefonoInput.value.replace(/\D/g, "");
});

// Validar al enviar el formulario
const formulario = document.querySelector("form");

formulario.addEventListener("submit", function (e) {
  e.preventDefault(); // Detiene el envío por defecto

const fechaSeleccionada = new Date(fechaInput.value);
const añoSeleccionado = fechaSeleccionada.getFullYear();

  if (añoSeleccionado < hoy.getFullYear()) {
  alert("No se permite seleccionar años anteriores al actual.");
  return;
  }

// Validar invitados
  const invitadosInput = document.getElementById("invitados");
  const cantidad = parseInt(invitadosInput.value, 10);
  if (isNaN(cantidad) || cantidad < 1 || cantidad > 100) {
  alert("La cantidad de invitados debe ser entre 1 y 100.");
    return;
  }

  // Validar hora
  const horaInput = document.getElementById("hora");
  const horaSeleccionada = horaInput.value;
  if (!horaSeleccionada) {
  alert("Por favor selecciona una hora para el evento.");
    return;
  }

  const [horas, minutos] = horaSeleccionada.split(":").map(Number);
  const totalMinutos = horas * 60 + minutos;
  if (totalMinutos < 480 || totalMinutos > 1320) {
    alert("La hora del evento debe estar entre las 08:00AM y las 10:00PM.");
    return;
  }

  // Validar método de pago
  const metodo = metodoPago.value;
  if (!metodo) {
    alert("Por favor selecciona un método de pago.");
    return;
  }

   //si selecciona el metodo paypal
   if (metodo === "paypal") {
     const paypalCorreo = document.getElementById("paypalCorreo").value.trim();
     const paypalPassword = document.getElementById("paypalPassword").value.trim();

     const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalCorreo);
      if (!correoValido) 
        {
      alert("Por favor ingrese un correo de PayPal válido.");
       return;
      }

      if (paypalPassword.length < 6) {
      alert("La contraseña de PayPal debe tener al menos 6 caracteres.");
     return;
     }
   }

 let tipoTarjeta = "";
  if (metodo === "tarjeta") {
    tipoTarjeta = document.querySelector('input[name="tipoTarjeta"]:checked')?.value;
    const numeroTarjeta = document.getElementById("numeroTarjeta").value.trim();
    const vencimiento = document.getElementById("vencimiento").value;
    const cvv = document.getElementById("cvv").value.trim();

    if (!tipoTarjeta) {
      alert("Por favor seleccione el tipo de tarjeta.");
      return;
    }

    if (!/^\d{16}$/.test(numeroTarjeta)) {
      alert("Por favor ingrese un número de tarjeta válido de 16 dígitos.");
      return;
    }

  if (!vencimiento) {
      alert("Ingrese la fecha de vencimiento de la tarjeta.");
      return;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      alert("El CVV debe ser de 3 o 4 dígitos.");
      return;
    }
  }

  // Construir objeto de reserva
  const reserva = {
    paquete: document.getElementById("paquete").value,
    nombre: document.getElementById("nombre").value,
    correo: document.getElementById("correo").value,
    telefono: document.getElementById("telefono").value,
    fecha: document.getElementById("fecha").value,
    hora: document.getElementById("hora").value,
    cantidadInvitados: document.getElementById("invitados").value,
    mensaje: document.getElementById("mensaje").value,
    metodoPago: metodo,
    tipoTarjeta: metodo === "tarjeta" ? tipoTarjeta : "",
    paypalCorreo: metodo === "paypal" ? document.getElementById("paypalCorreo").value.trim() : "",
    timestamp: new Date().toISOString(),
  };

  // Guardar en historial
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) return;

  if (metodo === "paypal") 
    {
  localStorage.setItem("reservaTemporal", JSON.stringify(reserva));
  window.location.href = "procesandoPaypal.html";
    } 
  else {
  const historialKey = `reservas_${user.email}`;
  const historial = JSON.parse(localStorage.getItem(historialKey)) || [];
  historial.push(reserva);
  localStorage.setItem(historialKey, JSON.stringify(historial));

  alert("¡Reserva enviada con éxito!");
  window.location.href = "PaquetesEvento.html";
}
});