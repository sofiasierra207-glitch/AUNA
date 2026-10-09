/* Ventana para crear un perfil nuevo */

// Crea el fondo oscuro que cubre la página
const createOverlay = document.createElement("div");
createOverlay.className = "create-overlay";

// Formulario y mensaje de bienvenida (este último oculto al inicio)
createOverlay.innerHTML = `
    <div class="create-modal" role="dialog" aria-modal="true" aria-labelledby="create-title">

        <div class="create-header">
            <h3 id="create-title">Create your profile</h3>
            <button type="button" class="create-close" aria-label="Close">×</button>
        </div>

        <form class="create-form">
            <p class="create-text">Join the AÚNA community in a minute. Your data is protected, and you decide what to share.</p>

            <label for="create-name">Full name</label>
            <input type="text" id="create-name" class="create-input" placeholder="E.g. Valentina Torres">

            <label for="create-email">Email address</label>
            <input type="text" id="create-email" class="create-input" placeholder="you@email.com">

            <label for="create-password">Password</label>
            <input type="password" id="create-password" class="create-input" placeholder="Create a secure password">

            <label for="create-city">City</label>
            <input type="text" id="create-city" class="create-input" placeholder="Where are you joining from?">

            <label class="create-check">
                <input type="checkbox" id="create-terms">
                I accept AÚNA's Terms and Community Guidelines.
            </label>

            <p class="create-error"></p>

            <button type="submit" class="create-button">Create my profile</button>

            <p class="create-login">Already have an account? <button type="button" class="create-login-button">Log in</button></p>
        </form>

        <div class="create-welcome">
            <p class="create-text"></p>
            <a href="../../pages/index/index.html" class="create-button">Go to home</a>
        </div>
    </div>
`;

// Agrega la ventana al final de la página (oculta al inicio)
document.body.appendChild(createOverlay);

// Elementos que se usan varias veces
const createModal = createOverlay.querySelector(".create-modal");
const createForm = createOverlay.querySelector(".create-form");
const createName = createOverlay.querySelector("#create-name");
const createEmail = createOverlay.querySelector("#create-email");
const createPassword = createOverlay.querySelector("#create-password");
const createCity = createOverlay.querySelector("#create-city");
const createTerms = createOverlay.querySelector("#create-terms");
const createError = createOverlay.querySelector(".create-error");
const welcomeText = createOverlay.querySelector(".create-welcome .create-text");

// Los cuatro campos en un arreglo para recorrerlos con for...of
const createFields = [createName, createEmail, createPassword, createCity];

// Muestra la ventana
function openCreateProfile() {
    createOverlay.classList.add("open");
    createName.focus();
}

// Oculta la ventana y deja el formulario vacío
function closeCreateProfile() {
    createOverlay.classList.remove("open");
    createModal.classList.remove("done");
    createForm.reset();
    clearCreateErrors();
}

// Quita el mensaje de error y el borde rojo de los campos
function clearCreateErrors() {
    createError.textContent = "";
    for (const field of createFields) {
        field.classList.remove("error");
    }
}

// Muestra el error y marca el campo que falla
function showCreateError(field, message) {
    createError.textContent = message;
    field.classList.add("error");
    field.focus();
}

// La X y "Log in" cierran la ventana
createOverlay.querySelector(".create-close").addEventListener("click", function () {
    closeCreateProfile();
});

createOverlay.querySelector(".create-login-button").addEventListener("click", function () {
    closeCreateProfile();
});

// Clic en el fondo oscuro también cierra
createOverlay.addEventListener("click", function (event) {
    if (event.target === createOverlay) {
        closeCreateProfile();
    }
});

// Al escribir en un campo se le quita el borde rojo
for (const field of createFields) {
    field.addEventListener("input", function () {
        field.classList.remove("error");
    });
}

// Enviar: revisa los campos uno por uno antes de crear el perfil
createForm.addEventListener("submit", function (event) {
    // Evita que la página se recargue
    event.preventDefault();
    clearCreateErrors();

    const name = createName.value.trim();
    const email = createEmail.value.trim();
    const password = createPassword.value;
    const city = createCity.value.trim();

    if (name === "") {
        showCreateError(createName, "Write your full name.");
    } else if (!email.includes("@") || !email.includes(".")) {
        showCreateError(createEmail, "Write a valid email address.");
    } else if (password.length < 8) {
        showCreateError(createPassword, "Your password needs at least 8 characters.");
    } else if (city === "") {
        showCreateError(createCity, "Tell us your city.");
    } else if (!createTerms.checked) {
        createError.textContent = "Accept the Terms and Community Guidelines to continue.";
    } else {
        // Todo está bien: guarda el perfil en localStorage
        const newUser = { name: name, email: email, city: city };
        localStorage.setItem("aunaUser", JSON.stringify(newUser));

        // Cambia el formulario por el mensaje de bienvenida
        welcomeText.textContent = "Welcome to AÚNA, " + name + "! Your profile is ready.";
        createModal.classList.add("done");
    }
});