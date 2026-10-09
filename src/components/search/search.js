// popup de buscar
// lo creo desde el js para poder usarlo en cualquier pagina
// en la pagina solo agrego el css y el js de este componente

// creo el fondo oscuro que tapa la pagina
const buscarFondo = document.createElement("div");
buscarFondo.className = "buscar-fondo";

// con innerHTML escribo todo lo de adentro del popup de una vez
// el form es para que la busqueda se envie con Enter
buscarFondo.innerHTML = `
    <div class="buscar-popup">
        <h3>Search AÚNA</h3>

        <form class="buscar-form">
            <input type="text" class="buscar-input" placeholder="Search people, topics, or posts">
        </form>

        <p class="buscar-subtitulo">Suggestions</p>

        <div class="buscar-tags">
            <button type="button" class="buscar-tag">Community</button>
            <button type="button" class="buscar-tag">Help</button>
            <button type="button" class="buscar-tag">Wellness</button>
        </div>

        <a href="../../pages/index/index.html" class="buscar-volver">Back to home</a>
    </div>
`;

// meto el popup al final de la pagina, empieza escondido por el css
document.body.appendChild(buscarFondo);


// traigo lo que necesito de adentro del popup
const buscarForm = buscarFondo.querySelector(".buscar-form");
const buscarInput = buscarFondo.querySelector(".buscar-input");
const buscarTags = buscarFondo.querySelectorAll(".buscar-tag");


// funcion para abrir el popup
function abrirBuscar() {
    buscarFondo.classList.add("abierto");
    buscarInput.focus(); // pongo el cursor en el buscador para escribir de una
}

// funcion para cerrar el popup
function cerrarBuscar() {
    buscarFondo.classList.remove("abierto");
    buscarInput.value = ""; // limpio lo que habia escrito
}


// si le doy click al fondo oscuro (afuera de la caja blanca) se cierra
// evento.target es el elemento exacto donde di click
buscarFondo.addEventListener("click", (evento) => {
    if (evento.target === buscarFondo) {
        cerrarBuscar();
    }
});

// si presiono la tecla Escape tambien se cierra
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        cerrarBuscar();
    }
});

// sugerencias: al darle click pongo esa palabra en el buscador
buscarTags.forEach(tag => {
    tag.addEventListener("click", () => {
        buscarInput.value = tag.textContent;
        // envio la busqueda de una vez, como si presionara Enter
        buscarForm.requestSubmit();
    });
});

// cuando busco algo (Enter)
buscarForm.addEventListener("submit", (evento) => {
    // evito que la pagina se recargue
    evento.preventDefault();

    const texto = buscarInput.value.trim();

    // si no escribi nada no hago nada
    if (texto === "") {
        return;
    }

    // paso el texto a minusculas para comparar sin importar mayusculas
    const palabra = texto.toLowerCase();

    // si escribo el nombre de una pagina, voy directo a esa pagina
    if (palabra === "home") {
        window.location.href = "../../pages/index/index.html";
    } else if (palabra === "explore") {
        window.location.href = "../../pages/explore/explore.html";
    } else if (palabra === "community") {
        window.location.href = "../../pages/community/community.html";
    } else if (palabra === "favorites") {
        window.location.href = "../../pages/favorites/favorites.html";
    } else if (palabra === "help" || palabra === "auna help") {
        window.location.href = "../../pages/help/help.html";
    } else {
        // si no es una pagina, guardo lo que busque y me voy a explore
        // en explore leo esta palabra y filtro los posts
        localStorage.setItem("aunaBusqueda", texto);
        window.location.href = "../../pages/explore/explore.html";
    }
});