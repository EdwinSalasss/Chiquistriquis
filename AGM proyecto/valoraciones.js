// Verifica sesión
const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user) {
  localStorage.setItem("returnUrl", window.location.href);
  alert("Debe iniciar sesión para agregar una valoración.");
  window.location.href = "Sesion.html";
}

const form = document.getElementById("formValoracion");
const listaValoraciones = document.getElementById("listaValoraciones");
const estrellas = document.querySelectorAll("#estrellas span");
let valorSeleccionado = 0;

// Marcar estrellas seleccionadas
estrellas.forEach(estrella => {
  estrella.addEventListener("click", () => {
    valorSeleccionado = parseInt(estrella.getAttribute("data-star"));
    actualizarEstrellas();
  });
});

function actualizarEstrellas() {
  estrellas.forEach(estrella => {
    const valor = parseInt(estrella.getAttribute("data-star"));
    estrella.classList.toggle("seleccionada", valor <= valorSeleccionado);
  });
}

// Cargar valoraciones anteriores
const valoraciones = JSON.parse(localStorage.getItem("valoraciones")) || [];

function mostrarValoraciones() {
  listaValoraciones.innerHTML = "";

  if (valoraciones.length === 0) {
    listaValoraciones.innerHTML = "<p>No hay valoraciones aún.</p>";
    return;
  }

  valoraciones.forEach(v => {
    const div = document.createElement("div");
    div.classList.add("valoracion");

    div.innerHTML = `
      <strong>${v.usuario}</strong>
      <div class="estrellas-leidas">${'★'.repeat(v.estrellas)}${'☆'.repeat(5 - v.estrellas)}</div>
      <p>${v.comentario}</p>
    `;
    listaValoraciones.appendChild(div);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const comentario = document.getElementById("comentario").value.trim();

  if (!comentario || valorSeleccionado === 0) {
    alert("Debe completar el comentario y seleccionar estrellas.");
    return;
  }

  const nueva = {
    usuario: user.name || "Anónimo",
    comentario,
    estrellas: valorSeleccionado,
    fecha: new Date().toISOString()
  };

  valoraciones.push(nueva);
  localStorage.setItem("valoraciones", JSON.stringify(valoraciones));
  form.reset();
  valorSeleccionado = 0;
  actualizarEstrellas();
  mostrarValoraciones();
});

// Si no hay valoraciones, precargar algunas simuladas
if (valoraciones.length === 0) {
  const ejemplo = [
    {
      usuario: "Dayron Leonardo Lopez Guevara",
      comentario: "¡La decoración fue hermosa y el personal muy atento!",
      estrellas: 5,
      fecha: "2025-05-20T10:15:00"
    },
    {
      usuario: "Maxin Jesus Mendez Gonzales",
      comentario: "Todo salió bien, aunque el sonido podría mejorar.",
      estrellas: 4,
      fecha: "2025-05-18T14:30:00"
    },
    {
      usuario: "Angel Ramiro Barreto Peralta",
      comentario: "Excelente atención y puntualidad. Muy recomendado.",
      estrellas: 5,
      fecha: "2025-05-15T12:45:00"
    },
    {
      usuario: "Jafet Alexander Gonzales Martinez",
      comentario: "El lugar es bonito pero el aire acondicionado falló un poco.",
      estrellas: 3,
      fecha: "2025-05-10T09:00:00"
    }
  ];

  localStorage.setItem("valoraciones", JSON.stringify(ejemplo));
  valoraciones.push(...ejemplo);
}

mostrarValoraciones();