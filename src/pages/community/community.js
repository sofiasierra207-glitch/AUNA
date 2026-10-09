/*
   AÚNA - PÁGINA DE COMUNIDAD
   Los datos (professionals y circles) vienen del archivo data.js
*/


/*
   Tarjetas de profesionales
*/

// Contenedor donde van las tarjetas
const professionalsGrid = document.querySelector(".professionals-grid");

// Categoría elegida en los filtros ("All" muestra todas)
let selectedCategory = "All";

// Escribe los seguidores corto: 2400 se ve como "2.4k"
function formatFollowers(number) {
    if (number >= 1000) {
        return (number / 1000).toFixed(1) + "k";
    }
    return number;
}

// Crea la tarjeta de una profesional y activa su botón Follow
function createProfessionalCard(professional) {

    // Texto y clase del botón según si ya la sigue
    let buttonText = "Follow";
    let buttonClass = "";

    if (professional.following) {
        buttonText = "Following";
        buttonClass = "following";
    }

    // Crea la etiqueta article de la tarjeta
    const card = document.createElement("article");
    card.className = "professional-card";

    // Contenido de la tarjeta con los datos de la profesional
    card.innerHTML = `
        <span class="professional-avatar">${professional.initial}</span>
        <h3>${professional.name}</h3>
        <p class="professional-user">${professional.user}</p>
        <span class="verified-tag">
            <img src="../../assets/icons/check.svg" alt="">
            ${professional.specialty} · Verified
        </span>
        <p class="professional-description">${professional.description}</p>
        <p class="professional-stats">
            <strong class="followers-count">${formatFollowers(professional.followers)} followers</strong>
            <span class="stats-dot"></span>
            ${professional.replies}
        </p>
        <button type="button" class="follow-button ${buttonClass}">${buttonText}</button>
    `;

    // Botón Follow y número de seguidores de esta tarjeta
    const followButton = card.querySelector(".follow-button");
    const followersCount = card.querySelector(".followers-count");

    // Follow: suma 1 seguidor; si ya la seguía, resta 1
    followButton.addEventListener("click", function () {
        if (professional.following) {
            professional.following = false;
            professional.followers = professional.followers - 1;
            followButton.classList.remove("following");
            followButton.textContent = "Follow";
        } else {
            professional.following = true;
            professional.followers = professional.followers + 1;
            followButton.classList.add("following");
            followButton.textContent = "Following";
            showToast("You are now following " + professional.name);
        }
        followersCount.textContent = formatFollowers(professional.followers) + " followers";
    });

    return card;
}

// Recorre las profesionales y muestra solo las de la categoría elegida
function renderProfessionals() {
    professionalsGrid.innerHTML = "";

    for (const professional of professionals) {
        if (selectedCategory === "All" || professional.category === selectedCategory) {
            const card = createProfessionalCard(professional);
            professionalsGrid.appendChild(card);
        }
    }
}


/*
   Filtros por categoría
*/

const filterChips = document.querySelectorAll(".filter-chips .chip");

// Al hacer clic en un filtro: lo marca y vuelve a pintar las tarjetas
for (const chip of filterChips) {
    chip.addEventListener("click", function () {

        // Apaga todos los filtros
        for (const item of filterChips) {
            item.classList.remove("active");
            item.setAttribute("aria-pressed", "false");
        }

        // Enciende el filtro clicado
        chip.classList.add("active");
        chip.setAttribute("aria-pressed", "true");

        // Guarda la categoría y vuelve a pintar
        selectedCategory = chip.textContent;
        renderProfessionals();
    });
}


/*
   Círculos abiertos
*/

const circlesList = document.querySelector(".circles-list");

// Crea la fila de un círculo y activa su botón Join
function createCircleRow(circle) {

    // Texto y clase del botón según si ya se unió
    let buttonText = "Join";
    let buttonClass = "";

    if (circle.joined) {
        buttonText = "Joined";
        buttonClass = "joined";
    }

    const row = document.createElement("article");
    row.className = "circle-card";

    row.innerHTML = `
        <span class="circle-avatar">${circle.initial}</span>
        <div class="circle-info">
            <h3>${circle.name}</h3>
            <p>${circle.description}</p>
            <span class="circle-details"><span class="members-count">${circle.members}</span> members · ${circle.privacy}</span>
        </div>
        <button type="button" class="join-button ${buttonClass}">${buttonText}</button>
    `;

    // Botón Join y número de miembros de este círculo
    const joinButton = row.querySelector(".join-button");
    const membersCount = row.querySelector(".members-count");

    // Join: suma 1 miembro; si ya estaba, resta 1
    joinButton.addEventListener("click", function () {
        if (circle.joined) {
            circle.joined = false;
            circle.members = circle.members - 1;
            joinButton.classList.remove("joined");
            joinButton.textContent = "Join";
        } else {
            circle.joined = true;
            circle.members = circle.members + 1;
            joinButton.classList.add("joined");
            joinButton.textContent = "Joined";
            showToast("You joined " + circle.name);
        }
        membersCount.textContent = circle.members;
    });

    return row;
}

// Recorre los círculos y crea una fila para cada uno
function renderCircles() {
    circlesList.innerHTML = "";

    for (const circle of circles) {
        const row = createCircleRow(circle);
        circlesList.appendChild(row);
    }
}


/*
   Mensaje temporal
*/

const toast = document.querySelector("#toast");

// Muestra un mensaje abajo y lo oculta después de 2,5 segundos
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("visible");

    setTimeout(function () {
        toast.classList.remove("visible");
    }, 2500);
}


/*
   Botones del header y de verificación
   Aquí se conectan los componentes de Cami cuando estén listos
*/

// Lupa: abre el componente de búsqueda de Cami
document.querySelector("#search-button").addEventListener("click", function () {
    abrirBuscar();
});

document.querySelector("#profile-button").addEventListener("click", function () {
    showToast("Your profile menu is coming soon");
});

// Caja rosada: abre el componente de verificación de Cami
document.querySelector(".verify-button").addEventListener("click", function () {
    abrirVerificacion();
});


// Pinta las profesionales y los círculos apenas carga la página
renderProfessionals();
renderCircles();
