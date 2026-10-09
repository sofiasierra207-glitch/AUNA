/*
   AÚNA - PÁGINA DE INICIO DE SESIÓN
*/

// Elementos del formulario
const loginForm = document.querySelector(".login-form");
const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");
const loginMessage = document.querySelector(".login-message");

// Muestra un mensaje de error y marca el campo que falla
function showLoginError(field, message) {
    loginMessage.textContent = message;
    loginMessage.classList.remove("info");
    field.classList.add("error");
    field.focus();
}

// Al escribir se quita el borde rojo y el mensaje
for (const field of [loginEmail, loginPassword]) {
    field.addEventListener("input", function () {
        field.classList.remove("error");
        loginMessage.textContent = "";
    });
}


/*
   Iniciar sesión
*/

loginForm.addEventListener("submit", function (event) {
    // Evita que la página se recargue
    event.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email.includes("@") || !email.includes(".")) {
        showLoginError(loginEmail, "Write a valid email address.");
    } else if (password === "") {
        showLoginError(loginPassword, "Write your password.");
    } else {
        // Guarda el correo de la sesión y entra al inicio
        localStorage.setItem("aunaSession", email);
        window.location.href = "../index/index.html";
    }
});


/*
   Botones de abajo
*/

// "Forgot your password?": aquí se conecta el componente de Cami cuando esté listo
document.querySelector(".login-forgot").addEventListener("click", function () {
    loginMessage.textContent = "Password recovery is coming soon.";
    loginMessage.classList.add("info");
});

// "Create account": abre el componente para crear perfil
document.querySelector(".login-create-button").addEventListener("click", function () {
    openCreateProfile();
});