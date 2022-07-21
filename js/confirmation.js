
// Activation du mode strict

"use strict";

// Code pour la page Confirmation

let url = new URL(window.location.href);
let orderNumber = url.searchParams.get("id");

let ptOrder = document.getElementById("orderId");
ptOrder.textContent = orderNumber;
localStorage.clear();		// Suppression du contenu du localStorage
