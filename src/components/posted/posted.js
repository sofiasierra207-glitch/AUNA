/* Ventana que aparece cuando se publica un post*/
// Crea el fondo oscuro que cubre la página
const postedOverlay = document.createElement("div");
postedOverlay.className = "posted-overlay";

// Contenido de la ventana: ícono, título, texto y botón
postedOverlay.innerHTML = `
    <div class="posted-modal" role="dialog" aria-modal="true" aria-labelledby="posted-title">
        <span class="posted-icon">
            <img src="../../assets/icons/check.svg" alt="">
        </span>
        <h3 id="posted-title">Posted successfully!</h3>
        <p>Your post is now visible to the community.</p>
        <button type="button" class="posted-button">View post</button>
    </div>
`;

// Agrega la ventana al final de la página (oculta al inicio)
document.body.appendChild(postedOverlay);

// Muestra la ventana
function openPostedModal() {
    postedOverlay.classList.add("open");
    postedOverlay.querySelector(".posted-button").focus();
}

// Oculta la ventana
function closePostedModal() {
    postedOverlay.classList.remove("open");
}

// "View post": cierra la ventana y baja hasta el primer post
const viewPostButton = postedOverlay.querySelector(".posted-button");

viewPostButton.addEventListener("click", function () {
    closePostedModal();

    const firstPost = document.querySelector(".post-card");
    if (firstPost) {
        firstPost.scrollIntoView({ behavior: "smooth", block: "center" });
    }
});

// Tecla Escape: también cierra la ventana
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closePostedModal();
    }
});
