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
  } catch (error) {
    console.log(error);
  }
};

getCategories();
