// mini perfil: menu que sale al darle click al boton de perfil del header
// y su opcion "View my profile" abre un modal con el perfil completo
// en la pagina solo agrego el css y el js de este componente
// el boton de perfil tiene que tener id="profile-button"

// datos de la usuaria, los guardo en un objeto
// asi si cambio algo aqui se cambia en el menu y en el modal
const usuaria = {
    nombre: "Valentina Torres",
    usuario: "@valen.torres",
    bio: "Learning to take care of myself without guilt. Sharing what helps me: reading, simple routines, and quiet moments.",
    seguidoras: 186,
    posts: 42,
    totalColecciones: 9,
    intereses: ["Mental wellness", "Reading", "Creativity", "Motherhood", "Safe spaces"],
    // en el modal solo muestro 3 colecciones, aunque tenga 9 en total
    colecciones: [
        { nombre: "Safe routes", cantidad: "8 places" },
        { nombre: "For slow reading", cantidad: "12 posts" },
        { nombre: "Voices that support you", cantidad: "9 stories" }
    ]
};

// la inicial para el circulo: charAt(0) es la primera letra del nombre
const inicial = usuaria.nombre.charAt(0);

// el boton de perfil que ya existe en el header
const perfilBoton = document.getElementById("profile-button");


// ---------- menu del mini perfil ----------

// creo la caja del menu
const miniPerfil = document.createElement("div");
miniPerfil.className = "mini-perfil";

// los links van con ../../pages/ porque todas las paginas estan en src/pages/nombre/
miniPerfil.innerHTML = `
    <div class="mini-perfil-arriba">
        <div class="perfil-avatar">${inicial}</div>
        <div>
            <p class="mini-perfil-nombre">${usuaria.nombre}</p>
            <p class="mini-perfil-usuario">${usuaria.usuario}</p>
        </div>
    </div>

    <button type="button" class="mini-perfil-opcion" id="opcion-ver-perfil">View my profile</button>
    <a href="../../pages/favorites/favorites.html" class="mini-perfil-opcion">My collections</a>
    <button type="button" class="mini-perfil-opcion" id="opcion-ajustes">Settings</button>
    <a href="../../pages/login/login.html" class="mini-perfil-opcion mini-perfil-salir">Log out</a>
`;

// pongo el menu en la misma caja donde esta el boton de perfil
// parentElement es el elemento que tiene adentro al boton
perfilBoton.parentElement.appendChild(miniPerfil);


// abrir y cerrar el menu
// la clase active pinta el boton de rosado mientras el menu esta abierto
function abrirMiniPerfil() {
    miniPerfil.classList.add("abierto");
    perfilBoton.classList.add("active");
}

function cerrarMiniPerfil() {
    miniPerfil.classList.remove("abierto");
    perfilBoton.classList.remove("active");
}

// click en el boton: si el menu esta abierto lo cierro, si no lo abro
// contains revisa si el elemento tiene esa clase
perfilBoton.addEventListener("click", () => {
    if (miniPerfil.classList.contains("abierto")) {
        cerrarMiniPerfil();
    } else {
        abrirMiniPerfil();
    }
});

// si doy click en cualquier otra parte de la pagina se cierra el menu
// contains aqui revisa si el click fue adentro del menu o del boton
document.addEventListener("click", (evento) => {
    const clickEnMenu = miniPerfil.contains(evento.target);
    const clickEnBoton = perfilBoton.contains(evento.target);

    if (!clickEnMenu && !clickEnBoton) {
        cerrarMiniPerfil();
    }
});

// Settings: cierro el menu y abro la configuracion
// openSettings() esta en el componente configuration de Sofía,
// por eso la pagina tiene que cargar configuration.js antes que este archivo
document.getElementById("opcion-ajustes").addEventListener("click", () => {
    cerrarMiniPerfil();
    openSettings();
});


// ---------- modal de ver mi perfil ----------

// armo las pildoras de intereses recorriendo el array
// += va sumando cada pildora al texto
let htmlIntereses = "";
usuaria.intereses.forEach(interes => {
    htmlIntereses += `<span class="perfil-interes">${interes}</span>`;
});

// lo mismo con las colecciones
let htmlColecciones = "";
usuaria.colecciones.forEach(coleccion => {
    htmlColecciones += `
        <div class="perfil-coleccion">
            <strong>${coleccion.nombre}</strong>
            <span>${coleccion.cantidad}</span>
        </div>
    `;
});

// creo el fondo oscuro y la caja del modal
const perfilFondo = document.createElement("div");
perfilFondo.className = "perfil-fondo";

perfilFondo.innerHTML = `
    <div class="perfil-modal">

        <div class="perfil-arriba">
            <div class="perfil-avatar">${inicial}</div>
            <div class="perfil-quien">
                <div class="perfil-nombre-fila">
                    <h3>${usuaria.nombre}</h3>
                    <span class="perfil-verificada">✓ Verified</span>
                </div>
                <p class="perfil-usuario">${usuaria.usuario}</p>
            </div>
            <button type="button" class="perfil-cerrar" aria-label="Close">×</button>
        </div>

        <p class="perfil-bio">${usuaria.bio}</p>

        <div class="perfil-numeros">
            <div class="perfil-numero"><strong>${usuaria.seguidoras}</strong><span>Followers</span></div>
            <div class="perfil-numero"><strong>${usuaria.posts}</strong><span>Posts</span></div>
            <div class="perfil-numero"><strong>${usuaria.totalColecciones}</strong><span>Collections</span></div>
        </div>

        <div>
            <p class="perfil-subtitulo">Interests</p>
            <div class="perfil-intereses">${htmlIntereses}</div>
        </div>

        <div>
            <p class="perfil-subtitulo">Collections</p>
            <div class="perfil-colecciones">${htmlColecciones}</div>
        </div>

        <button type="button" class="perfil-editar">Edit profile</button>
    </div>
`;

document.body.appendChild(perfilFondo);


// abrir y cerrar el modal
function abrirPerfil() {
    cerrarMiniPerfil(); // cierro el menu para que no quede abierto detras
    perfilFondo.classList.add("abierto");
}

function cerrarPerfil() {
    perfilFondo.classList.remove("abierto");
}

// "View my profile" abre el modal
document.getElementById("opcion-ver-perfil").addEventListener("click", abrirPerfil);

// la x cierra el modal
perfilFondo.querySelector(".perfil-cerrar").addEventListener("click", cerrarPerfil);

// "Edit profile" cierra mi perfil y abre la configuracion de Sofía para editar los datos
perfilFondo.querySelector(".perfil-editar").addEventListener("click", () => {
    cerrarPerfil();
    openSettings();
});

// click en el fondo oscuro (afuera de la caja) tambien lo cierra
perfilFondo.addEventListener("click", (evento) => {
    if (evento.target === perfilFondo) {
        cerrarPerfil();
    }
});

// con Escape se cierra el modal y el menu
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        cerrarPerfil();
        cerrarMiniPerfil();
    }
});