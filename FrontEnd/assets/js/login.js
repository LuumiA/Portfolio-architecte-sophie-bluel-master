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
    console.log("Le body est", JSON.stringify(email, password));
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("auth", JSON.stringify(data));
      const auth = JSON.parse(localStorage.getItem("auth"));
      if (auth && auth.token) {
        window.location = "index.html";
      } else {
        messageError.style.display = "flex";
      }
    } else {
      messageError.style.display = "flex";
    }
  } catch (error) {
    console.error("Il y'as eu une erreur au niveau de la conexion", error);
    messageError.style.display = "flex";
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
