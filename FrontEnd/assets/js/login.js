//Declaration des variables
const loginURL = "http://localhost:5678/api/users/login";
const messageError = document.querySelector("#msg-error");
const form = document.querySelector(".login-container form");

//Gestion de connexion avec le formulaire

const loginUser = async (email, password) => {
  try {
    const response = await fetch(loginURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error("La reponse du reseau n'est pas ok");
    }
    const data = await response.json();
    localStorage.setItem("token", JSON.stringify(data.token));
    if (JSON.parse(localStorage.getItem("token"))) {
      window.location = "index.html";
    } else {
      messageError.style.display = "flex";
      setTimeout(() => {
        messageError.style.display = "none";
      }, 3000);
    }
  } catch (error) {
    console.error("Il y'as eu une erreur au niveau de la conexion", error);
    messageError.style.display = "flex";
    setTimeout(() => {
      messageError.style.display = "none";
    }, 3000);
  }
};

form.addEventListener("submit", (event) => {
  // Empêche la soumission par défaut du formulaire
  event.preventDefault();
  //Validation du formulaire
  if (form.email.value === "" || form.password.value === "") {
    messageError.style.display = "flex";
    return;
  } else {
    messageError.style.display = "none";
  }
  //Appele de la fonction loginUser

  loginUser(form.email.value, form.password.value);
});
