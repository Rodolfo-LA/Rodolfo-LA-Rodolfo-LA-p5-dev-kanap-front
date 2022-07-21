
// Activation du mode strict

"use strict";

// Code pour la page Produit

let panier = [];

let urlApicanape = "http://localhost:3000/api/products/";
let urlCourante = window.location.href;
let url = new URL(urlCourante);
let idCanape = url.searchParams.get("id");

urlApicanape+=idCanape;

let priceSel;        // Prix unitaire du canapé sélectionné

// Récupération des données de l'API du serveur du produit sélectionné avec l'id transmis dans l'URL

fetch(urlApicanape)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    let newImg= document.createElement("img");
    newImg.setAttribute("src",`${value.imageUrl}`);
    newImg.setAttribute("alt",`${value.altTxt}`);
    let ptInsert = document.getElementsByClassName('item__img');
    ptInsert[0].appendChild(newImg);        // Insertion du code HTML url de l'image

    priceSel = value.price;

    document.getElementById("title").textContent = value.name;               // Insertion du code HTML titre
    document.getElementById("price").textContent = priceSel;                // Insertion du code HTML prix
    document.getElementById("description").textContent = value.description;  // Insertion du code HTML descritif

    ptInsert = document.getElementById("colors");
    for (const pt of value.colors) {
      let newOption= document.createElement("option");
      newOption.setAttribute("value",`${pt}`);
      newOption.textContent = `${pt}`;
      ptInsert.appendChild(newOption);       // Insertion du code HTML choix des couleurs disponibles
    }
  })
  .catch(function(err) {
    console.log(err)
    alert("Le serveur ne répond pas,\nveuillez réessayer ultérieurement.");
  });

// Assigne la fonction au clic sur le bouton "Ajoute au panier"

document.getElementById('addToCart').onclick = saveProduct;

// Sauvegarde dans le LocalStore les infos du produit sélectionné

function saveProduct() {

  let colorSel;        // Récupère la couleur du canapé sélectionné
  let quantitySel;     // Récupère la quantité du canapé sélectionné
  let panierJson;       // Infos du produit dans le localStore

  colorSel = document.getElementById("colors").value;
  quantitySel = document.getElementById("quantity").value;

  if (quantitySel<=0) {
    alert("Veuillez modifier le nombre d'article !");
    return;
  }
  if (colorSel=="") {
    alert("Veuillez choisir une couleur pour l'article !");
    return;
  }

  panierJson = {
    productId : idCanape,
    productQty : parseInt(quantitySel,10),
    productCol : colorSel,
  }

  panier=JSON.parse(localStorage.getItem("panier"));

  if (panier !=null) {
    let match = false;              // Recherche de produit identique
    for (const pt of panier) {
      if (pt.productId == idCanape && pt.productCol == colorSel) {
        pt.productQty+= parseInt(quantitySel,10);
        match = true;
        break;
      }
    }
    if (!match) {
      panier.push(panierJson);      // Pas de produit identique
    }
  }
  else {
    panier=[];                      // Le panier n'existe pas
    panier.push(panierJson);
  }
  localStorage.setItem("panier",JSON.stringify(panier));
  alert("L'article a bien été ajouté au panier");
}
