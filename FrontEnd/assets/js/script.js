// Variables globales
const galleryContainer = document.querySelector(".gallery");
const categoriesContainer = document.getElementById("categories");
const loginLink = document.getElementById("login-link");
const modal = document.getElementById("modal");
const closeModalButton = document.querySelector(".modal .close");
const editLink = document.getElementById("edit-link");

const API = "http://localhost:5678/api/works";
let allWorks = [];

// Fonction pour récupérer les œuvres
const getWorks = async () => {
  try {
    const result = await fetch(`${API}`);
    const data = await result.json();
    allWorks = data;
    console.log(data);
    displayWorks(allWorks);
  } catch (error) {
    console.log(error);
  }
};

// Fonction pour afficher les œuvres
const displayWorks = (works) => {
  galleryContainer.innerHTML = ""; // Effacer le contenu actuel de la galerie
  works.forEach((work) => {
    const figureW = figureWork(work);
    galleryContainer?.appendChild(figureW);
  });
};

// Fonction pour créer un élément figure pour une œuvre
const figureWork = (work) => {
  const figure = document.createElement("figure");
  const image = document.createElement("img");
  image.src = work.imageUrl;
  image.alt = work.title;
  figure.appendChild(image);
  const figCaption = document.createElement("figcaption");
  figCaption.textContent = work.title;
  figure.appendChild(figCaption);
  return figure;
};

const API_CATEGORIES = "http://localhost:5678/api/categories";

// Fonction pour récupérer les catégories
const getCategories = async () => {
  try {
    const resultCategories = await fetch(`${API_CATEGORIES}`);
    const dataCategories = await resultCategories.json();
    console.log(dataCategories);

    // Créer le bouton "Tous"
    const allButton = document.createElement("button");
    allButton.classList.add("buttonShape");
    allButton.textContent = "Tous";
    allButton.setAttribute("categoryId", "0");

    categoriesContainer?.appendChild(allButton);

    // Créer les boutons pour les catégories
    dataCategories.forEach((category) => {
      const categoryButton = document.createElement("button");
      categoryButton.classList.add("buttonShape");
      const categoryName = category.name;
      categoryButton.textContent = categoryName; // Assume que chaque catégorie a un champ 'name'
      categoryButton.setAttribute("categoryId", category.id);

      categoriesContainer?.appendChild(categoryButton);
    });
    addEventListenersToButtons();
  } catch (error) {
    console.log(error);
  }
};

// Fonction pour ajouter des écouteurs d'événements aux boutons
const addEventListenersToButtons = () => {
  const buttons = document.querySelectorAll("#categories button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // Retirer la classe "active" de tous les boutons
      buttons.forEach((btn) => btn.classList.remove("active"));
      // Ajouter la classe "active" au bouton cliqué
      button.classList.add("active");
      // Filtrer les œuvres par catégorie
      const categoryId = button.getAttribute("categoryId");

      if (categoryId !== "0") {
        const filteredWorks = allWorks.filter(
          (work) => work.categoryId == categoryId
        );
        displayWorks(filteredWorks);
      } else {
        console.log("tous les works sont", allWorks);
        displayWorks(allWorks); // Afficher tous les works si "Tous" est cliqué
      }
    });
  });
};

// Fonction pour vérifier l'état de connexion
const checkLoginStatus = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));

  if (auth && auth.token) {
    // Utilisateur connecté
    console.log("Utilisateur connecté");
    loginLink.textContent = "Logout";
    loginLink.href = "#";
    loginLink.classList.add("logout-link");
    loginLink.removeEventListener("click", logoutHandler);
    loginLink.addEventListener("click", logoutHandler);
    // Masquer les catégories si l'utilisateur est connecté
    if (categoriesContainer) {
      categoriesContainer.classList.add("hidden");
    }
  } else {
    // Utilisateur non connecté
    console.log("Utilisateur non connecté");
    loginLink.textContent = "Login";
    loginLink.href = "login.html";
    loginLink.classList.remove("logout-link");
    // Afficher les catégories si l'utilisateur n'est pas connecté
    if (categoriesContainer) {
      categoriesContainer.classList.remove("hidden");
    }
  }
};

// Fonction pour gérer la déconnexion
const logoutHandler = (event) => {
  event.preventDefault();
  localStorage.removeItem("auth");
  window.location.reload();
};

// Fonction pour ouvrir la modal
const openModal = () => {
  if (modal) {
    modal.classList.remove("hidden");
  }
};

// Fonction pour fermer la modal
const closeModal = () => {
  if (modal) {
    modal.classList.add("hidden");
  }
};

// Vérifiez si les éléments sont trouvés
console.log("editLink:", editLink);
console.log("closeModalButton:", closeModalButton);
console.log("modal:", modal);

// Événement pour ouvrir la modal lorsqu'on clique sur le lien modifier
if (editLink) {
  editLink.addEventListener("click", (event) => {
    event.preventDefault(); // Empêche le lien de naviguer
    openModal();
  });
}

// Événement pour fermer la modal lorsqu'on clique sur le bouton de fermeture
if (closeModalButton) {
  closeModalButton.addEventListener("click", closeModal);
}

// Événement pour fermer la modal lorsqu'on clique en dehors de la modal
if (modal) {
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

// Appeler les fonctions au chargement de la page
checkLoginStatus();
getCategories();
getWorks();
