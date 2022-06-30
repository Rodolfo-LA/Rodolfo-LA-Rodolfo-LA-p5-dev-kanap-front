
// activation du mode strict

"use strict";

// Code pour la page Confirmation

/**
 *
 * Expects request to contain:
 * contact: {
 *   firstName: string,
 *   lastName: string,
 *   address: string,
 *   city: string,
 *   email: string
 * }
 * products: [string] <-- array of product _id
 *
 */

// variable pour essai du POST sur l'API

let contact = {
	 	firstName: "coco",
	 	lastName: "toto",
	 	address: "7 av du lion",
	 	city: "Uzein",
	 	email: "chezmoi@neuf.fr"
};

let	products = ["055743915a544fde83cfdfc904935ee7","034707184e8e4eefb46400b5a3774b5f"];

send_infos();

// fin de variable d'essai

// recupère les données du localStore pour envoi 

 function get_infos() {

 }

 // envoi la requête sur l'API et attend en retour le numero de commande

function send_infos() {
  fetch("http://192.168.1.200:3000/api/products/order", {
    method: "POST",
    headers: {'Content-Type': 'application/json',},
    body: JSON.stringify({contact,products}),
  })
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(value) {
      display_order(value.orderId);
  		console.log(value.orderId);
    })
    .catch((error) => {
      alert("Le serveur repond : ", error);
  });
}

// insere le code HTML pour afficher le numéro de Commande.

 function display_order(order_number) {

 	document.getElementById("orderId").innerHTML = order_number;
 }