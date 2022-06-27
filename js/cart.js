
// activation du mode strict

"use strict";

// code pour la gestion du panier

fetch("http://192.168.1.200:3000/api/products")
  .then(function(res) {
  	if (res.ok) {
  		return res.json();
  	}
  })
  .then(function(value) {
    let txt = ``;
    for (let i = 0; i < localStorage.length; i++) {

    	let panLinea = localStorage.getItem("panier" + i);
    	let panJson = JSON.parse(panLinea);

    	for ( const pt of value) {
    		if (panJson.product_id == pt._id) {
          
          txt+=`<article class="cart__item" data-id="${pt._id}" data-color="${panJson.product_col}">
                  <div class="cart__item__img">
                    <img src="${pt.imageUrl}" alt="${pt.altTxt}">
                  </div>
                  <div class="cart__item__content">
                    <div class="cart__item__content__description">
                      <h2>${pt.name}</h2>
                      <p>${panJson.product_col}</p>
                      <p>${pt.price} €</p>
                    </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${panJson.product_qty}">
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
    document.getElementById("totalPrice").innerHTML = update_tot_panier();  // Insertion du code prix total du panier

    let tab_elem = document.getElementsByClassName("itemQuantity");

    for (const pt of tab_elem) {
      pt.addEventListener('change', function () {
        console.log(this.closest('article').dataset.id + " ----- "+this.value);
        update_product(this.closest('article').dataset.id, parseInt(this.value,10));

      })
    }
  })
  .catch(function(err) {
      // Affichage d'un message d'erreur
      console.log("! Le serveur est indisponible !");
  });

// mise a jour du produit dans le localStore

// id_update : id du prduit à modifié
// quantity_sel : nouvelle quantité à mettre à jour

function update_product(id_update, quantity_sel ) {

  let idx_lstore;       // position du produit dans le LocalStore
  let lectJson;

  for (let i = 0; i < localStorage.length; i++) {  // recherche d'un produit identique dans le localstorage
    lectJson = JSON.parse(localStorage.getItem("panier"+ i));
    if (lectJson.product_id == id_update) {
      lectJson.product_qty = quantity_sel;
      localStorage.removeItem("panier"+ i);
      idx_lstore = i;
      break;
    }
  }
  localStorage.setItem("panier"+idx_lstore,JSON.stringify(lectJson));
  update_tot_panier();
}

// calcul et mise à jour de la valeur du panier

function update_tot_panier() {

  let total_panier = 0;

  for (let i = 0; i < localStorage.length; i++) {

    let panLinea = localStorage.getItem("panier" + i);
    let panJson = JSON.parse(panLinea);

    total_panier+=(panJson.product_price * panJson.product_qty); // calcul du panier = somme des ( prix x quantité par élément)
  }
  document.getElementById("totalPrice").innerHTML = total_panier;  // Insertion du code prix total du panier
  return total_panier;
}