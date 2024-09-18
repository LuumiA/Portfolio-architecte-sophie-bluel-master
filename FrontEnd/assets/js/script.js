// Code JavaScript existant
const galleryContainer = document.querySelector(".gallery");
const categoriesContainer = document.getElementById("categories");
const loginLink = document.getElementById("login-link");
const mainModal = document.getElementById("modal");

//Selectionne tous les boutons close
const closeModalButtons = document.querySelectorAll(".modal .close");

const editLink = document.getElementById("edit-link");
const editIcon = document.querySelector(".edit-section i");
const allEdit = document.querySelector(".edit-section");
const selectedCategory = document.querySelector("#category");
const fileInput = document.getElementById("file-input");
const imagePreview = document.querySelector("#imagePreview");

const projectsContainer = document.getElementById("projects-container");
const addPhotoModal = document.querySelector("#add-photo-modal");
const backArrow = document.querySelector(".back-arrow");
const openAddPhotoButton = document.querySelector(".add-photo-button");
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");

const addFile = document.querySelector(".add-photo-button-in-card");
const iconPreview = document.querySelector(".photo-icon");
const formP = document.querySelector("form p");

const validatePhotoButton = document.querySelector(
  "#add-photo-modal .validate-button"
);
const admin = document.querySelector(".admin");

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
    loginLink.textContent = "logout";
    loginLink.href = "#";
    loginLink.classList.add("logout-link");
    loginLink.removeEventListener("click", logoutHandler);
    loginLink.addEventListener("click", logoutHandler);

    // Afficher la bannière édition si l'utilisateur est connecté
    admin.innerHTML =
      '<button class="editMode"> <i class="fas fa-pen-to-square"></i> Mode édition</button>';
    admin.classList.add("blackLineEdition");
    // Masquer les catégories si l'utilisateur est connecté
    if (categoriesContainer) {
      categoriesContainer.style.display = "none";
    }
    // Afficher le lien "modifier" et l'icône si l'utilisateur est connecté
    if (allEdit) {
      allEdit.style.display = "flex";
    }
  } else {
    // Utilisateur non connecté
    loginLink.textContent = "login";
    loginLink.href = "login.html";
    loginLink.classList.remove("logout-link");
    admin.style.display = "none";

    // Masquer le lien "modifier" et l'icône si l'utilisateur n'est pas connecté
    if (allEdit) {
      allEdit.style.display = "none";
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
  projectsContainer.innerHTML = ""; // Vider le contenu actuel

  console.log("allWork est ", allWorks);

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
  if (!confirmation) return;
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
  //Fermer la modal principal
  mainModal.style.display = "none";
};

// Fonction pour ouvrir la modale principale
const openModal = () => {
  if (mainModal) {
    mainModal.style.display = "flex";
    displayProjectsInModal(); // Afficher les projets dans la modal
  }
};

//  Fonction pour fermer la modale spécifique
const closeModal = (modal) => {
  modal.style.display = "none";
};

// Vérifiez si les éléments sont trouvés
console.log("editLink:", editLink);
console.log("closeModalButtons:", closeModalButtons);
console.log("modal:", mainModal);

// Événement pour ouvrir la modal lorsqu'on clique sur le lien modifier
allEdit?.addEventListener("click", (event) => {
  event.preventDefault(); // Empêche le lien de naviguer
  openModal();
});

// Execute l'événement de fermeture à tous les boutons "close"
closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal"); // Sélectionner la modale parente du bouton
    if (modal === mainModal) {
      closeModal(mainModal);
    } else if (modal === addPhotoModal) {
      closeModal(addPhotoModal);
    }
  });
});

// Fermer les modales en cliquant en dehors de la zone de contenu
window.addEventListener("click", (event) => {
  if (event.target === mainModal) {
    closeModal(mainModal);
  } else if (event.target === addPhotoModal) {
    closeModal(addPhotoModal);
  }
});

