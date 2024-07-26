// variables globals

const galleryContainer = document.querySelector(".gallery");

const API = "http://localhost:5678/api/works";
let allWorks = [];
const getWorks = async () => {
  try {
    const result = await fetch(`${API}`);
    const data = await result.json();
    allWorks = data;
    console.log(data);
    for (let work of allWorks) {
      const figureW = figureWork(work);
      galleryContainer?.appendChild(figureW);
    }
  } catch (error) {
    console.log(error);
  }
};

getWorks();

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
const getCategories = async () => {
  try {
    const resultCategories = await fetch(`${API_CATEGORIES}`);
    const dataCategories = await resultCategories.json();
    console.log(dataCategories);
    // Insère les boutons dans le DOM
    const categoriesContainer = document.getElementById("categories");

    // Créer le bouton "Tous"
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.id = "all";
    categoriesContainer?.appendChild(allButton);

    // Créer les boutons pour les 3 premières catégories
    dataCategories.slice(0, 3).forEach((category) => {
      const categoryButton = document.createElement("button");
      categoryButton.textContent = category.name; // Assume que chaque catégorie a un champ 'name'
      categoryButton.id = category.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""); // Remplace les espaces par des tirets et met en minuscule
      categoriesContainer?.appendChild(categoryButton);
    });

    // Ajouter les écouteurs d'événements après l'insertion des boutons
    const buttons = document.querySelectorAll("#categories button");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        // Retirer la classe "active" de tous les boutons
        buttons.forEach((btn) => btn.classList.remove("active"));
        // Ajouter la classe "active" au bouton cliqué
        button.classList.add("active");
      });
    });
  } catch (error) {
    console.log(error);
  }
};

getCategories();
