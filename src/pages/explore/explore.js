// PUBLICACIONES
const publicaciones = [
    {
        id: 1,                         // número para identificar cada post
        usuario: "@ana.rutas",
        meta: "Places Community · 1h ago",
        tema: "Places",                // debe ser igual al data-tema del filtro
        texto: "Map of lit bike paths in the north. We built it together — add yours.",
        imagen: "../../assets/images/ana-rutas.png",
        descripcionImagen: "Lit bike path at sunset",  // se usa como alt de la imagen
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


// aqui se traen los elementos del HTML que se van a usar en el JS
const gridPosts = document.getElementById("grid-posts");          // div vacío donde van las tarjetas
const sinResultados = document.getElementById("sin-resultados");  // mensaje "No posts found"
const formBuscar = document.getElementById("form-buscar");        // formulario del buscador
const inputBuscar = document.getElementById("input-buscar");      // donde se escribe
const botonesFiltro = document.querySelectorAll(".filtro");       // los 7 botones de filtro
const btnCargarMas = document.getElementById("btn-cargar-mas");   // botón "Load more posts"


// LOCALSTORAGE (guardar likes y guardados)
const likesKey = "aunaLikes";         // nombre con el que se guardan los likes
const guardadosKey = "aunaGuardados"; // nombre con el que se guardan los "Save"

// leer lo que ya estaba guardado.
// || [] significa: "si no hay nada guardado, empieza con un array vacío"
// let (y no const) porque estos arrays van a cambiar
let likes = JSON.parse(localStorage.getItem(likesKey)) || [];
let guardados = JSON.parse(localStorage.getItem(guardadosKey)) || [];


// 4. VARIABLES DE ESTADO
//Guardan "cómo está" la página en este momento.
let temaActual = "All";   // filtro seleccionado (empieza en All)
let textoBuscado = "";    // lo que se escribió en el buscador

const cantidadInicial = 6;              // cuántos posts se ven al inicio
let cantidadVisible = cantidadInicial;  // cuántos se están mostrando ahora
let totalFiltradas = 0;                 // cuántos posts cumplen el filtro

// funcion para crear una tarjeta.
// Recibe UN objeto post y arma su tarjeta con createElement,
// igual que en el taller de la lista de tareas.
// Pasos: crear elemento → darle clase/texto → meterlo con appendChild
function crearTarjeta(post) {

    // --- contenedor de la tarjeta ---
    const tarjeta = document.createElement("article");
    tarjeta.className = "post"; // le pongo la clase para que tome el CSS

    // --- imagen de portada ---
    const portada = document.createElement("img");
    portada.className = "post-portada";
    portada.src = post.imagen;            // ruta de la imagen sacada del objeto
    portada.alt = post.descripcionImagen; // texto alternativo
    tarjeta.appendChild(portada);         // meto la imagen dentro de la tarjeta

    // --- cuerpo (parte blanca de abajo) ---
    const cuerpo = document.createElement("div");
    cuerpo.className = "post-cuerpo";
    tarjeta.appendChild(cuerpo);

    // --- autora: avatar + usuario + meta ---
    const autora = document.createElement("div");
    autora.className = "post-autora";

    // círculo con la inicial
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    // charAt(1) toma la letra en la posición 1 (la 0 es el @)
    // toUpperCase() la pone en mayúscula. Ej: "@ana.rutas" → "A"
    avatar.textContent = post.usuario.charAt(1).toUpperCase();

    // nombre de usuario y texto pequeño debajo
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

    // --- tag del tema ---
    const tag = document.createElement("span");
    tag.className = "post-tag";
    tag.textContent = post.tema;
    cuerpo.appendChild(tag);

    // --- texto de la publicación ---
    const texto = document.createElement("p");
    texto.className = "post-texto";
    texto.textContent = post.texto;
    cuerpo.appendChild(texto);

    // --- fila de acciones ---
    const acciones = document.createElement("div");
    acciones.className = "post-acciones";

    const metricas = document.createElement("div");
    metricas.className = "post-metricas";

    // comentarios: uso innerHTML porque lleva una imagen + el número.
    // Las comillas ` ` (backticks) permiten meter variables con ${ }
    const comentarios = document.createElement("span");
    comentarios.className = "post-accion";
    comentarios.innerHTML = `<img src="../../assets/icons/comment.svg" alt="Comments"> ${post.comentarios}`;
    metricas.appendChild(comentarios);

    // botón de like (su contenido lo pone la función pintarLike)
    const btnLike = document.createElement("button");
    btnLike.className = "post-accion btn-like";
    metricas.appendChild(btnLike);

    // botón de guardar (su contenido lo pone la función pintarGuardar)
    const btnGuardar = document.createElement("button");
    btnGuardar.className = "post-accion btn-guardar";

    acciones.appendChild(metricas);
    acciones.appendChild(btnGuardar);
    cuerpo.appendChild(acciones);

    // mostrar si el post ya tenía like o estaba guardado
    pintarLike(btnLike, post);
    pintarGuardar(btnGuardar, post);

    // click en like
    btnLike.addEventListener("click", () => {
        // includes() revisa si el id ya está en el array
        if (likes.includes(post.id)) {
            // ya tenía like → lo quito.
            // filter() crea un array nuevo SIN este id
            likes = likes.filter(id => id !== post.id);
        } else {
            // no tenía like → lo agrego al array
            likes.push(post.id);
        }
        // guardo el array actualizado en localStorage
        localStorage.setItem(likesKey, JSON.stringify(likes));
        // vuelvo a pintar el botón con el nuevo estado
        pintarLike(btnLike, post);
    });

    // click en guardar
    // funciona igual que el like
    // Lo guardado se podrá leer después desde la página de Favorites.
    btnGuardar.addEventListener("click", () => {
        if (guardados.includes(post.id)) {
            guardados = guardados.filter(id => id !== post.id);
        } else {
            guardados.push(post.id);
        }
        localStorage.setItem(guardadosKey, JSON.stringify(guardados));
        pintarGuardar(btnGuardar, post);
    });

    // se mete la tarjeta completa dentro del grid del HTML
    gridPosts.appendChild(tarjeta);
}



//FUNCIONES QUE "PINTAN" LOS BOTONES SEGÚN SU ESTADO
function pintarLike(boton, post) {
    // true si el id del post está en el array de likes
    const tieneLike = likes.includes(post.id);

    // operador ternario:  condición ? valorSiEsTrue : valorSiEsFalse
    const corazon = tieneLike ? "♥" : "♡";                     // lleno o vacío
    const total = tieneLike ? post.likes + 1 : post.likes;     // suma 1 si tiene like

    boton.innerHTML = `<span class="corazon">${corazon}</span> ${total}`;

    // classList.toggle("activo", true/false):
    // si es true agrega la clase "activo" (rosado), si es false la quita
    boton.classList.toggle("activo", tieneLike);
}

function pintarGuardar(boton, post) {
    const estaGuardado = guardados.includes(post.id);

    const textoBoton = estaGuardado ? "Saved" : "Save";
    let iconoGuardar = "save.svg";
    if (estaGuardado) {
        iconoGuardar = "save-filled.svg";
    }
    boton.innerHTML = `<img src="../../assets/icons/${iconoGuardar}" alt=""> ${textoBoton} `;
    boton.classList.toggle("activo", estaGuardado);
}

        // 7. FUNCIÓN QUE MUESTRA LAS PUBLICACIONES
        // Se llama al cargar la página y cada vez que cambia
        // el filtro, la búsqueda o se da click en "Load more".
        function mostrarPublicaciones() {

            // 1) borro todas las tarjetas que había para no repetirlas
            gridPosts.innerHTML = "";

    // 2) filter() recorre el array y se queda solo con los posts
    //    que devuelven true
    const filtradas = publicaciones.filter(post => {

        // pasa si el filtro es "All" O si el tema del post es igual al filtro
        const coincideTema = temaActual === "All" || post.tema === temaActual;

        // junto usuario + tema + texto en minúsculas y reviso
        // si contiene lo que se buscó
        const contenido = (post.usuario + " " + post.tema + " " + post.texto).toLowerCase();
        const coincideTexto = contenido.includes(textoBuscado);

        // && = tienen que cumplirse las DOS condiciones
        return coincideTema && coincideTexto;
    });

        // 3) slice(0, cantidadVisible) toma solo los primeros N posts
        const visibles = filtradas.slice(0, cantidadVisible);

    // 4) forEach recorre cada post y crea su tarjeta
    visibles.forEach(post => crearTarjeta(post));

        // 5) si no quedó ningún post, muestro el mensaje; si no, lo escondo
        if (filtradas.length === 0) {
            sinResultados.style.display = "block";
    } else {
            sinResultados.style.display = "none";
    }

        // 6) guardo cuántos posts cumplen el filtro (lo usa "Load more")
        totalFiltradas = filtradas.length;

        // 7) dejo el botón "Load more" como al inicio
        btnCargarMas.disabled = false;
        btnCargarMas.textContent = "Load more posts";
}


// FILTROS 
// a cada botón de filtro le agrego un evento click
botonesFiltro.forEach(boton => {
            boton.addEventListener("click", () => {

                // quito la clase activa a TODOS los filtros...
                botonesFiltro.forEach(b => b.classList.remove("filtro-activo"));
                // ...y se la pongo solo al que se le dio click
                boton.classList.add("filtro-activo");

                // dataset.tema lee el atributo data-tema del HTML
                temaActual = boton.dataset.tema;
                cantidadVisible = cantidadInicial;
                mostrarPublicaciones(); // vuelvo a pintar con el nuevo filtro
            });
});

// BUSCADOR
// "submit" pasa al dar click en Search o al presionar Enter
formBuscar.addEventListener("submit", (evento) => {
            // por defecto un form recarga la página; preventDefault lo evita
            evento.preventDefault();

        // trim() quita espacios al inicio y al final
        // toLowerCase() pasa a minúsculas para que "Park" y "park" sean iguales
        textoBuscado = inputBuscar.value.trim().toLowerCase();
        cantidadVisible = cantidadInicial;
        mostrarPublicaciones();
});

// "input" pasa cada vez que se escribe o se borra una letra.
// Si el buscador queda vacío, vuelven a aparecer todas las publicaciones.
inputBuscar.addEventListener("input", () => {
    if (inputBuscar.value.trim() === "") {
            textoBuscado = "";
        mostrarPublicaciones();
    }
});

// cargar mas posts
btnCargarMas.addEventListener("click", () => {
    if (cantidadVisible < totalFiltradas) {
            // todavía hay posts escondidos → muestro 3 más
            cantidadVisible = cantidadVisible + 3;
        mostrarPublicaciones();
    } else {
            // ya se ven todos → desactivo el botón y cambio el texto
            btnCargarMas.disabled = true;
        btnCargarMas.textContent = "You're all caught up";
    }
});


        //INICIO
        // Al abrir la página se llama la función para pintar las tarjetas
        mostrarPublicaciones();