// Fonction pour ouvrir la modal d'ajout de photo
const openAddPhotoModal = () => {
  addPhotoModal.style.display = "flex";
  mainModal.style.display = "none"; // Masquer la modal principale
  categoriesSelect();
  checkFormValidity();
  resetInput();
};

// Fonction pour fermer la modal d'ajout de photo
const closeAddPhotoModal = () => {
  addPhotoModal.style.display = "none";
};

// Fonction pour revenir à la modal principale
const backToPreviousModal = () => {
  closeAddPhotoModal();
  mainModal.style.display = "flex"; // Afficher la modal principale
};

// Événements pour ouvrir et fermer la modal d'ajout de photo
openAddPhotoButton?.addEventListener("click", openAddPhotoModal);
backArrow.addEventListener("click", backToPreviousModal);

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
      addFile.style.display = "none";
      iconPreview.style.display = "none";
      formP.style.display = "none";
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

// Fonction pour envoyer les données de l'image au serveur
const submitPhoto = async (event) => {
  event.preventDefault(); // Empêche le comportement par défaut du bouton (soumission du formulaire)

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Vous devez être connecté pour ajouter une photo.");
    return;
  }

  // Vérifier si les éléments existent
  if (!titleInput || !categorySelect || !fileInput || !imagePreview) {
    console.error("Un ou plusieurs éléments requis sont manquants.");
    return;
  }

  const title = titleInput.value;
  const categoryId = categorySelect.selectedOptions[0]?.id;
  const file = fileInput.files[0];

  if (!title || !categoryId || !file) {
    alert("Veuillez remplir tous les champs et sélectionner une image.");
    return;
  }

  const confirmation = confirm(`Etes vous sur de vouloir ajouter ${title} ?`);
  if (!confirmation) return;

  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", categoryId);
  formData.append("image", file);

  try {
    const response = await fetch(API, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de l'ajout de la photo: ${response.status}`);
    }

    // Rafraîchir les œuvres affichées
    //Vide la galerry pour eviter les doublons
    galleryContainer.innerHTML = "";
    await getWorks();
    displayProjectsInModal();
    addPhotoModal.style.display = "none";
  } catch (error) {
    console.error("Erreur lors de l'ajout de la photo:", error);
  }
};

const resetInput = () => {
  // Réinitialiser la prévisualisation et les champs du formulaire
  imagePreview.src = "";
  imagePreview.style.display = "none";
  fileInput.value = "";
  titleInput.value = "";
  categorySelect.value = "";
  addFile.style.display = "flex";
  iconPreview.style.display = "block";
  formP.style.display = "block";
  validatePhotoButton.disabled = true;
};

// Fonction pour vérifier la validité du formulaire(désactiver et griser le bouton de validation si le formulaire n'est pas valide)
const checkFormValidity = () => {
  const isFileSelected = fileInput.files.length > 0; // Vérifier si un fichier est sélectionné
  const isTitleFilled = titleInput.value.trim() !== ""; // Vérifier si le titre est rempli
  const isCategorySelected = categorySelect.value !== ""; // Vérifier si une catégorie est sélectionnée

  // Activer le bouton de validation si toutes les conditions sont remplies
  if (isFileSelected && isTitleFilled && isCategorySelected) {
    validatePhotoButton.disabled = false;
  } else {
    validatePhotoButton.disabled = true;
  }
};

// Ajouter des écouteurs d'événements pour vérifier la validité du formulaire lorsque les champs sont modifiés
fileInput.addEventListener("change", checkFormValidity);
titleInput.addEventListener("input", checkFormValidity); //input car on veut que l'utilisateur tape quelque chose
categorySelect.addEventListener("change", checkFormValidity); //On utilise un changement car on veut que l'utilisateur choisisse une catégorie

document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  getCategories();
  getWorks();
  displayProjectsInModal();

  // Sélectionner le bouton "Valider" dans la modal d'ajout de photo

  if (validatePhotoButton) {
    validatePhotoButton.addEventListener("click", submitPhoto);
  } else {
    console.error("Le bouton 'Valider' est introuvable.");
  }
});
