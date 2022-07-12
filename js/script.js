
// Activation du mode strict

"use strict";

// Récupération des données de l'API du serveur dans le tableau value

fetch("http://192.168.1.200:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    let txt = ``;
    for( const pt of value) {                            // Génération du code HTML à insérer
      txt+=`<a href="./product.html?id=${pt._id}">
              <article>
                <img src="${pt.imageUrl}" alt="${pt.altTxt}">
                <h3 class="productName">${pt.name}</h3>
                <p class="productDescription">${pt.description}</p>
              </article>
            </a>`;
    }
    document.getElementById("items").innerHTML = txt;  // Insertion du code HTML
    console.log(txt);
  })
  .catch(function(err) {
      console.log(err);
      alert("Le serveur est indisponible pour le moment.\nVeuillez réessayer ultérieurement.")

  });
