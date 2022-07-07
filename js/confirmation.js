
// activation du mode strict

"use strict";

// Code pour la page Confirmation

let url = new URL(window.location.href);
let order_number = url.searchParams.get("id");

document.getElementById("orderId").innerHTML = order_number;
localStorage.clear();		// suppression du contenu du local store
