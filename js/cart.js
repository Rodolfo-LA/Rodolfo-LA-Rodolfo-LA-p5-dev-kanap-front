


// activation du mode strict

"use strict";

// code pour la gestion du panier

let sav_price = [];     // tableau pour sauvegarde des prix du panier

fetch("http://192.168.1.200:3000/api/products")
  .then(function(res) {
  	if (res.ok) {
  		return res.json();
  	}
  })
  .then(function(value) {
    let txt = ``;
    let panier=JSON.parse(localStorage.getItem("panier"));
    if (panier == null || panier.length == 0){
      alert("Le panier est vide !\nVous devez sélectioner au moins un article");
      window.location.href = `./index.html`;     // renvoi vers la page d'accueil
      return;
    }
    for (const pt_pan of panier) {
    	for ( const pt_val of value) {
    		if (pt_pan.product_id == pt_val._id) {
          sav_price.push(pt_val.price);
          txt+=`<article class="cart__item" data-id="${pt_val._id}" data-color="${pt_pan.product_col}">
                  <div class="cart__item__img">
                    <img src="${pt_val.imageUrl}" alt="${pt_val.altTxt}">
                  </div>
                  <div class="cart__item__content">
                    <div class="cart__item__content__description">
                      <h2>${pt_val.name}</h2>
                      <p>${pt_pan.product_col}</p>
                      <p>${pt_val.price} €</p>
                    </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${pt_pan.product_qty}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </article>`;
          break;
        }
      }
    }
    document.getElementById("cart__items").innerHTML = txt;  // Insertion du code <article> HTML
    update_tot_article_panier();

    let tab_elem = document.getElementsByClassName("itemQuantity");     // Ajout de fonctions pour les évenements modifier la quantité 

    for (const pt of tab_elem) {
      pt.addEventListener('change', function () {
        console.log(this.closest('article').dataset.id + " ----- "+this.value);
        update_product(this.closest('article').dataset.id,parseInt(this.value,10));
      })
    }

    tab_elem = document.getElementsByClassName("deleteItem");         // Ajout de fonctions pour les évenements suprimer un article

    for (const pt of tab_elem) {
      pt.addEventListener('click', function () {
        console.log(this.closest('article').dataset.id + " supprimé");
        del_product(this.closest('article').dataset.id,this.closest('article').dataset.color,this.closest('article')); 
      })
    }

  })
  .catch(function(err) {
      console.log(err);
      alert("Le serveur ne répond pas,\nveuillez réessayer ultérieurement.");
      window.location.href = `./index.html`;     // renvoi vers la page d'accueil
  });

// assigne la fonction au clic sur le bouton "Commander"

document.getElementById("order").addEventListener("click",function(evt) {

  evt.preventDefault();
  control_input_user();
});

// mise a jour du produit dans le localStore

// id_update    : id du produit a modifier
// quantity_sel : nouvelle quantité mise à jour

function update_product(id_update, quantity_sel) {

  let panier=JSON.parse(localStorage.getItem("panier"));
  for (const pt of panier) {
    if (pt.product_id == id_update) {
      pt.product_qty=parseInt(quantity_sel,10);
      break;
    }
  }
  localStorage.setItem("panier",JSON.stringify(panier));
  update_tot_article_panier();
}

// mise à jour du nombre d'article du panier et calcule le total du panier

function update_tot_article_panier() {

  let total_article = 0;
  let total_panier = 0;
  let idx = 0;

  let panier=JSON.parse(localStorage.getItem("panier"));
  for (const pt of panier) {
    total_article+=parseInt(pt.product_qty,10);
    total_panier+=(sav_price[idx++] * pt.product_qty);        // calcul du panier = somme des ( prix x quantité par élément)
  }
  document.getElementById("totalQuantity").innerHTML = total_article;   // Insertion du code :  Total article
  document.getElementById("totalPrice").innerHTML = total_panier;       // Insertion du code  : Prix total du panier
}

// supprime le produit sélectionné du panier

// id_select    : id du produit à supprimer
// id_html      : pointe l'article à supprimer dans le HTML

function del_product(id_select,id_color,id_html){

  let panier=JSON.parse(localStorage.getItem("panier"));
  let idx = 0;
  for (const pt of panier) {
    if (pt.product_id == id_select && pt.product_col == id_color) {
      panier.splice(idx,1);
      sav_price.splice(idx,1);
      localStorage.setItem("panier",JSON.stringify(panier));
      update_tot_article_panier();
      break;
    }
    idx++;
  }
  id_html.remove();   // suppresion de l'article concerné dans le HTML
}

// Contrôle la saisie de l'utilisateur (si OK envoi la requete sur l'API)

function control_input_user() {

  if(localStorage.getItem("panier") == '[]') {                                          // contrôle si le panier est vide
    alert("Le panier est vide, il faut ajouter des articles\navant de commander !");
    return;
  }

  const tab_reg = [ /^([a-zA-Z]|[à-ú]|[À-Ú])+$/,    // tableau contenant les expressions régulières
                    /^([a-zA-Z\s-]|[à-ú]|[À-Ú])+$/,
                    /^([a-zA-Z0-9\s,-]|[à-ú]|[À-Ú])+$/,
                    /^([a-zA-Z\s-]|[à-ú]|[À-Ú])+$/,
                    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
                  ];               
  const tab_base = ["firstName","lastName","address","city","email"];
  const tab_err  = ["firstNameErrorMsg","lastNameErrorMsg","addressErrorMsg","cityErrorMsg","emailErrorMsg"];
  let tab_get = [];

  let idx = 0;
  let error_input = false;

  for(const pt of tab_base) {
    tab_get.push(document.getElementById(pt).value);
    let reg_ok= new RegExp(tab_reg[idx]);
    if (!reg_ok.test(tab_get[idx])) {
      document.getElementById(tab_err[idx]).innerHTML = "Veuillez corriger votre saisie";
      error_input = true;
    }
    else {
      document.getElementById(tab_err[idx]).innerHTML = "";
    }
    idx++;
  }
  if (error_input) {                                          // si une des entrées du client est erroné
    alert("Veuillez modifier la ou les saisies érronées !");
    return false;
  }

  let contact = {                       // préparation des données pour la requête
      firstName: tab_get[0],
      lastName: tab_get[1],
      address: tab_get[2],
      city: tab_get[3],
      email: tab_get[4]
  };

  let products = [];
  let panier=JSON.parse(localStorage.getItem("panier"));
  for (const pt of panier) {                                // récupère tous les id du panier dans l'array products
    products.push(pt.product_id);
  }

  send_infos(JSON.stringify({contact,products}));
}

// envoi la requête sur l'API et attend en retour le numéro de commande

// requette : données émise pour la requete POST sur l'API l'object contact & le tableau des ID produit 

function send_infos(requete) {       // var requete test

  fetch("http://192.168.1.200:3000/api/products/order", {
    method: "POST",
    headers: {'Content-Type': 'application/json',},
    body: requete,
  })
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(value) {
      console.log(value.orderId);
      window.location.href = `./confirmation.html?id=${value.orderId}`;     // renvoi vers la page confirmation
    })
    .catch((err) => {
      console.log(err);
      alert("Le serveur ne répond pas,\nveuillez réessayer ultérieurement.");
  });
}

