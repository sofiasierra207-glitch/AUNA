// modal de olvidaste tu contraseña
// un modal es una ventana que se abre encima de la pagina:
// un fondo oscuro que tapa todo y una caja con el contenido
// se abre desde el link "Forgot your password?" del login
// en la pagina solo agrego el css y el js de este componente

// parte 1 del modal: el fondo oscuro
const olvidoFondo = document.createElement("div");
olvidoFondo.className = "olvido-fondo";

// con innerHTML escribo todo lo de adentro del modal de una vez
// el for del label es igual al id del input, asi al darle click al texto se selecciona el input
olvidoFondo.innerHTML = `
    <div class="olvido-modal">

        <div class="olvido-arriba">
            <span class="olvido-icono">🔒</span>
            <button type="button" class="olvido-cerrar" aria-label="Close">×</button>
        </div>

        <h3>Forgot your password?</h3>

        <form class="olvido-form">
            <p class="olvido-texto">
                Enter the email you signed up with and we'll send you a link to create a new password.
            </p>

            <label for="olvido-correo">Email address</label>
            <input type="text" id="olvido-correo" class="olvido-input" placeholder="you@email.com">
            <p class="olvido-mensaje-error">Please write a valid email address.</p>

            <button type="submit" class="olvido-enviar">Send recovery link</button>
        </form>

        <div class="olvido-enviado">
            <p class="olvido-texto">
                We sent a recovery link to <span class="olvido-correo"></span>.
                Check your inbox and follow the steps to create a new password.
            </p>
            <button type="button" class="olvido-enviar olvido-listo">Back to login</button>
        </div>
    </div>
`;

// meto el modal al final de la pagina, empieza escondido por el css
document.body.appendChild(olvidoFondo);


// traigo lo que necesito de adentro del modal
const olvidoModal = olvidoFondo.querySelector(".olvido-modal");
const olvidoForm = olvidoFondo.querySelector(".olvido-form");
const olvidoInput = olvidoFondo.querySelector(".olvido-input");
const olvidoError = olvidoFondo.querySelector(".olvido-mensaje-error");
const olvidoCorreo = olvidoFondo.querySelector(".olvido-correo");


// funcion para abrir el modal
// el modal siempre existe en la pagina pero esta escondido,
// al ponerle la clase abierto el css lo muestra
function abrirOlvide() {
    olvidoFondo.classList.add("abierto");
    olvidoInput.focus(); // pongo el cursor en el correo para escribir de una
}

// funcion para cerrar el modal
// tambien lo dejo limpio para la proxima vez que lo abra
function cerrarOlvide() {
    olvidoFondo.classList.remove("abierto");
    olvidoModal.classList.remove("enviado");
    olvidoForm.reset(); // reset borra lo que escribi
    quitarErrorOlvide();
}

function quitarErrorOlvide() {
    olvidoInput.classList.remove("olvido-error");
    olvidoError.classList.remove("visible");
}


// la x y el boton "Back to login" cierran el modal
olvidoFondo.querySelector(".olvido-cerrar").addEventListener("click", cerrarOlvide);
olvidoFondo.querySelector(".olvido-listo").addEventListener("click", cerrarOlvide);

// si le doy click al fondo oscuro (afuera de la caja) se cierra
olvidoFondo.addEventListener("click", (evento) => {
    if (evento.target === olvidoFondo) {
        cerrarOlvide();
    }
});

// con la tecla Escape tambien se cierra
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        cerrarOlvide();
    }
});

// cuando empiezo a escribir quito el error
olvidoInput.addEventListener("input", quitarErrorOlvide);


// cuando envio el formulario (click en Send recovery link o Enter)
olvidoForm.addEventListener("submit", (evento) => {
    // evito que la pagina se recargue
    evento.preventDefault();

    const correo = olvidoInput.value.trim();

    // reviso que el correo tenga @ y un punto
    if (!correo.includes("@") || !correo.includes(".")) {
        olvidoInput.classList.add("olvido-error");
        olvidoError.classList.add("visible");
        olvidoInput.focus();
        return;
    }

    // pongo el correo en el mensaje y muestro que se envio
    olvidoCorreo.textContent = correo;
    olvidoModal.classList.add("enviado");
});