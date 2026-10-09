// modal de pedir ayuda a la comunidad
// lo creo desde el js para poder usarlo en cualquier pagina
// en la pagina solo agrego el css y el js de este componente

// creo el fondo oscuro que tapa la pagina
const ayudaFondo = document.createElement("div");
ayudaFondo.className = "ayuda-fondo";

// con innerHTML escribo todo lo de adentro del modal de una vez
// el for del label tiene que ser igual al id del campo,
// asi al darle click al texto se selecciona el campo
ayudaFondo.innerHTML = `
    <div class="ayuda-modal">

        <div class="ayuda-header">
            <h3>Ask the community for help</h3>
            <button type="button" class="ayuda-cerrar" aria-label="Close">×</button>
        </div>

        <p class="ayuda-texto">
            Tell us what you need. Your message only reaches verified users nearby,
            and you can post it anonymously.
        </p>

        <form class="ayuda-form">
            <div class="ayuda-campo">
                <label for="ayuda-necesito">What do you need today?</label>
                <textarea id="ayuda-necesito" class="ayuda-textarea"
                    placeholder="E.g. Looking for company to a doctor's appointment Thursday afternoon."></textarea>
                <p class="ayuda-mensaje-error">Tell us what you need before sending.</p>
            </div>

            <div class="ayuda-fila">
                <div class="ayuda-campo">
                    <label for="ayuda-categoria">Category</label>
                    <select id="ayuda-categoria" class="ayuda-select">
                        <option>Health</option>
                        <option>Safe space</option>
                        <option>Support</option>
                        <option>Legal</option>
                        <option>Everyday</option>
                    </select>
                </div>

                <label class="ayuda-check">
                    <input type="checkbox" class="ayuda-anonimo" checked>
                    Send anonymously
                </label>
            </div>

            <button type="submit" class="ayuda-enviar">Send request</button>
        </form>

        <div class="ayuda-enviado">
            <p class="ayuda-texto">Your request was sent. Verified users nearby will see it soon.</p>
            <button type="button" class="ayuda-enviar ayuda-listo">Done</button>
        </div>
    </div>
`;

// meto el modal al final de la pagina, empieza escondido por el css
document.body.appendChild(ayudaFondo);


// traigo lo que necesito de adentro del modal
const ayudaModal = ayudaFondo.querySelector(".ayuda-modal");
const ayudaForm = ayudaFondo.querySelector(".ayuda-form");
const ayudaTextarea = ayudaFondo.querySelector(".ayuda-textarea");
const ayudaError = ayudaFondo.querySelector(".ayuda-mensaje-error");
const ayudaCategoria = ayudaFondo.querySelector(".ayuda-select");
const ayudaAnonimo = ayudaFondo.querySelector(".ayuda-anonimo");
const ayudaCerrar = ayudaFondo.querySelector(".ayuda-cerrar");
const ayudaListo = ayudaFondo.querySelector(".ayuda-listo");


// localStorage: aqui guardo los pedidos de ayuda
// si no hay nada guardado empiezo con un array vacio
const pedidosKey = "aunaPedidosAyuda";
const pedidosAyuda = JSON.parse(localStorage.getItem(pedidosKey)) || [];


// funcion para abrir el modal
function abrirAyuda() {
    ayudaFondo.classList.add("abierto");
    ayudaTextarea.focus(); // pongo el cursor en la caja para escribir de una
}

// funcion para cerrar el modal
// tambien lo dejo limpio para la proxima vez que lo abra
function cerrarAyuda() {
    ayudaFondo.classList.remove("abierto");
    ayudaModal.classList.remove("enviado");
    ayudaForm.reset(); // reset vuelve todos los campos del form como al inicio
    quitarError();
}

// funciones para mostrar y quitar el error de la caja vacia
function mostrarError() {
    ayudaTextarea.classList.add("ayuda-error");
    ayudaError.classList.add("visible");
    ayudaTextarea.focus();
}

function quitarError() {
    ayudaTextarea.classList.remove("ayuda-error");
    ayudaError.classList.remove("visible");
}


// la x cierra el modal
ayudaCerrar.addEventListener("click", cerrarAyuda);

// el boton Done (despues de enviar) tambien lo cierra
ayudaListo.addEventListener("click", cerrarAyuda);

// si le doy click al fondo oscuro (afuera de la caja) se cierra
// evento.target es el elemento exacto donde di click
ayudaFondo.addEventListener("click", (evento) => {
    if (evento.target === ayudaFondo) {
        cerrarAyuda();
    }
});

// con la tecla Escape tambien se cierra
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        cerrarAyuda();
    }
});

// cuando empiezo a escribir quito el error
ayudaTextarea.addEventListener("input", quitarError);


// cuando envio el pedido (click en Send request)
ayudaForm.addEventListener("submit", (evento) => {
    // evito que la pagina se recargue
    evento.preventDefault();

    const texto = ayudaTextarea.value.trim();

    // si no escribi nada muestro el error y no envio
    if (texto === "") {
        mostrarError();
        return;
    }

    // armo un objeto con los datos del pedido
    // .checked es true si el checkbox esta marcado
    const pedido = {
        texto: texto,
        categoria: ayudaCategoria.value,
        anonimo: ayudaAnonimo.checked
    };

    // lo agrego al array y lo guardo en localStorage
    pedidosAyuda.push(pedido);
    localStorage.setItem(pedidosKey, JSON.stringify(pedidosAyuda));

    // escondo el form y muestro el mensaje de enviado
    ayudaModal.classList.add("enviado");
});