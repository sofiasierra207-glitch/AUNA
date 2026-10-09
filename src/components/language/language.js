/* Menú de idiomas: se despliega debajo del botón de idioma del header */

// Botón de idioma que ya existe en el header
const languageButton = document.querySelector("#language-button");

// Idiomas que aparecen en el menú
const languages = ["English", "Español", "Français", "Português"];

// Idioma elegido al inicio
let selectedLanguage = "English";

// Crea la cajita del menú con su título
const languageMenu = document.createElement("div");
languageMenu.className = "language-menu";
languageMenu.innerHTML = `<p class="language-title">Language</p>`;

// Crea un botón por cada idioma
for (const language of languages) {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "language-option";
    option.innerHTML = `${language} <img src="../../assets/icons/check.svg" alt="">`;

    // Marca el idioma que está elegido
    if (language === selectedLanguage) {
        option.classList.add("active");
    }

    // Clic en un idioma: lo marca con el check y cierra el menú
    option.addEventListener("click", function () {
        const options = languageMenu.querySelectorAll(".language-option");
        for (const item of options) {
            item.classList.remove("active");
        }
        option.classList.add("active");
        selectedLanguage = language;
        closeLanguageMenu();
    });

    languageMenu.appendChild(option);
}

// Pone el menú al lado del botón, dentro del grupo de íconos
languageButton.parentElement.appendChild(languageMenu);

// Abre el menú
function openLanguageMenu() {
    languageMenu.classList.add("open");
    languageButton.classList.add("active");
}

// Cierra el menú
function closeLanguageMenu() {
    languageMenu.classList.remove("open");
    languageButton.classList.remove("active");
}

// Clic en el botón: si está abierto lo cierra; si no, lo abre
languageButton.addEventListener("click", function () {
    if (languageMenu.classList.contains("open")) {
        closeLanguageMenu();
    } else {
        openLanguageMenu();
    }
});

// Clic en cualquier otra parte de la página: cierra el menú
document.addEventListener("click", function (event) {
    const clickInMenu = languageMenu.contains(event.target);
    const clickInButton = languageButton.contains(event.target);

    if (!clickInMenu && !clickInButton) {
        closeLanguageMenu();
    }
});