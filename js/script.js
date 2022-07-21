
// Activation du mode strict

"use strict";

// Récupération des données de l'API du serveur dans le tableau value

fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    let ptInsert = document.getElementById("items");  // Zone d'insertion du HTML
    for( const pt of value) {                         // Génération du code HTML à insérer
      let newArticle = document.createElement("article");
      let newImg= document.createElement("img");
      newImg.setAttribute("src",`${pt.imageUrl}`);
      newImg.setAttribute("alt",`${pt.altTxt}`);
      let newH3= document.createElement("h3");
      newH3.setAttribute("class","productName");
      newH3.textContent = pt.name;
      let newP= document.createElement("p");
      newP.setAttribute("class","productDescription");
      newP.textContent = pt.description;

      newArticle.appendChild(newImg);
      newArticle.appendChild(newH3);
      newArticle.appendChild(newP);

      let newA = document.createElement("a");
      newA.setAttribute("href",`./product.html?id=${pt._id}`);
      newA.appendChild(newArticle);
      ptInsert.appendChild(newA);
      console.log(ptInsert);
    }
  })
  .catch(function(err) {
      console.log(err);
      alert("Le serveur est indisponible pour le moment.\nVeuillez réessayer ultérieurement.")

  });
