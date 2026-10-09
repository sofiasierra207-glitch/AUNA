// modal para postularme a verificacion
// lo creo desde el js para poder usarlo en cualquier pagina
// en la pagina solo agrego el css y el js de este componente

// creo el fondo oscuro que tapa la pagina
const verifFondo = document.createElement("div");
verifFondo.className = "verif-fondo";

// con innerHTML escribo todo lo de adentro del modal de una vez
// el for del label tiene que ser igual al id del input,
// asi al darle click al texto se selecciona el campo
verifFondo.innerHTML = `
    <div class="verif-modal">

        <div class="verif-header">
            <h3>Apply to get verified</h3>
            <button type="button" class="verif-cerrar" aria-label="Close">×</button>
        </div>

        <p class="verif-texto">
            Tell us about your experience in health, law, or education. Our team reviews
            every application before activating your verified profile.
        </p>

        <form class="verif-form">
            <div class="verif-campo">
                <label for="verif-nombre">Full name</label>
                <input type="text" id="verif-nombre" class="verif-input" placeholder="E.g. Valentina Torres">
            </div>

            <div class="verif-campo">
                <label for="verif-area">Professional field</label>
                <input type="text" id="verif-area" class="verif-input"
                    placeholder="E.g. Psychology, Labor law, Early childhood education...">
            </div>

            <div class="verif-campo">
                <label for="verif-correo">Email address</label>
                <input type="text" id="verif-correo" class="verif-input" placeholder="you@email.com">
            </div>

            <div class="verif-campo">
                <label for="verif-experiencia">Tell us about your experience</label>
                <textarea id="verif-experiencia" class="verif-input"
                    placeholder="Years of experience, certifications, who you'd like to support..."></textarea>
            </div>

            <p class="verif-mensaje-error"></p>

            <button type="submit" class="verif-enviar">Submit application</button>
        </form>

        <div class="verif-enviado">
            <p class="verif-texto">
                Thanks for applying! We'll review your application and write to your email soon.
            </p>
            <button type="button" class="verif-enviar verif-listo">Done</button>
        </div>
    </div>
`;

// meto el modal al final de la pagina, empieza escondido por el css
document.body.appendChild(verifFondo);


// traigo lo que necesito de adentro del modal
const verifModal = verifFondo.querySelector(".verif-modal");
const verifForm = verifFondo.querySelector(".verif-form");
const verifNombre = verifFondo.querySelector("#verif-nombre");
const verifArea = verifFondo.querySelector("#verif-area");
const verifCorreo = verifFondo.querySelector("#verif-correo");
const verifExperiencia = verifFondo.querySelector("#verif-experiencia");
const verifError = verifFondo.querySelector(".verif-mensaje-error");
const verifCerrar = verifFondo.querySelector(".verif-cerrar");
const verifListo = verifFondo.querySelector(".verif-listo");

// los 4 campos en un array para poder recorrerlos con forEach
const verifCampos = [verifNombre, verifArea, verifCorreo, verifExperiencia];

// clave de localStorage donde guardo la postulacion
const verificacionKey = "aunaVerificacion";


// funcion para abrir el modal
function abrirVerificacion() {
    verifFondo.classList.add("abierto");
    verifNombre.focus(); // pongo el cursor en el primer campo
}

// funcion para cerrar el modal
// tambien lo dejo limpio para la proxima vez que lo abra
function cerrarVerificacion() {
    verifFondo.classList.remove("abierto");
    verifModal.classList.remove("enviado");
    verifForm.reset(); // reset borra lo que escribi en todos los campos
    quitarErrores();
}

// muestro el mensaje de error con el texto que le paso
function mostrarErrorVerif(texto) {
    verifError.textContent = texto;
    verifError.classList.add("visible");
}

// quito el error del mensaje y de todos los campos
function quitarErrores() {
    verifError.classList.remove("visible");
    verifCampos.forEach(campo => campo.classList.remove("verif-error"));
}


// la x y el boton Done cierran el modal
verifCerrar.addEventListener("click", cerrarVerificacion);
verifListo.addEventListener("click", cerrarVerificacion);

// si le doy click al fondo oscuro (afuera de la caja) se cierra
verifFondo.addEventListener("click", (evento) => {
    if (evento.target === verifFondo) {
        cerrarVerificacion();
    }
});

// con la tecla Escape tambien se cierra
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        cerrarVerificacion();
    }
});

// cuando escribo en un campo le quito el error a ese campo
verifCampos.forEach(campo => {
    campo.addEventListener("input", () => {
        campo.classList.remove("verif-error");
    });
});


// cuando envio la postulacion (click en Submit application)
verifForm.addEventListener("submit", (evento) => {
    // evito que la pagina se recargue
    evento.preventDefault();

    // primero quito los errores de antes
    quitarErrores();

    // reviso cuales campos estan vacios y les pongo el error
    const vacios = verifCampos.filter(campo => campo.value.trim() === "");
    vacios.forEach(campo => campo.classList.add("verif-error"));

    // si hay alguno vacio no envio
    if (vacios.length > 0) {
        mostrarErrorVerif("Please fill in all the fields.");
        vacios[0].focus(); // pongo el cursor en el primero que falta
        return;
    }

    // reviso que el correo tenga @ y un punto
    const correo = verifCorreo.value.trim();
    if (!correo.includes("@") || !correo.includes(".")) {
        verifCorreo.classList.add("verif-error");
        mostrarErrorVerif("Please write a valid email address.");
        verifCorreo.focus();
        return;
    }

    // armo un objeto con la postulacion y lo guardo en localStorage
    const postulacion = {
        nombre: verifNombre.value.trim(),
        area: verifArea.value.trim(),
        correo: correo,
        experiencia: verifExperiencia.value.trim()
    };
    localStorage.setItem(verificacionKey, JSON.stringify(postulacion));

    // escondo el form y muestro el mensaje de gracias
    verifModal.classList.add("enviado");
});