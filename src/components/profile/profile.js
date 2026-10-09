/* Ventana con el perfil de la usuaria */

// Datos del perfil (como en el Figma)
const profileData = {
    name: "Valentina Torres",
    user: "@valen.torres",
    initial: "V",
    bio: "Learning to take care of myself without guilt. Sharing what helps me: reading, simple routines, and quiet moments.",
    followers: 186,
    posts: 42,
    collections: 9
};

// Intereses y colecciones (arreglos para recorrerlos con for...of)
const profileInterests = ["Mental wellness", "Reading", "Creativity", "Motherhood", "Safe spaces"];

const profileCollections = [
    { name: "Safe routes", details: "8 places" },
    { name: "For slow reading", details: "12 posts" },
    { name: "Voices that support you", details: "9 stories" }
];

// Crea el fondo oscuro que cubre la página
const profileOverlay = document.createElement("div");
profileOverlay.className = "profile-overlay";

// Contenido fijo de la ventana; intereses y colecciones se agregan abajo
profileOverlay.innerHTML = `
    <div class="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-name">

        <div class="profile-top">
            <span class="profile-avatar">${profileData.initial}</span>
            <div class="profile-names">
                <div class="profile-title">
                    <h3 id="profile-name">${profileData.name}</h3>
                    <span class="profile-badge">✓ Verified</span>
                </div>
                <p class="profile-user">${profileData.user}</p>
            </div>
            <button type="button" class="profile-close" aria-label="Close">×</button>
        </div>

        <p class="profile-bio">${profileData.bio}</p>

        <div class="profile-stats">
            <div><strong>${profileData.followers}</strong><span>Followers</span></div>
            <div class="profile-stat-middle"><strong>${profileData.posts}</strong><span>Posts</span></div>
            <div><strong>${profileData.collections}</strong><span>Collections</span></div>
        </div>

        <h4 class="profile-subtitle">Interests</h4>
        <div class="profile-interests"></div>

        <h4 class="profile-subtitle">Collections</h4>
        <div class="profile-collections"></div>

        <button type="button" class="profile-edit">Edit profile</button>
    </div>
`;

// Pinta un chip por cada interés
const interestsBox = profileOverlay.querySelector(".profile-interests");

for (const interest of profileInterests) {
    const chip = document.createElement("span");
    chip.className = "profile-chip";
    chip.textContent = interest;
    interestsBox.appendChild(chip);
}

// Pinta una tarjeta por cada colección; al hacer clic queda marcada
const collectionsBox = profileOverlay.querySelector(".profile-collections");

for (const collection of profileCollections) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "profile-collection";
    card.innerHTML = `<strong>${collection.name}</strong><span>${collection.details}</span>`;

    card.addEventListener("click", function () {
        const cards = collectionsBox.querySelectorAll(".profile-collection");
        for (const item of cards) {
            item.classList.remove("active");
        }
        card.classList.add("active");
    });

    collectionsBox.appendChild(card);
}

// Agrega la ventana al final de la página (oculta al inicio)
document.body.appendChild(profileOverlay);

// Muestra la ventana
function openProfile() {
    profileOverlay.classList.add("open");
}

// Oculta la ventana
function closeProfile() {
    profileOverlay.classList.remove("open");
}

// La X cierra la ventana
profileOverlay.querySelector(".profile-close").addEventListener("click", function () {
    closeProfile();
});

// Clic en el fondo oscuro (fuera de la caja) también cierra
profileOverlay.addEventListener("click", function (event) {
    if (event.target === profileOverlay) {
        closeProfile();
    }
});

// "Edit profile": cierra el perfil y abre la configuración
profileOverlay.querySelector(".profile-edit").addEventListener("click", function () {
    closeProfile();
    openSettings();
});

// Tecla Escape: también cierra la ventana
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeProfile();
    }
});
