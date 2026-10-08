// aqui guardo las publicaciones de explore
// las necesito para saber cuales guardo el usuario con el boton "Save"
const postsExplore = [
    { id: 1, usuario: "@ana.rutas", texto: "Map of lit bike paths in the north. We built it together — add yours.", imagen: "../../assets/images/ana-rutas.png" },
    { id: 2, usuario: "@dani.mindful", texto: "Three breaths to calm anxiety before an interview.", imagen: "../../assets/images/dani-mindful.png" },
    { id: 3, usuario: "@renata.libros", texto: "We finished chapter five and still have questions. Did anyone else cry on page 200?", imagen: "../../assets/images/renata-libros.png" },
    { id: 4, usuario: "@sara.estudia", texto: "Online study session on Tuesdays at 7pm. Camera optional, company guaranteed.", imagen: "../../assets/images/sara-estudia.png" },
    { id: 5, usuario: "@juli.mamis", texto: "We took the little ones to the park on 12th. There's shade, clean restrooms, and other moms nearby.", imagen: "../../assets/images/juli-mamis.png" },
    { id: 6, usuario: "@nina.taller", texto: "I opened spots for Saturday's ceramics workshop. Small space, only eight spots.", imagen: "../../assets/images/nina-taller.png" }
];

// estos son los guardados que salen en el figma
// me sirve para filtrar con las tabs (Post, Place o Creator)
// idExplore es el id del post en explore (0 si no viene de explore)
const guardadosFigma = [
    {
        tipo: "Post",
        nombre: "@dani.mindful",
        texto: "Three breaths to calm anxiety before an interview.",
        imagen: "../../assets/images/dani-mindful.png",
        idExplore: 2
    },
    {
        tipo: "Place",
        nombre: "Calm Café",
        texto: "Safe spot in the network: you can wait here or ask to be accompanied.",
        imagen: "../../assets/images/cafe-calma.png",
        idExplore: 0
    },
    {
        tipo: "Creator",
        nombre: "@laura.psi",
        texto: "I support people through anxiety and grief. I post short exercises.",
        imagen: "../../assets/images/laura-psi.png",
        idExplore: 0
    }
];


// traigo los elementos del html que voy a usar
const listaRecientes = document.getElementById("lista-recientes"); // div vacio donde van las tarjetas
const sinResultados = document.getElementById("sin-resultados");   // mensaje de que no hay nada
const tabs = document.querySelectorAll(".tab");                     // las 4 tabs


// localStorage
// "aunaGuardados" es la misma clave que uso en explore,
// asi lo que guardo alla me aparece aca
const guardadosKey = "aunaGuardados";

// leo lo que ya estaba guardado, si no hay nada empiezo con un array vacio
const idsGuardados = JSON.parse(localStorage.getItem(guardadosKey)) || [];

// la tab que esta seleccionada, empieza en All
let tipoActual = "All";


// armo la lista de todo lo guardado
function armarGuardados() {
    // busco los posts de explore que tienen el id guardado
    const deExplore = postsExplore.filter(post => idsGuardados.includes(post.id));

    // los convierto al mismo formato de los guardados del figma
    const nuevos = [];
    deExplore.forEach(post => {
        nuevos.push({
            tipo: "Post",
            nombre: post.usuario,
            texto: post.texto,
            imagen: post.imagen
        });
    });

    // reverse para que lo ultimo que guarde salga primero
    nuevos.reverse();

    // quito del figma los que ya estan guardados desde explore
    // asi no sale el mismo post dos veces
    const delFigma = guardadosFigma.filter(item => !idsGuardados.includes(item.idExplore));

    // concat junta los dos arrays: primero los nuevos y despues los del figma
    return nuevos.concat(delFigma);
}

const todosLosGuardados = armarGuardados();


// funcion para crear una tarjeta de guardado
// la armo pieza por pieza con createElement, igual que en explore
function crearTarjeta(item) {

    // creo la tarjeta
    const tarjeta = document.createElement("article");
    tarjeta.className = "guardado";

    // imagen de arriba
    const imagen = document.createElement("img");
    imagen.className = "guardado-imagen";
    imagen.src = item.imagen;
    imagen.alt = item.nombre;
    tarjeta.appendChild(imagen);

    // parte de abajo con los textos
    const cuerpo = document.createElement("div");
    cuerpo.className = "guardado-cuerpo";

    // tipo en mayusculas (POST, PLACE o CREATOR)
    const tipo = document.createElement("p");
    tipo.className = "guardado-tipo";
    tipo.textContent = item.tipo.toUpperCase();

    const nombre = document.createElement("p");
    nombre.className = "guardado-nombre";
    nombre.textContent = item.nombre;

    const texto = document.createElement("p");
    texto.className = "guardado-texto";
    texto.textContent = item.texto;

    cuerpo.appendChild(tipo);
    cuerpo.appendChild(nombre);
    cuerpo.appendChild(texto);
    tarjeta.appendChild(cuerpo);

    // meto la tarjeta en la lista del html
    listaRecientes.appendChild(tarjeta);
}


// con esta funcion muestro los guardados segun la tab
function mostrarGuardados() {

    // borro las tarjetas que habia para que no se repitan
    listaRecientes.innerHTML = "";

    // si la tab es All muestro todo, si no solo los de ese tipo
    const filtrados = todosLosGuardados.filter(item => tipoActual === "All" || item.tipo === tipoActual);

    // creo una tarjeta por cada guardado
    filtrados.forEach(item => crearTarjeta(item));

    // si no hay nada muestro el mensaje, si no lo escondo
    if (filtrados.length === 0) {
        sinResultados.style.display = "block";
    } else {
        sinResultados.style.display = "none";
    }
}


// tabs: a cada una le agrego el evento click
tabs.forEach(tab => {
    tab.addEventListener("click", () => {

        // le quito la clase activa a todas y se la pongo a la que le di click
        tabs.forEach(t => t.classList.remove("tab-activa"));
        tab.classList.add("tab-activa");

        // dataset.tipo lee el data-tipo que puse en el html
        tipoActual = tab.dataset.tipo;
        mostrarGuardados();
    });
});


// cuando abro la pagina muestro los guardados
mostrarGuardados();