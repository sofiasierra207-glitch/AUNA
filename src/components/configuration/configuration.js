/* Ventana de configuración (Settings) */

// Datos de la cuenta; type dice si el campo es texto o contraseña
const settingsAccount = [
    { label: "Full name", value: "Valentina Torres", type: "text" },
    { label: "Email address", value: "valen.torres@email.com", type: "email" },
    { label: "Password", value: "auna2026", type: "password" }
];

// Interruptores de notificaciones y privacidad
const settingsSwitches = [
    { group: "Notifications", title: "Push notifications", text: "Alerts for likes, comments, and messages", on: true },
    { group: "Notifications", title: "Weekly emails", text: "A weekly recap of your community", on: false },
    { group: "Notifications", title: "Wellness reminders", text: "A gentle message whenever you need it", on: true },
    { group: "Privacy", title: "Public profile", text: "Other users can see your profile", on: true },
    { group: "Privacy", title: "Anonymous mode by default", text: "Your posts won't show your name", on: true }
];

// Crea el fondo oscuro que cubre la página
const settingsOverlay = document.createElement("div");
settingsOverlay.className = "settings-overlay";

// Estructura de la ventana; las filas se agregan abajo con los datos
settingsOverlay.innerHTML = `
    <div class="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">

        <div class="settings-header">
            <h3 id="settings-title">Settings</h3>
            <button type="button" class="settings-close" aria-label="Close">×</button>
        </div>

        <p class="settings-group">ACCOUNT</p>
        <div class="settings-account"></div>

        <p class="settings-group">NOTIFICATIONS</p>
        <div class="settings-switches" id="switches-notifications"></div>

        <p class="settings-group">PRIVACY</p>
        <div class="settings-switches" id="switches-privacy"></div>

        <button type="button" class="settings-logout">Log out</button>
        <button type="button" class="settings-delete">Delete my account</button>
    </div>
`;


/* Filas de la cuenta: al hacer clic se pueden editar */

const accountBox = settingsOverlay.querySelector(".settings-account");

// Muestra el valor; si es contraseña muestra puntos
function showValue(item) {
    if (item.type === "password") {
        return "••••••••";
    } else {
        return item.value;
    }
}

for (const item of settingsAccount) {
    const row = document.createElement("div");
    row.className = "settings-row";

    row.innerHTML = `
        <span class="settings-label">${item.label}</span>
        <span class="settings-value">${showValue(item)}</span>
        <input class="settings-input" type="${item.type}" aria-label="${item.label}">
        <span class="settings-arrow">›</span>
    `;

    const valueText = row.querySelector(".settings-value");
    const input = row.querySelector(".settings-input");

    // Clic en la fila: muestra el campo para escribir
    row.addEventListener("click", function () {
        if (!row.classList.contains("editing")) {
            row.classList.add("editing");
            input.value = item.value;
            input.focus();
        }
    });

    // Enter guarda el cambio; si está vacío deja el valor anterior
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            if (input.value.trim() !== "") {
                item.value = input.value.trim();
            }
            valueText.textContent = showValue(item);
            row.classList.remove("editing");
        }
    });

    // Al salir del campo también se cierra la edición
    input.addEventListener("blur", function () {
        valueText.textContent = showValue(item);
        row.classList.remove("editing");
    });

    accountBox.appendChild(row);
}


/* Interruptores: cada uno cambia entre encendido y apagado */

for (const item of settingsSwitches) {
    const row = document.createElement("div");
    row.className = "switch-row";

    // Clase y estado según si empieza encendido
    let switchClass = "";
    if (item.on) {
        switchClass = "on";
    }

    row.innerHTML = `
        <div>
            <strong>${item.title}</strong>
            <p>${item.text}</p>
        </div>
        <button type="button" class="switch ${switchClass}" role="switch" aria-checked="${item.on}" aria-label="${item.title}">
            <span class="switch-dot"></span>
        </button>
    `;

    const switchButton = row.querySelector(".switch");

    // Clic: si estaba encendido lo apaga; si no, lo enciende
    switchButton.addEventListener("click", function () {
        if (item.on) {
            item.on = false;
            switchButton.classList.remove("on");
        } else {
            item.on = true;
            switchButton.classList.add("on");
        }
        switchButton.setAttribute("aria-checked", item.on);
    });

    // Va en la caja de su grupo
    if (item.group === "Notifications") {
        settingsOverlay.querySelector("#switches-notifications").appendChild(row);
    } else {
        settingsOverlay.querySelector("#switches-privacy").appendChild(row);
    }
}


/* Abrir y cerrar */

// Agrega la ventana al final de la página (oculta al inicio)
document.body.appendChild(settingsOverlay);

const deleteButton = settingsOverlay.querySelector(".settings-delete");

// Muestra la ventana
function openSettings() {
    settingsOverlay.classList.add("open");
}

// Oculta la ventana y deja "Delete" como al inicio
function closeSettings() {
    settingsOverlay.classList.remove("open");
    deleteButton.classList.remove("confirm");
    deleteButton.textContent = "Delete my account";
}

// La X cierra la ventana
settingsOverlay.querySelector(".settings-close").addEventListener("click", function () {
    closeSettings();
});

// Clic en el fondo oscuro también cierra
settingsOverlay.addEventListener("click", function (event) {
    if (event.target === settingsOverlay) {
        closeSettings();
    }
});

// Log out: borra la sesión y lleva a la página de inicio de sesión
settingsOverlay.querySelector(".settings-logout").addEventListener("click", function () {
    localStorage.removeItem("aunaSession");
    window.location.href = "../../pages/login/login.html";
});

// Delete: el primer clic pide confirmar y el segundo cierra la sesión
deleteButton.addEventListener("click", function () {
    if (deleteButton.classList.contains("confirm")) {
        // Borra la sesión y el perfil guardados
        localStorage.removeItem("aunaSession");
        localStorage.removeItem("aunaUser");
        window.location.href = "../../pages/login/login.html";
    } else {
        deleteButton.classList.add("confirm");
        deleteButton.textContent = "Click again to delete your account";
    }
});

// Tecla Escape: también cierra la ventana
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeSettings();
    }
});
