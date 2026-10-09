// mini perfil: menu que sale al darle click al boton de perfil del header
// y su opcion "View my profile" abre un modal con el perfil completo
// en la pagina solo agrego el css y el js de este componente
// el boton de perfil tiene que tener id="profile-button"

// datos de la usuaria que salen en el menu
const usuaria = {
    nombre: "Valentina Torres",
    usuario: "@valen.torres"
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

// "View my profile": cierro el menu y abro el componente profile de Anny
document.getElementById("opcion-ver-perfil").addEventListener("click", () => {
    cerrarMiniPerfil();
    openProfile();
});

// Settings: cierro el menu y abro el componente configuration de Anny
document.getElementById("opcion-ajustes").addEventListener("click", () => {
    cerrarMiniPerfil();
    openSettings();
});

// con Escape tambien se cierra el menu
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        cerrarMiniPerfil();
    }
});
