// Code JavaScript existant
const galleryContainer = document.querySelector(".gallery");
const categoriesContainer = document.getElementById("categories");
const loginLink = document.getElementById("login-link");
const modal = document.getElementById("modal");
const closeModalButton = document.querySelector(".modal .close");
const editLink = document.getElementById("edit-link");
const editIcon = document.querySelector(".edit-section i");
const selectedCategory = document.querySelector("#category");
const fileInput = document.getElementById("file-input");
const imagePreview = document.querySelector("#imagePreview");

const API = "http://localhost:5678/api/works";
const APIDelete = "http://localhost:5678/api/works/2";
const API_CATEGORIES = "http://localhost:5678/api/categories";
let allWorks = [];
let allCategories = [];

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
    allCategories = dataCategories;
    // Créer les boutons pour les catégories
    allCategories.forEach((category) => {
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
  const token = localStorage.getItem("token");

  if (token) {
    // Utilisateur connecté
    loginLink.textContent = "Logout";
    loginLink.href = "#";
    loginLink.classList.add("logout-link");
    loginLink.removeEventListener("click", logoutHandler);
    loginLink.addEventListener("click", logoutHandler);
    // Masquer les catégories si l'utilisateur est connecté
    if (categoriesContainer) {
      categoriesContainer.classList.add("hidden");
    }
    // Afficher le lien "modifier" et l'icône si l'utilisateur est connecté
    if (editLink) {
      editLink.classList.remove("hidden");
    }
    if (editIcon) {
      editIcon.classList.remove("hidden");
    }
  } else {
    // Utilisateur non connecté
    loginLink.textContent = "Login";
    loginLink.href = "login.html";
    loginLink.classList.remove("logout-link");
    // Afficher les catégories si l'utilisateur n'est pas connecté
    if (categoriesContainer) {
      categoriesContainer.classList.remove("hidden");
    }
    // Masquer le lien "modifier" et l'icône si l'utilisateur n'est pas connecté
    if (editLink) {
      editLink.classList.add("hidden");
    }
    if (editIcon) {
      editIcon.classList.add("hidden");
    }
  }
};

// Fonction pour gérer la déconnexion
const logoutHandler = (event) => {
  event.preventDefault();
  localStorage.removeItem("token");
  window.location.reload();
};

// Fonction pour afficher les projets dans la modal avec une icône de suppression
const displayProjectsInModal = () => {
  const projectsContainer = document.getElementById("projects-container");
  projectsContainer.innerHTML = ""; // Vider le contenu actuel

  allWorks.forEach((work) => {
    const projectCard = document.createElement("div");
    projectCard.classList.add("project-card");

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper");

    const image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");

    imageWrapper.appendChild(image);
    imageWrapper.appendChild(deleteIcon);

    projectCard.appendChild(imageWrapper);
    projectsContainer.appendChild(projectCard);
    deleteIcon.addEventListener("click", () => {
      deleteProject(work.id);
    });
  });
};

// Fonction pour supprimer un projet
const deleteProject = async (projectId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Vous devez etre connecter pour supprimer un work");
    return;
  }
  const confirmation = confirm("Etes vous sur de vouloir supprimer ce work ? ");
  console.log("le token est" + token);
  try {
    const response = await fetch(`${API}/${projectId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Ìl y'as une erreur de type ${response.status}`);
    }
    console.log("Suppression reussie");
  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error);
  }
  galleryContainer.innerHTML = "";
  getWorks();
  displayProjectsInModal();
};

// Fonction pour ouvrir la modal
const openModal = () => {
  if (modal) {
    modal.classList.remove("hidden");
    displayProjectsInModal(); // Afficher les projets dans la modal
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

// Fonction pour ouvrir la modal d'ajout de photo
const openAddPhotoModal = () => {
  addPhotoModal.classList.remove("hidden");
  modal.classList.add("hidden"); // Masquer la modal principale
  categoriesSelect();
};

// Fonction pour fermer la modal d'ajout de photo
const closeAddPhotoModal = () => {
  addPhotoModal.classList.add("hidden");
};

// Fonction pour revenir à la modal principale
const backToPreviousModal = () => {
  closeAddPhotoModal();
  modal.classList.remove("hidden");
};

// Éléments pour la modal d'ajout de photo
const addPhotoModal = document.getElementById("add-photo-modal");
const backArrow = addPhotoModal.querySelector(".back-arrow");
const openAddPhotoButton = document.querySelector(".add-photo-button");

// Événements pour ouvrir et fermer la modal d'ajout de photo
openAddPhotoButton.addEventListener("click", openAddPhotoModal);
backArrow.addEventListener("click", backToPreviousModal);
addPhotoModal
  .querySelector(".close")
  .addEventListener("click", closeAddPhotoModal);

// Sélectionner les éléments pour la modal d'ajout de photo
const addPhotoButtonInCard = document.querySelector(
  ".add-photo-button-in-card"
);

//Method pour l'ajout de la prévisualisation
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const ACCEPTED_EXTENSIONS = ["png", "jpg"];
  // On met le nom du fichier dans une variable
  const fileName = file.name;
  console.log("Nom du fichier sélectionné:", fileName);
  const extension = fileName.split(".").pop().toLowerCase();
  //On vérifie l'extension et la taille des images uploadées
  if (
    file &&
    file.size <= 4 * 1024 * 1024 &&
    ACCEPTED_EXTENSIONS.includes(extension)
  ) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block"; // Afficher la prévisualisation de l'image
      document.querySelector(".add-photo-button-in-card").style.display =
        "none";
    };
    reader.readAsDataURL(file);
  } else {
    alert("Erreur lors du chargement de l'image");
  }
});

//methodes pour ajouter les options dynamiquements

const categoriesSelect = () => {
  let option = document.createElement("option");
  selectedCategory.innerHTML = ""; //On verifie que au depart il n'y a pas d'options
  selectedCategory.appendChild(option);
  const categoriesWithoutTous = allCategories.filter(
    (category) => category.id !== "0"
  );
  categoriesWithoutTous.forEach((cat) => {
    let option = document.createElement("option");
    option.value = cat.name;
    option.innerHTML = cat.name;
    option.id = cat.id;
    selectedCategory.appendChild(option);
  });
};

// Appeler les fonctions au chargement de la page
checkLoginStatus();
getCategories();
getWorks();
