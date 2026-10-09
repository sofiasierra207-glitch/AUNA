// traigo los elementos del html que voy a usar
// getElementById busca uno por su id
// querySelectorAll me trae todos los que tengan esa clase
const gridPosts = document.getElementById("grid-posts");          // div vacio donde meto las tarjetas
const sinResultados = document.getElementById("sin-resultados");  // mensaje de "No posts found"
const formBuscar = document.getElementById("form-buscar");        // formulario del buscador
const inputBuscar = document.getElementById("input-buscar");      // donde se escribe la busqueda
const botonesFiltro = document.querySelectorAll(".filtro");       // los 7 botones de filtro
const btnCargarMas = document.getElementById("btn-cargar-mas");   // boton de "Load more posts"
const tituloPublicaciones = document.getElementById("titulo-publicaciones"); // h2 de "Recent posts"
const resultadoBusqueda = document.getElementById("resultado-busqueda");     // caja con el resultado
const textoResultado = document.getElementById("texto-resultado");           // texto de cuantos encontre
const btnLimpiar = document.getElementById("btn-limpiar");                   // boton de "Clear search"
const seccionPublicaciones = document.querySelector(".publicaciones");       // seccion de los posts


// localStorage: aqui guardo los likes y los guardados
// asi no se borran cuando recargo la pagina
const likesKey = "aunaLikes";         // nombre con el que guardo los likes
const guardadosKey = "aunaGuardados"; // nombre con el que guardo los "Save"

// leo lo que ya tenia guardado
// JSON.parse convierte el texto otra vez en array
// || [] es para que si no hay nada guardado empiece con un array vacio
// uso let porque estos arrays van a cambiar
let likes = JSON.parse(localStorage.getItem(likesKey)) || [];
let guardados = JSON.parse(localStorage.getItem(guardadosKey)) || [];


// variables para saber como esta la pagina en este momento
let temaActual = "All";   // el filtro que esta seleccionado, empieza en All
let textoBuscado = "";    // lo que escribi en el buscador

const cantidadInicial = 6;              // cuantos posts muestro al inicio
let cantidadVisible = cantidadInicial;  // cuantos estoy mostrando ahora
let totalFiltradas = 0;                 // cuantos posts cumplen el filtro


