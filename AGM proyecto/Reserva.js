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

metodoPago.addEventListener("change", () => {
  if (metodoPago.value === "tarjeta") {
    datosTarjeta.style.display = "block";
  } else {
    datosTarjeta.style.display = "none";
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
  e.preventDefault();// para evitar que se envie 
  const fechaSeleccionada = new Date(fechaInput.value);

  // Validar que el año no sea anterior al actual
  const añoSeleccionado = fechaSeleccionada.getFullYear();
  if (añoSeleccionado < hoy.getFullYear()) {
    e.preventDefault();
    alert("No se permite seleccionar años anteriores al actual.");
    return;
  }


  // Validar invitados
  const invitadosInput = document.getElementById("invitados");
  const cantidad = parseInt(invitadosInput.value, 10);
  if (isNaN(cantidad) || cantidad < 1 || cantidad > 100) {
    e.preventDefault();
    alert("La cantidad de invitados debe ser entre 1 y 100.");
    return;
  }

  // Validar hora entre 08:00 y 22:00
  const horaInput = document.getElementById("hora");
  const horaSeleccionada = horaInput.value;
  if (!horaSeleccionada) {
    e.preventDefault();
    alert("Por favor selecciona una hora para el evento.");
    return;
  }

  const [horas, minutos] = horaSeleccionada.split(":").map(Number);
  const totalMinutos = horas * 60 + minutos;

  const inicioPermitido = 8 * 60;   // 08:00 en minutos
  const finPermitido = 22 * 60;    // 10:00 en minutos

  if (totalMinutos < inicioPermitido || totalMinutos > finPermitido) {
    e.preventDefault();
    alert("La hora del evento debe estar entre las 08:00AM y las 10:00PM.");
    return;
  }

  // Validar método de pago
  const metodop = metodoPago.value;
  if (!metodop) {
    e.preventDefault();
    alert("Por favor selecciona un método de pago.");
    return;
  }

  if (metodop === "tarjeta") {
    const numeroTarjeta = document.getElementById("numeroTarjeta").value.trim();
    const vencimiento = document.getElementById("vencimiento").value;
    const cvv = document.getElementById("cvv").value.trim();

    const tarjetaValida = /^\d{16}$/.test(numeroTarjeta);
    const cvvValido = /^\d{3,4}$/.test(cvv);

    if (!tarjetaValida) {
      e.preventDefault();
      alert("Por favor ingrese un número de tarjeta válido de 16 dígitos.");
      return;
    }

    if (!vencimiento) {
      e.preventDefault();
      alert("Ingrese la fecha de vencimiento de la tarjeta.");
      return;
    }

    if (!cvvValido) {
      e.preventDefault();
      alert("El CVV debe ser de 3 o 4 dígitos.");
      return;
    }
  }

  //validar seleccion de tipo de tarjeta de credito
  const metodo = document.querySelector('input[name="metodoPago"]:checked')?.value;
if (metodo === "tarjeta") {
  const tipoTarjeta = document.getElementById("tipoTarjeta").value;
  if (!tipoTarjeta) {
    e.preventDefault();
    alert("Por favor seleccione el tipo de tarjeta.");
    return;
  }
}

  // Obtener datos del formulario
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
  tipoTarjeta: metodo === "tarjeta" ? document.getElementById("tipoTarjeta").value : "",
  timestamp: new Date().toISOString()
};

// Obtener usuario actual
const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user) return; // Seguridad extra

// Cargar historial del usuario
const historialKey = `reservas_${user.email}`;
const historial = JSON.parse(localStorage.getItem(historialKey)) || [];

// Agregar nueva reserva
historial.push(reserva);
localStorage.setItem(historialKey, JSON.stringify(historial));

alert("¡Reserva enviada con éxito!");
window.location.href = "PaquetesEvento.html";

});