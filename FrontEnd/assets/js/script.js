// variables globals

const galleryContainer = document.querySelector(".gallery");
const categoriesContainer = document.getElementById("categories");

const API = "http://localhost:5678/api/works";
let allWorks = [];
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

const displayWorks = (works) => {
  galleryContainer.innerHTML = ""; // Effacer le contenu actuel de la galerie
  works.forEach((work) => {
    const figureW = figureWork(work);
    galleryContainer?.appendChild(figureW);
  });
};

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

    // Créer le bouton "Tous"
    const allButton = document.createElement("button");
    allButton.classList.add("buttonShape");
    allButton.textContent = "Tous";
    allButton.setAttribute("categoryId", "0");

    categoriesContainer?.appendChild(allButton);

    // Créer les boutons pour les 3 premières catégories
    dataCategories.slice(0, 3).forEach((category) => {
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
        console.log("tout les works sont", allWorks);
        displayWorks(allWorks); // Afficher tous les works si "Tous" est cliqué
      }
    });
  });
};

getCategories();
getWorks();
