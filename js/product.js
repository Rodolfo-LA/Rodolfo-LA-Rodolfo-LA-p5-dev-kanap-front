
// Activation du mode strict

"use strict";

// Code pour la page Produit

let panier = [];

let url_api_canape = "http://192.168.1.200:3000/api/products/";
let url_courante = window.location.href;
let url = new URL(url_courante);
let id_canape = url.searchParams.get("id");

url_api_canape+=id_canape;

let price_sel;        // Prix unitaire du canapé sélectionné

// Récupération des données de l'API du serveur du produit sélectionné avec l'id transmis dans l'URL

fetch(url_api_canape)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    let txt=`<img src=\"${value.imageUrl}\" alt=\"${value.altTxt}\">`;

    const contents = document.getElementsByClassName('item__img');
    contents[0].innerHTML = txt;                                           // Insertion du code HTML url de l'image

    price_sel = value.price; 

    document.getElementById("title").innerHTML = value.name;               // Insertion du code HTML titre
    document.getElementById("price").innerHTML = price_sel;                // Insertion du code HTML prix
    document.getElementById("description").innerHTML = value.description;  // Insertion du code HTML descritif

    txt = `<option value="">--SVP, choisissez une couleur --</option>`;
    for (const pt of value.colors) {
      txt+=`<option value=\" ${pt} \"> ${pt} </option>`;                   // Insertion poue le choix des couleurs disponibles
    }
    document.getElementById("colors").innerHTML = txt;         // Insertion du code HTML choix des couleurs disponibles
  })
  .catch(function(err) {
    console.log(err)
    alert("Le serveur ne répond pas,\nveuillez réessayer ultérieurement.");
  });

// Assigne la fonction au clic sur le bouton "Ajoute au panier"

document.getElementById('addToCart').onclick = save_product;

// Sauvegarde dans le LocalStore les infos du produit sélectionné

function save_product() {

  let color_sel;        // Récupère la couleur du canapé sélectionné
  let quantity_sel;     // Récupère la quantité du canapé sélectionné
  let panierJson;       // Infos du produit dans le localStore

  color_sel = document.getElementById("colors").value;
  quantity_sel = document.getElementById("quantity").value;

  if (quantity_sel<=0) {
    alert("Veuillez modifier le nombre d'article !");
    return;
  }
  if (color_sel=="") {
    alert("Veuillez choisir une couleur pour l'article !");
    return;
  }

  panierJson = {
    product_id : id_canape,
    product_qty : parseInt(quantity_sel,10),
    product_col : color_sel,
  }

  panier=JSON.parse(localStorage.getItem("panier"));

  if (panier !=null) {
    let match = false;              // Recherche de produit identique
    for (const pt of panier) {
      if (pt.product_id == id_canape && pt.product_col == color_sel) {
        pt.product_qty+= parseInt(quantity_sel,10);
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
