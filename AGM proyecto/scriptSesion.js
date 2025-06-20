document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loginCancelBtn = document.getElementById("login-cancel");
  const registerCancelBtn = document.getElementById("register-cancel");
  const logoutBtn = document.getElementById("logout-btn");
  const title = document.getElementById("title");
  const closeBtn = document.getElementById("close-btn");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    showLoggedInView(loggedInUser);
  }

  // Configurar pestañas
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));
      this.classList.add("active");
      document.getElementById(`${tabId}-tab`).classList.add("active");
      title.textContent = tabId === "login" ? "Iniciar Sesión" : "Crear Cuenta";
    });
  });

  // Manejar inicio de sesión
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Validar campos
    if (!email) {
      showError("login-email-error", "Por favor ingresa tu correo electrónico");
      return;
    }

    if (!password) {
      showError("login-password-error", "Por favor ingresa tu contraseña");
      return;
    }

    // Buscar usuario
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      showLoggedInView(user);
      setTimeout(() => {
        const returnUrl = localStorage.getItem("returnUrl") || "index.html";
        window.location.href = returnUrl;
      }, 100);
    } else {
      showError(
        "login-password-error",
        "Correo electrónico o contraseña incorrectos"
      );
    }
  });

  // Manejar registro
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Obtener valores de los campos
    const firstName = document.getElementById("first-name").value.trim();
    const secondName = document.getElementById("second-name").value.trim();
    const firstLastname = document
      .getElementById("first-lastname")
      .value.trim();
    const secondLastname = document
      .getElementById("second-lastname")
      .value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById(
      "register-confirm-password"
    ).value;

    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]{1,10}$/;
    let isValid = true;

    // Función para validar campos de nombre
    function validateNameField(value, fieldId, fieldName) {
      if (!value) {
        showError(fieldId + "-error", `El campo ${fieldName} es obligatorio`);
        return false;
      }
      if (!nameRegex.test(value)) {
        showError(
          fieldId + "-error",
          `${fieldName} no debe contener números ni símbolos, y máximo 10 letras`
        );
        return false;
      }
      return true;
    }

    // Validar campos de nombre
    if (!validateNameField(firstName, "first-name", "Primer Nombre"))
      isValid = false;
    if (!validateNameField(secondName, "second-name", "Segundo Nombre"))
      isValid = false;
    if (!validateNameField(firstLastname, "first-lastname", "Primer Apellido"))
      isValid = false;
    if (
      !validateNameField(secondLastname, "second-lastname", "Segundo Apellido")
    )
      isValid = false;

    // Validar email
    if (!email) {
      showError(
        "register-email-error",
        "Por favor ingresa tu correo electrónico"
      );
      isValid = false;
    } else if (!validateEmail(email)) {
      showError("register-email-error", "Correo electrónico inválido");
      isValid = false;
    } else if (users.some((u) => u.email === email)) {
      showError("register-email-error", "Este correo ya está registrado");
      isValid = false;
    }

    // Validar contraseña
    if (!password || password.length < 8) {
      showError(
        "register-password-error",
        "La contraseña debe tener al menos 8 caracteres"
      );
      isValid = false;
    }

    // Validar confirmación de contraseña
    if (!confirmPassword) {
      showError(
        "register-confirm-password-error",
        "Por favor confirma tu contraseña"
      );
      isValid = false;
    } else if (password !== confirmPassword) {
      showError(
        "register-confirm-password-error",
        "Las contraseñas no coinciden"
      );
      isValid = false;
    }

    if (!isValid) return;

    // Crear nuevo usuario
    const fullName = `${firstName} ${secondName} ${firstLastname} ${secondLastname}`;
    const newUser = { name: fullName, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(newUser));

    alert("¡Registro exitoso! Serás redirigido a la página principal.");
    setTimeout(() => {
      const returnUrl = localStorage.getItem("returnUrl") || "index.html";
      window.location.href = returnUrl;
    }, 1000);
  });

  // Botones de cancelar
  loginCancelBtn.addEventListener("click", function () {
  const returnUrl = localStorage.getItem("returnUrl");
  
  // Si la URL guardada nos regresa a reserva.html (protegida) sin sesión, redirige a inicio
  if (returnUrl && returnUrl.includes("reserva.html")) 
    {
    localStorage.removeItem("returnUrl");
    window.location.href = "index.html";
  } else {
    window.location.href = returnUrl || document.referrer || "index.html";
  }
});


  registerCancelBtn.addEventListener("click", function () {
   const returnUrl = localStorage.getItem("returnUrl");
  
  // Si la URL guardada nos regresa a reserva.html (protegida) sin sesión, redirige a inicio
  if (returnUrl && returnUrl.includes("reserva.html")) {
    localStorage.removeItem("returnUrl");
    window.location.href = "index.html";
  } else {
    window.location.href = returnUrl || document.referrer || "index.html";
  }
});

  // Botón de cerrar sesión
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    tabs.forEach((t) => t.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));
    document.querySelector('.tab[data-tab="login"]').classList.add("active");
    document.getElementById("login-tab").classList.add("active");
    title.textContent = "Iniciar Sesión";
    loginForm.reset();
    registerForm.reset();
    const returnUrl = localStorage.getItem("returnUrl") || "index.html";
    window.location.href = returnUrl;
  });

  // Botón de cerrar (×)
  closeBtn.addEventListener("click", function () {
     returnUrl = localStorage.getItem("returnUrl");
  
  // Si la URL guardada nos regresa a reserva.html (protegida) sin sesión, redirige a inicio
  if (returnUrl && returnUrl.includes("reserva.html")) 
    {
    localStorage.removeItem("returnUrl");
    window.location.href = "index.html";
  } else {
    window.location.href = returnUrl || document.referrer || "index.html";
  }
  });

  // Mostrar vista de usuario logueado
  function showLoggedInView(user) {
    tabs.forEach((t) => t.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));

    const loggedInTab = document.getElementById("logged-in-tab");
    if (loggedInTab) {
      loggedInTab.classList.add("active");
    } else {
      console.warn('Elemento con id "logged-in-tab" encontrado.');
    }

    title.textContent = `Bienvenido, ${user.name}`;
    const userNameEl = document.getElementById("logged-in-user");
    const userEmailEl = document.getElementById("logged-in-email");

    if (userNameEl) userNameEl.textContent = user.name;
    if (userEmailEl) userEmailEl.textContent = user.email;
  }

  // Mostrar mensajes de error
  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = "block";
    setTimeout(() => {
      errorElement.style.display = "none";
    }, 3000);
  }

  // Validar formato de email
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Guardar URL de referencia si no está ya guardada
  if (!localStorage.getItem("returnUrl") && document.referrer) {
    localStorage.setItem("returnUrl", document.referrer);
  }



 // Mostrar mensaje si viene de intento de reserva
const loginMsg = localStorage.getItem("loginMessage");
if (loginMsg) {
  const mensajeDiv = document.createElement("div");
  mensajeDiv.textContent = loginMsg;
  mensajeDiv.style.background = "#fff3cd";
  mensajeDiv.style.color = "#856404";
  mensajeDiv.style.padding = "10px 15px";
  mensajeDiv.style.border = "1px solidrgb(151, 125, 47)";
  mensajeDiv.style.borderRadius = "5px";
  mensajeDiv.style.marginBottom = "15px";
  mensajeDiv.style.textAlign = "center";
  mensajeDiv.style.fontWeight = "bold";

  // Insertar antes del formulario
  const contenedor = document.querySelector(".tab-content") || document.body;
  contenedor.insertBefore(mensajeDiv, contenedor.firstChild);

  // Limpiar para que no aparezca otra vez
  localStorage.removeItem("loginMessage");
}
});