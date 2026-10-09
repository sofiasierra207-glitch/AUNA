// Contenedor donde van las tarjetas de los lugares
const resourcesGrid = document.querySelector(".resources-grid");

// Categoría elegida en los filtros ("All" muestra todo)
let selectedCategory = "All";

// Crea la tarjeta de un lugar y activa su botón Contact
function createResourceCard(resource) {

    // Texto y clase del botón según si ya se contactó
    let buttonText = "Contact";
    let buttonClass = "";

    if (resource.contacted) {
        buttonText = "Contacted";
        buttonClass = "contacted";
    }

    // Crea la etiqueta article de la tarjeta
    const card = document.createElement("article");
    card.className = "resource-card";

    // Contenido de la tarjeta con los datos del lugar
    card.innerHTML = `
        <span class="resource-tag">${resource.category}</span>
        <h3>${resource.name}</h3>
        <p class="resource-description">${resource.description}</p>
        <p class="resource-details"><span class="dot"></span>${resource.details}</p>
        <button type="button" class="contact-button ${buttonClass}">${buttonText}</button>
    `;

    // Botón Contact: cambia entre Contact y Contacted
    const contactButton = card.querySelector(".contact-button");

    contactButton.addEventListener("click", function () {
        if (resource.contacted) {
            resource.contacted = false;
            contactButton.classList.remove("contacted");
            contactButton.textContent = "Contact";
        } else {
            resource.contacted = true;
            contactButton.classList.add("contacted");
            contactButton.textContent = "Contacted";
            showToast("Your message was sent to " + resource.name);
        }
    });

    return card;
}

// Recorre los lugares y muestra solo los de la categoría elegida
function renderResources() {
    resourcesGrid.innerHTML = "";

    for (const resource of helpResources) {
        if (selectedCategory === "All" || resource.category === selectedCategory) {
            const card = createResourceCard(resource);
            resourcesGrid.appendChild(card);
        }
    }
}


/* Filtros por categoria*/

const filterChips = document.querySelectorAll(".filter-chips .chip");

// Al hacer clic en un filtro: lo marca y vuelve a pintar los lugares
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
        renderResources();
    });
}


/* Preguntas frecuentes */

const faqList = document.querySelector(".faq-list");

// Recorre las preguntas y crea una tarjeta para cada una
function renderQuestions() {
    faqList.innerHTML = "";

    for (const item of helpQuestions) {
        const card = document.createElement("article");
        card.className = "faq-item";

        card.innerHTML = `
            <h3>${item.question}</h3>
            <p>${item.answer}</p>
        `;

        faqList.appendChild(card);
    }
}


/* Mensaje temporal*/

const toast = document.querySelector("#toast");

// Muestra un mensaje abajo y lo oculta después de 2,5 segundos
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("visible");

    setTimeout(function () {
        toast.classList.remove("visible");
    }, 2500);
}


/* Botones de header y ayuda */

// Lupa: abre el componente de búsqueda de Cami
document.querySelector("#search-button").addEventListener("click", function () {
    abrirBuscar();
});

// Caja oscura: abre el componente de pedir ayuda de Cami
document.querySelector(".ask-help-button").addEventListener("click", function () {
    abrirAyuda();
});


// Pinta los lugares y las preguntas apenas carga la página
renderResources();
renderQuestions();