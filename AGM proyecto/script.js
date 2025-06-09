function reservar(nombre, precio) {
  // Usar Swanpy para alertar selección de evento
  Toastify({
  text: `Has seleccionado el ${nombre}`,
  duration: 2500,
  gravity: "top", 
  position: "right",
  backgroundColor: "#007bff",
  style: {
    color: "white"
  }
}).showToast();

  const lista = document.getElementById('listaReservas');
  const fecha = new Date().toLocaleDateString();

  if (lista.children[0].textContent.includes("No hay reservas")) {
    lista.innerHTML = '';
  }

  const li = document.createElement('li');
  li.innerHTML = `
    📅 <strong>${fecha}</strong> — <span class="info">${nombre}</span> — 💵 $${precio}
    <button class="eliminar-btn" onclick="eliminarReserva(this)">Eliminar</button>
  `;
  lista.appendChild(li);
}

function eliminarReserva(boton) {
  const item = boton.parentElement;

  // Confirmación con SweetAlert2
  Swal.fire({
    title: '¿Eliminar reserva?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      item.remove();

      // Mostrar toast con Swanpy
      Toastify({
      text: "Reserva eliminada correctamente.",
      duration: 2500,
      gravity: "bottom",
      position: "right",
      backgroundColor: "#dc3545",
      style: {
      color: "white"
    }
    }).showToast();

      const lista = document.getElementById('listaReservas');
      if (lista.children.length === 0) {
        lista.innerHTML = '<li><em>No hay reservas aún.</em></li>';
      }
    }
  });
}

function openModal(event) {
  event.preventDefault(); 
  document.getElementById("loginModal").style.display = "block";
}


function closeModal() {
  document.getElementById('loginModal').style.display = 'none';
}

function redirectToCreate() {
  window.location.href = 'Gmail.html';
}

function nextStep(step) 
{
   
  document.querySelectorAll('.step').forEach(s => s.style.display = 'none');

   
  const next = document.getElementById('step' + step);
  next.style.display = 'block';

   
  if (step === 3) {
      setTimeout(() => {
        window.location.href = "index.html"; 
      }, 1000); 
  }
}