// funcion para crear una tarjeta
// recibe un post y armo la tarjeta pieza por pieza con createElement
// igual que en el taller de la lista de tareas:
// creo el elemento, le pongo clase o texto y lo meto con appendChild
function crearTarjeta(post) {

    // creo la tarjeta y le pongo la clase para que tome el css
    const tarjeta = document.createElement("article");
    tarjeta.className = "post";

    // creo la imagen de portada con la ruta y el alt que estan en el objeto
    const portada = document.createElement("img");
    portada.className = "post-portada";
    portada.src = post.imagen;
    portada.alt = post.descripcionImagen;
    tarjeta.appendChild(portada);

    // creo la parte blanca de abajo de la tarjeta
    const cuerpo = document.createElement("div");
    cuerpo.className = "post-cuerpo";
    tarjeta.appendChild(cuerpo);

    // creo la fila del avatar con el nombre
    const autora = document.createElement("div");
    autora.className = "post-autora";

    // circulo con la inicial del usuario
    // charAt(1) toma la letra en la posicion 1 porque la 0 es el @
    // toUpperCase la pone en mayuscula, ej: "@ana.rutas" queda "A"
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = post.usuario.charAt(1).toUpperCase();

    // nombre de usuario y el texto pequeño de abajo
    const quien = document.createElement("div");

    const usuario = document.createElement("p");
    usuario.className = "post-usuario";
    usuario.textContent = post.usuario;

    const meta = document.createElement("p");
    meta.className = "post-meta";
    meta.textContent = post.meta;

    quien.appendChild(usuario);
    quien.appendChild(meta);

    autora.appendChild(avatar);
    autora.appendChild(quien);
    cuerpo.appendChild(autora);

    // creo la etiqueta del tema (Places, Wellness...)
    const tag = document.createElement("span");
    tag.className = "post-tag";
    tag.textContent = post.tema;
    cuerpo.appendChild(tag);

    // creo el texto de la publicacion
    const texto = document.createElement("p");
    texto.className = "post-texto";
    texto.textContent = post.texto;
    cuerpo.appendChild(texto);

    // creo la fila de abajo donde van comentarios, like y guardar
    const acciones = document.createElement("div");
    acciones.className = "post-acciones";

    const metricas = document.createElement("div");
    metricas.className = "post-metricas";

    // boton de comentarios: uso innerHTML porque lleva el icono y el numero
    // con las comillas ` ` puedo meter variables usando ${ }
    // es un button porque al darle click abre la caja para comentar
    const btnComentar = document.createElement("button");
    btnComentar.className = "post-accion btn-comentar";
    btnComentar.innerHTML = `<img src="../../assets/icons/comment.svg" alt="Comments"> ${post.comentarios}`;
    metricas.appendChild(btnComentar);

    // creo el boton del like, lo que tiene adentro lo pone pintarLike
    const btnLike = document.createElement("button");
    btnLike.className = "post-accion btn-like";
    metricas.appendChild(btnLike);

    // creo el boton de guardar, lo que tiene adentro lo pone pintarGuardar
    const btnGuardar = document.createElement("button");
    btnGuardar.className = "post-accion btn-guardar";

    acciones.appendChild(metricas);
    acciones.appendChild(btnGuardar);
    cuerpo.appendChild(acciones);


    // caja para escribir un comentario, empieza escondida en el css
    // uso un form para que se envie con el boton Send o con Enter
    const cajaComentario = document.createElement("form");
    cajaComentario.className = "caja-comentario";

    const inputComentario = document.createElement("input");
    inputComentario.type = "text";
    inputComentario.placeholder = "Write a comment...";

    const btnEnviar = document.createElement("button");
    btnEnviar.type = "submit";
    btnEnviar.className = "btn-enviar";
    btnEnviar.textContent = "Send";

    cajaComentario.appendChild(inputComentario);
    cajaComentario.appendChild(btnEnviar);
    cuerpo.appendChild(cajaComentario);

    // pinto los botones para que se vea si ya tenian like o estaban guardados
    pintarLike(btnLike, post);
    pintarGuardar(btnGuardar, post);

    // cuando le doy click al like
    btnLike.addEventListener("click", () => {
        // includes revisa si el id ya esta en el array de likes
        if (likes.includes(post.id)) {
            // si ya tenia like se lo quito
            // filter crea un array nuevo sin este id
            likes = likes.filter(id => id !== post.id);
        } else {
            // si no tenia like lo agrego
            likes.push(post.id);
        }
        // guardo el array en localStorage
        // JSON.stringify lo convierte en texto porque localStorage solo guarda texto
        localStorage.setItem(likesKey, JSON.stringify(likes));
        // vuelvo a pintar el boton para que cambie el corazon
        pintarLike(btnLike, post);
    });

    // cuando le doy click a guardar, funciona igual que el like
    // lo que guardo aqui lo puedo leer despues en la pagina de favorites
    btnGuardar.addEventListener("click", () => {
        if (guardados.includes(post.id)) {
            guardados = guardados.filter(id => id !== post.id);
        } else {
            guardados.push(post.id);
        }
        localStorage.setItem(guardadosKey, JSON.stringify(guardados));
        pintarGuardar(btnGuardar, post);
    });
    
    // cuando le doy click al icono de comentarios abro o cierro la caja
    // toggle pone la clase abierta si no la tiene y la quita si ya la tiene
    btnComentar.addEventListener("click", () => {
        cajaComentario.classList.toggle("abierta");
        inputComentario.focus(); // pongo el cursor en el input para escribir de una
    });

    // cuando envio el comentario (click en Send o Enter)
    cajaComentario.addEventListener("submit", (evento) => {
        // evito que la pagina se recargue
        evento.preventDefault();

        // si no escribi nada no lo envio
        if (inputComentario.value.trim() === "") {
            inputComentario.focus();
            return;
        }

        // le sumo 1 a los comentarios y cambio el numero en el boton
        post.comentarios = post.comentarios + 1;
        btnComentar.innerHTML = `<img src="../../assets/icons/comment.svg" alt="Comments"> ${post.comentarios}`;

        // limpio el input y cierro la caja
        inputComentario.value = "";
        cajaComentario.classList.remove("abierta");
    });

    // por ultimo meto la tarjeta completa en el grid del html
    gridPosts.appendChild(tarjeta);
}



// con esta funcion cambio el icono y el numero del like
function pintarLike(boton, post) {
    // reviso si este post ya tiene like
    const tieneLike = likes.includes(post.id);

    // si tiene like uso el corazon lleno, si no el vacio
    let iconoLike = "heart.svg";
    if (tieneLike) {
        iconoLike = "heart-filled.svg";
    }

    // si tiene like le sumo 1 al numero
    const total = tieneLike ? post.likes + 1 : post.likes;

    boton.innerHTML = `<img src="../../assets/icons/${iconoLike}" alt="Like"> ${total}`;

    // la clase activo lo pone rosado
    // toggle la agrega si tieneLike es true y la quita si es false
    boton.classList.toggle("activo", tieneLike);
}

// con esta funcion cambio el icono y el texto de guardar
function pintarGuardar(boton, post) {
    // reviso si este post ya esta guardado
    const estaGuardado = guardados.includes(post.id);

    // si esta guardado dice "Saved", si no dice "Save"
    const textoBoton = estaGuardado ? "Saved" : "Save";

    // si esta guardado uso el icono lleno, si no el vacio
    let iconoGuardar = "save.svg";
    if (estaGuardado) {
        iconoGuardar = "save-filled.svg";
    }

    boton.innerHTML = `<img src="../../assets/icons/${iconoGuardar}" alt=""> ${textoBoton} `;
    boton.classList.toggle("activo", estaGuardado);
}


