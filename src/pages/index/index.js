//Iconos
// Carpeta donde están los archivos de los íconos
const iconsFolder = "../../assets/icons/";


/* 
   Tarjetas del feed
 */

// Contenedor donde van las tarjetas
const postsGrid = document.querySelector(".posts-grid");

// Crea la tarjeta de un post y activa sus botones
function createPostCard(post) {

    // Valores que cambian si el post tiene like o está guardado
    let likedClass = "";
    let savedClass = "";
    let saveText = "Save";
    let heartIcon = "heart.svg";
    let saveIcon = "save.svg";

    if (post.liked) {
        likedClass = "liked";
        heartIcon = "heart-filled.svg";
    }

    if (post.saved) {
        savedClass = "saved";
        saveText = "Saved";
        saveIcon = "save-filled.svg";
    }

    // Crea la etiqueta article de la tarjeta
    const card = document.createElement("article");
    card.className = "post-card";

    // Contenido de la tarjeta con los datos del post
    card.innerHTML = `
        <img src="${post.image}" alt="${post.imageAlt}">

        <div class="post-content">

            <div class="post-user">
                <span class="user-avatar">${post.initial}</span>
                <div>
                    <strong>${post.user}</strong>
                    <p class="post-meta">${post.role} · ${post.time}</p>
                </div>
            </div>

            <span class="post-tag">${post.tag}</span>

            <p class="post-text"></p>

            <div class="post-interactions">

                <button type="button" class="action-button comment-button" aria-label="Comment">
                    <img src="${iconsFolder}comment.svg" alt="">
                    <span class="comment-count">${post.comments}</span>
                </button>

                <button type="button" class="action-button like-button ${likedClass}" aria-label="Like">
                    <img src="${iconsFolder}${heartIcon}" alt="" class="like-icon">
                    <span class="like-count">${post.likes}</span>
                </button>

                <button type="button" class="action-button save-button ${savedClass}">
                    <img src="${iconsFolder}${saveIcon}" alt="" class="save-icon">
                    <span class="save-text">${saveText}</span>
                </button>

            </div>

            <div class="comment-box">
                <input type="text" placeholder="Write a comment..." aria-label="Write a comment">
                <button type="button" class="send-button">Send</button>
            </div>

        </div>
    `;

    // El texto se pone con textContent para que se vea tal cual lo escribió la usuaria
    card.querySelector(".post-text").textContent = post.text;

    // Busca los botones y textos que están dentro de esta tarjeta
    const likeButton = card.querySelector(".like-button");
    const likeCount = card.querySelector(".like-count");
    const likeIcon = card.querySelector(".like-icon");
    const saveButton = card.querySelector(".save-button");
    const saveTextElement = card.querySelector(".save-text");
    const saveIconElement = card.querySelector(".save-icon");
    const commentButton = card.querySelector(".comment-button");
    const commentCount = card.querySelector(".comment-count");
    const commentBox = card.querySelector(".comment-box");
    const commentInput = card.querySelector(".comment-box input");
    const sendButton = card.querySelector(".send-button");

    // Like: si ya tenía like se lo quita y resta 1; si no, se lo pone y suma 1
    likeButton.addEventListener("click", function () {
        if (post.liked) {
            post.liked = false;
            post.likes = post.likes - 1;
            likeButton.classList.remove("liked");
            likeIcon.src = iconsFolder + "heart.svg";
        } else {
            post.liked = true;
            post.likes = post.likes + 1;
            likeButton.classList.add("liked");
            likeIcon.src = iconsFolder + "heart-filled.svg";
        }
        likeCount.textContent = post.likes;
    });

    // Guardar: cambia entre Save y Saved
    saveButton.addEventListener("click", function () {
        if (post.saved) {
            post.saved = false;
            saveButton.classList.remove("saved");
            saveTextElement.textContent = "Save";
            saveIconElement.src = iconsFolder + "save.svg";
        } else {
            post.saved = true;
            saveButton.classList.add("saved");
            saveTextElement.textContent = "Saved";
            saveIconElement.src = iconsFolder + "save-filled.svg";
        }
    });

    // Comentar: muestra u oculta la caja de comentario
    commentButton.addEventListener("click", function () {
        commentBox.classList.toggle("open");
        commentInput.focus();
    });

    // Enviar comentario: si hay texto, suma 1 y cierra la caja
    sendButton.addEventListener("click", function () {
        if (commentInput.value.trim() === "") {
            commentInput.focus();
        } else {
            post.comments = post.comments + 1;
            commentCount.textContent = post.comments;
            commentInput.value = "";
            commentBox.classList.remove("open");
        }
    });

    return card;
}

