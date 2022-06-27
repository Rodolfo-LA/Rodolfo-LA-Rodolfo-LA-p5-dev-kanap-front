
// activation du mode strict

"use strict";

// Code pour la page Produit

let url_api_canape = "http://192.168.1.200:3000/api/products/";
let url_courante = window.location.href;
let url = new URL(url_courante);
let id_canape = url.searchParams.get("id");

url_api_canape+=id_canape;

let price_sel;        // prix unitaire du canapé selectionné

// Récupération des données de l'API du serveur du produit selectionné avec l'id de la page

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

    txt = ``;
    for (const pt of value.colors) {
      txt+=`<option value=\" ${pt} \"> ${pt} </option>`;                   // insertion poue le choix des couleurs disponibles
    }
    document.getElementById("colors").innerHTML = txt;                     // Insertion du code HTML choix des colors disponibles
  })
  .catch(function(err) {
    // Affichage d'un message d'erreur
    console.log("! Le serveur est indisponible !");
  });

// Sauvegarde dans le LocalStore les infos du produit selectionné

let un_clic = false;  // un seul appui sur le bouton "Ajoute au panier" autorisé 

function save_product() {

  let color_sel;        // récupère la couleur du canapé selectionné
  let quantity_sel;     // récupère la quantité du canapé selectionné
  let idx_lstore;       // position du produit dans le LocaStore
  let panierJson;       // valeur du produit dans le localStore

  if (un_clic == false) {    // teste si le bouton à été déjà appuyé
    un_clic = true;
    color_sel = document.getElementById("colors").value;
    quantity_sel = document.getElementById("quantity").value;
    idx_lstore = localStorage.length;
    panierJson = {
      product_id : id_canape,
      product_qty : quantity_sel,
      product_col : color_sel,
      product_price : price_sel
    }

    for (let i = 0; i < idx_lstore; i++) {  // recherche d'un produit identique dans le localstorage
      let lectJson = JSON.parse(localStorage.getItem("panier"+ i));
      if (lectJson.product_id == id_canape && lectJson.product_col == color_sel) {
        panierJson.product_qty = parseInt(panierJson.product_qty,10) + parseInt(lectJson.product_qty,10);
        localStorage.removeItem("panier"+ i);
        idx_lstore = i;
        break;
      }
    }
    localStorage.setItem("panier"+idx_lstore,JSON.stringify(panierJson));
  }
}

// assigne la fonction au clic sur le bouton "Ajoute au panier"

document.getElementById('addToCart').onclick = save_product;