// con esta funcion muestro las publicaciones
// la llamo al abrir la pagina y cada vez que cambio el filtro,
// busco algo o le doy a "Load more"
function mostrarPublicaciones() {

    // primero borro las tarjetas que habia para que no se repitan
    gridPosts.innerHTML = "";

    // filter recorre el array y deja solo los posts que cumplen
    const filtradas = publicaciones.filter(post => {

        // pasa si el filtro es All o si el tema del post es igual al filtro
        const coincideTema = temaActual === "All" || post.tema === temaActual;

        // junto el usuario, el tema y el texto en minusculas
        // y reviso si tiene lo que busque
        const contenido = (post.usuario + " " + post.tema + " " + post.texto).toLowerCase();
        const coincideTexto = contenido.includes(textoBuscado);

        // && significa que se tienen que cumplir las dos cosas
        return coincideTema && coincideTexto;
    });

    // slice toma solo los primeros posts segun cantidadVisible
    const visibles = filtradas.slice(0, cantidadVisible);

    // forEach recorre cada post y le creo su tarjeta
    visibles.forEach(post => crearTarjeta(post));

    // si no quedo ningun post muestro el mensaje, si no lo escondo
    if (filtradas.length === 0) {
        sinResultados.style.display = "block";
    } else {
        sinResultados.style.display = "none";
    }

    // guardo cuantos posts cumplen el filtro, lo uso en "Load more"
    totalFiltradas = filtradas.length;

    // si busque algo cambio el titulo y muestro cuantos posts encontre
    if (textoBuscado !== "") {
        // si es 1 digo "result" y si son varios "results"
        let palabra = "results";
        if (filtradas.length === 1) {
            palabra = "result";
        }

        tituloPublicaciones.textContent = "Search results";
        textoResultado.textContent = `${filtradas.length} ${palabra} for "${textoBuscado}"`;
        resultadoBusqueda.classList.add("visible");
    } else {
        // si no hay busqueda dejo todo como al inicio
        tituloPublicaciones.textContent = "Recent posts";
        resultadoBusqueda.classList.remove("visible");
    }

    // dejo el boton de "Load more" como al inicio
    btnCargarMas.disabled = false;
    btnCargarMas.textContent = "Load more posts";
}


// filtros: a cada boton le agrego el evento click
botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {

        // le quito la clase activa a todos los filtros
        botonesFiltro.forEach(b => b.classList.remove("filtro-activo"));
        // y se la pongo solo al que le di click
        boton.classList.add("filtro-activo");

        // dataset.tema lee el data-tema que puse en el html
        temaActual = boton.dataset.tema;
        cantidadVisible = cantidadInicial;
        mostrarPublicaciones(); // vuelvo a mostrar con el nuevo filtro
    });
});

// buscador: submit pasa cuando le doy click a Search o presiono Enter
formBuscar.addEventListener("submit", (evento) => {
    // el form por defecto recarga la pagina, con preventDefault lo evito
    evento.preventDefault();

    // trim quita los espacios del inicio y del final
    // toLowerCase lo pasa a minusculas para que "Park" y "park" sean iguales
    textoBuscado = inputBuscar.value.trim().toLowerCase();
    cantidadVisible = cantidadInicial;
    mostrarPublicaciones();

    // bajo la pagina hasta los resultados para que se vea que si busco
    // scrollIntoView mueve la pantalla hasta ese elemento, smooth es para que baje suave
    seccionPublicaciones.scrollIntoView({ behavior: "smooth" });
});

// boton "Clear search": borro la busqueda y vuelven a salir todos los posts
btnLimpiar.addEventListener("click", () => {
    inputBuscar.value = "";
    textoBuscado = "";
    cantidadVisible = cantidadInicial;
    mostrarPublicaciones();
    inputBuscar.focus(); // dejo el cursor en el buscador por si quiero buscar otra cosa
});

// input pasa cada vez que escribo o borro una letra
// si dejo el buscador vacio vuelven a salir todas las publicaciones
inputBuscar.addEventListener("input", () => {
    if (inputBuscar.value.trim() === "") {
        textoBuscado = "";
        mostrarPublicaciones();
    }
});

// boton de cargar mas
btnCargarMas.addEventListener("click", () => {
    if (cantidadVisible < totalFiltradas) {
        // si todavia hay posts escondidos muestro 3 mas
        cantidadVisible = cantidadVisible + 3;
        mostrarPublicaciones();
    } else {
        // si ya se ven todos desactivo el boton y cambio el texto
        btnCargarMas.disabled = true;
        btnCargarMas.textContent = "You're all caught up";
    }
});

// la lupa del header abre el popup de buscar
// abrirBuscar() esta en components/search/search.js
const btnLupa = document.getElementById("btn-lupa");
btnLupa.addEventListener("click", () => {
    abrirBuscar();
});

// si vengo del popup de buscar, leo la palabra que guarde en localStorage
const busquedaGuardada = localStorage.getItem("aunaBusqueda");
if (busquedaGuardada) {
    // la pongo en el buscador y la uso para filtrar
    inputBuscar.value = busquedaGuardada;
    textoBuscado = busquedaGuardada.toLowerCase();

    // la borro para que la proxima vez que entre a explore salgan todos los posts
    localStorage.removeItem("aunaBusqueda");
}
// cuando abro la pagina llamo la funcion para que salgan las tarjetas
mostrarPublicaciones();