// Recorre la lista de posts y agrega cada tarjeta a la página
function renderPosts() {
    postsGrid.innerHTML = "";

    for (const post of posts) {
        const card = createPostCard(post);
        postsGrid.appendChild(card);
    }
}


/* 
   Lugares de AÚNA Help
*/

// Lista donde van los lugares
const resourcesList = document.querySelector(".help-resources");

// Recorre los lugares y crea una tarjeta para cada uno
function renderResources() {
    resourcesList.innerHTML = "";

    for (const resource of resources) {
        const item = document.createElement("li");

        item.innerHTML = `
            <a href="../help/help.html" class="resource-card">
                <span class="user-avatar">${resource.initial}</span>
                <span class="resource-info">
                    <strong>${resource.name}</strong>
                    <span>${resource.details}</span>
                </span>
            </a>
        `;

        resourcesList.appendChild(item);
    }
}


/* 
   Chips y portadas
   Solo un botón activo por grupo
*/

// Apaga todos los botones del grupo y enciende el que se clicó
function activateOne(buttons, clickedButton) {
    for (const button of buttons) {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", "false");
    }

    clickedButton.classList.add("active");
    clickedButton.setAttribute("aria-pressed", "true");
}

// Le pone el evento de clic a cada botón de un grupo
function setupGroup(selector) {
    const buttons = document.querySelectorAll(selector);

    for (const button of buttons) {
        button.addEventListener("click", function () {
            activateOne(buttons, button);
        });
    }
}

// Grupos: tipo de contenido, tema y portada
setupGroup(".type-chips .chip");
setupGroup(".topic-chips .chip");
setupGroup(".cover");


/* 
   Publicar un post
*/

const postText = document.querySelector("#post-text");
const postError = document.querySelector("#post-error");
const postButton = document.querySelector(".post-button");

// Clic en Post: si no hay texto muestra el error; si hay, publica
postButton.addEventListener("click", function () {
    const text = postText.value.trim();

    if (text === "") {
        postError.textContent = "Write something before posting.";
        postText.focus();
    } else {
        // Tema elegido; si no eligió ninguno queda "Community"
        let topic = "Community";
        const topicChip = document.querySelector(".topic-chips .chip.active");
        if (topicChip) {
            topic = topicChip.textContent;
        }

        // Portada elegida
        const coverImage = document.querySelector(".cover.active img");

        // Post nuevo con el mismo formato de data.js
        const newPost = {
            user: currentUser.user,
            initial: currentUser.initial,
            role: currentUser.role,
            time: "Just now",
            tag: topic,
            text: text,
            image: coverImage.getAttribute("src"),
            imageAlt: coverImage.alt,
            comments: 0,
            likes: 0,
            liked: false,
            saved: false
        };

        // Lo pone de primero en la lista y vuelve a pintar el feed
        posts.unshift(newPost);
        renderPosts();

        // Limpia el formulario y muestra la ventana de éxito
        resetPostForm();
        openPostedModal();
    }
});

// Borra el error apenas la usuaria empieza a escribir
postText.addEventListener("input", function () {
    postError.textContent = "";
});

// Deja el formulario vacío y sin chips elegidos
function resetPostForm() {
    postText.value = "";
    postError.textContent = "";

    const activeChips = document.querySelectorAll(".chip.active");
    for (const chip of activeChips) {
        chip.classList.remove("active");
        chip.setAttribute("aria-pressed", "false");
    }
}


/* 
   Boton follow
*/

const followButton = document.querySelector(".follow-button");

// Cambia entre Follow y Following
followButton.addEventListener("click", function () {
    if (followButton.classList.contains("following")) {
        followButton.classList.remove("following");
        followButton.textContent = "Follow";
    } else {
        followButton.classList.add("following");
        followButton.textContent = "Following";
    }
});


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
   Botones del header Y aunahelp
   Aquí se conectan los componentes de Cami cuando estén listos
*/

// Lupa: abre el componente de búsqueda de Cami
document.querySelector("#search-button").addEventListener("click", function () {
    abrirBuscar();
});

document.querySelector("#profile-button").addEventListener("click", function () {
    showToast("Your profile menu is coming soon");
});

document.querySelector(".help-button").addEventListener("click", function () {
    showToast("The help request form is coming soon");
});


// Pinta los posts y los lugares apenas carga la página
renderPosts();
renderResources();