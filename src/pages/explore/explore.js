// aqui guardo todas las publicaciones en un array de objetos
// cada objeto es una publicacion con sus datos
// con esta lista creo las tarjetas desde el js y no las escribo una por una en el html
const publicaciones = [
    {
        id: 1,                         // numero para identificar cada post
        usuario: "@ana.rutas",
        meta: "Places Community · 1h ago",
        tema: "Places",                // tiene que ser igual al data-tema del filtro
        texto: "Map of lit bike paths in the north. We built it together — add yours.",
        imagen: "../../assets/images/ana-rutas.png",
        descripcionImagen: "Lit bike path at sunset",  // lo uso como alt de la imagen
        comentarios: 62,
        likes: 418
    },
    {
        id: 2,
        usuario: "@dani.mindful",
        meta: "Verified creator · 3h ago",
        tema: "Wellness",
        texto: "Three breaths to calm anxiety before an interview. They even work for me on the bus.",
        imagen: "../../assets/images/dani-mindful.png",
        descripcionImagen: "Hands holding a warm cup",
        comentarios: 95,
        likes: 733
    },
    {
        id: 3,
        usuario: "@renata.libros",
        meta: "Book club · 6h ago",
        tema: "Reading",
        texto: "We finished chapter five and still have questions. Did anyone else cry on page 200?",
        imagen: "../../assets/images/renata-libros.png",
        descripcionImagen: "Stack of books by a window",
        comentarios: 41,
        likes: 289
    },
    {
        id: 4,
        usuario: "@sara.estudia",
        meta: "Study Community · 9h ago",
        tema: "Study",
        texto: "Online study session on Tuesdays at 7pm. Camera optional, company guaranteed.",
        imagen: "../../assets/images/sara-estudia.png",
        descripcionImagen: "Desk with a notebook and coffee",
        comentarios: 28,
        likes: 512
    },
    {
        id: 5,
        usuario: "@juli.mamis",
        meta: "Weekly meetup · 1d ago",
        tema: "Motherhood",
        texto: "We took the little ones to the park on 12th. There's shade, clean restrooms, and other moms nearby.",
        imagen: "../../assets/images/juli-mamis.png",
        descripcionImagen: "Playground in the morning",
        comentarios: 77,
        likes: 604
    },
    {
        id: 6,
        usuario: "@nina.taller",
        meta: "Verified creator · 2d ago",
        tema: "Creativity",
        texto: "I opened spots for Saturday's ceramics workshop. Small space, only eight spots.",
        imagen: "../../assets/images/nina-taller.png",
        descripcionImagen: "Hands shaping ceramics",
        comentarios: 33,
        likes: 356
    }
];


// traigo los elementos del html que voy a usar
// getElementById busca uno por su id
// querySelectorAll me trae todos los que tengan esa clase
const gridPosts = document.getElementById("grid-posts");          // div vacio donde meto las tarjetas
const sinResultados = document.getElementById("sin-resultados");  // mensaje de "No posts found"
const formBuscar = document.getElementById("form-buscar");        // formulario del buscador
const inputBuscar = document.getElementById("input-buscar");      // donde se escribe la busqueda
const botonesFiltro = document.querySelectorAll(".filtro");       // los 7 botones de filtro
const btnCargarMas = document.getElementById("btn-cargar-mas");   // boton de "Load more posts"


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

    // comentarios: uso innerHTML porque lleva el icono y el numero
    // con las comillas ` ` puedo meter variables usando ${ }
    const comentarios = document.createElement("span");
    comentarios.className = "post-accion";
    comentarios.innerHTML = `<img src="../../assets/icons/comment.svg" alt="Comments"> ${post.comentarios}`;
    metricas.appendChild(comentarios);

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