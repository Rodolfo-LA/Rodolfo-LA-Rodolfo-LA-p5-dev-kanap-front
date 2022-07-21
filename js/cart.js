

// Activation du mode strict

"use strict";

// Code pour la gestion du panier

let savPrice = [];     // Tableau pour sauvegarde des prix du panier

fetch("http://localhost:3000/api/products")
  .then(function(res) {
  	if (res.ok) {
  		return res.json();
  	}
  })
  .then(function(value) {
    let panier=JSON.parse(localStorage.getItem("panier"));
    if (panier == null || panier.length == 0){
      alert("Le panier est vide !\nVous devez sélectionner au moins un article");
      window.location.href = `./index.html`;     // Renvoi vers la page d'accueil
      return;
    }

    panier.sort(function (a, b) {             // Tri du panier par id pour regrouper les modèles identiques
      if (a.productId < b.productId) {
         return -1;
       } else {
         return 1;
       };
    });
    localStorage.setItem("panier",JSON.stringify(panier));  // mise à jour du panier

    let ptInsert = document.getElementById("cart__items");
    for (const ptPan of panier) {          // Préparation pour l'insertion du code HTML
    	for ( const ptVal of value) {
    		if (ptPan.productId == ptVal._id) {
          savPrice.push(ptVal.price);

          //  <article class="cart__item" data-id="${ptVal._id}" data-color="${ptPan.productCol}">

          let newArticle = document.createElement("article");
              newArticle.setAttribute("class","cart__item");
              newArticle.setAttribute("data-id",`${ptVal._id}`);
              newArticle.setAttribute("data-color",`${ptPan.productCol}`);

          let newDivcii = document.createElement("div");      //  <div class="cart__item__img">
          newDivcii.setAttribute("class","cart__item__img");

          let newImg= document.createElement("img");          //  <img src="${ptVal.imageUrl}" alt="${ptVal.altTxt}">
          newImg.setAttribute("src",`${ptVal.imageUrl}`);
          newImg.setAttribute("alt",`${ptVal.altTxt}`);
          newDivcii.appendChild(newImg);
          newArticle.appendChild(newDivcii);

          //  <div class="cart__item__content">

          let newDivcic = document.createElement("div");
          newDivcic.setAttribute("class","cart__item__content");

          //  <div class="cart__item__content__description">

          let newDivcicd = document.createElement("div");
          newDivcicd.setAttribute("class","cart__item__content__description");

          let newH2= document.createElement("h2");
          newH2.textContent = `${ptVal.name}`;          //  <h2>${ptVal.name}</h2>
          let newPprod= document.createElement("p");
          newPprod.textContent = `${ptPan.productCol}`; //  <p>${ptPan.productCol}</p>
          let newPprice= document.createElement("p");
          newPprice.textContent = `${ptVal.price} €`;   //  <p>${ptVal.price} €</p>
          newDivcicd.appendChild(newH2);
          newDivcicd.appendChild(newPprod);
          newDivcicd.appendChild(newPprice);
          newDivcic.appendChild(newDivcicd);

          newArticle.appendChild(newDivcic);

          let newDivcics = document.createElement("div");   //<div class="cart__item__content__settings">
          newDivcics.setAttribute("class","cart__item__content__settings");

          let newDivcicsq = document.createElement("div");  // <div class="cart__item__content__settings__quantity">
          newDivcicsq.setAttribute("class","cart__item__content__settings__quantity");

          let newPqte = document.createElement("p");
          newPqte.textContent = "Qté : ";                 //  <p>Qté : </p>

          //<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${ptPan.productQty}">

          let newInput= document.createElement("input");
          newInput.setAttribute("type","number");
          newInput.setAttribute("class","itemQuantity");
          newInput.setAttribute("name","itemQuantity");
          newInput.setAttribute("min","1");
          newInput.setAttribute("max","100");
          newInput.setAttribute("value",`${ptPan.productQty}`);

          newDivcicsq.appendChild(newPqte);
          newDivcicsq.appendChild(newInput);
          newDivcics.appendChild(newDivcicsq);

          let newDivcicsd = document.createElement("div");   // <div class="cart__item__content__settings__delete">
          newDivcicsd.setAttribute("class","cart__item__content__settings__delete");
          let newPsup = document.createElement("p");        //  <p class="deleteItem">Supprimer</p>
          newPsup.setAttribute("class","deleteItem");
          newPsup.textContent = "Supprimer";
          newDivcicsd.appendChild(newPsup);

          newDivcics.appendChild(newDivcicsd);
          newDivcic.appendChild(newDivcics);

          ptInsert.appendChild(newArticle);       // Insertion du code HTML
          break;
        }
      }
    }
    updateTotArticlePanier();

    let tabElem = document.getElementsByClassName("itemQuantity");     // Ajout de fonctions pour les évenements modifier la quantité

    for (const pt of tabElem) {
      pt.addEventListener('change', function () {
        console.log(this.closest('article').dataset.id + " ----- "+this.value);
        updateProduct(this.closest('article').dataset.id,this.closest('article').dataset.color,parseInt(this.value,10));
      })
    }

    tabElem = document.getElementsByClassName("deleteItem");         // Ajout de fonctions pour les évenements suprimer un article

    for (const pt of tabElem) {
      pt.addEventListener('click', function () {
        console.log(this.closest('article').dataset.id + " supprimé");
        delProduct(this.closest('article').dataset.id,this.closest('article').dataset.color,this.closest('article'));
      })
    }

  })
  .catch(function(err) {
      console.log(err);
      alert("Le serveur ne répond pas,\nveuillez réessayer ultérieurement.");
      //window.location.href = `./index.html`;     // renvoi vers la page d'accueil
  });

// Assigne la fonction au clic sur le bouton "Commander"

document.getElementById("order").addEventListener("click",function(evt) {

  evt.preventDefault();
  controlInputUser();
});

// Mise à jour du produit dans le localStore

// idUpdate    : id du produit a modifier
// idColor     : couleur du produit à modifier
// quantitySel : nouvelle quantité mise à jour

function updateProduct(idUpdate,idColor,quantitySel) {

  let panier=JSON.parse(localStorage.getItem("panier"));
  for (const pt of panier) {
    if (pt.productId == idUpdate && pt.productCol == idColor) {
      pt.productQty=parseInt(quantitySel,10);
      break;
    }
  }
  localStorage.setItem("panier",JSON.stringify(panier));
  updateTotArticlePanier();
}

// Mise à jour du nombre d'article du panier et calcule le total du panier

function updateTotArticlePanier() {

  let totalArticle = 0;
  let totalPanier = 0;
  let idx = 0;

  let panier=JSON.parse(localStorage.getItem("panier"));
  for (const pt of panier) {
    totalArticle+=parseInt(pt.productQty,10);
    totalPanier+=(savPrice[idx++] * pt.productQty);        // calcul du panier = somme des ( prix x quantité par élément)
  }
  let ptTa = document.getElementById("totalQuantity");
  ptTa.textContent = totalArticle;                        // Insertion du code :  Total article
  let ptTp = document.getElementById("totalPrice");
  ptTp.textContent = totalPanier;                         // Insertion du code  : Prix total du panier
}

// Supprime le produit sélectionné du panier

// idSelect    : id du produit à supprimer
// idHtml      : pointe l'article à supprimer dans le HTML

function delProduct(idSelect,idColor,idHtml){

  let panier=JSON.parse(localStorage.getItem("panier"));
  let idx = 0;
  for (const pt of panier) {
    if (pt.productId == idSelect && pt.productCol == idColor) {
      panier.splice(idx,1);
      savPrice.splice(idx,1);
      localStorage.setItem("panier",JSON.stringify(panier));
      updateTotArticlePanier();
      break;
    }
    idx++;
  }
  idHtml.remove();   // Suppresion de l'article concerné dans le HTML
}

// Contrôle la saisie de l'utilisateur (si OK envoi la requete sur l'API)

function controlInputUser() {

  let panier=JSON.parse(localStorage.getItem("panier"));
  if(panier == null || panier.length == 0) {                                          // Contrôle si le panier est vide
    alert("Le panier est vide, il faut ajouter un article au moins\navant de commander !");
    return;
  }

  const tabReg = [ /^([a-zA-Z]|[à-ú]|[À-Ú])+$/,    // Tableau contenant les expressions régulières
                    /^([a-zA-Z\s-]|[à-ú]|[À-Ú])+$/,
                    /^([a-zA-Z0-9\s,-]|[à-ú]|[À-Ú])+$/,
                    /^([a-zA-Z\s-]|[à-ú]|[À-Ú])+$/,
                    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
                  ];
  const tabBase = ["firstName","lastName","address","city","email"];
  const tabErr  = ["firstNameErrorMsg","lastNameErrorMsg","addressErrorMsg","cityErrorMsg","emailErrorMsg"];
  let tabGet = [];

  let idx = 0;
  let errorInput = false;

  for(const pt of tabBase) {
    tabGet.push(document.getElementById(pt).value);
    let regOk= new RegExp(tabReg[idx]);
    if (!regOk.test(tabGet[idx])) {

      let ptTaberr = document.getElementById(tabErr[idx]);
      ptTaberr.textContent = "Veuillez corriger votre saisie";
      errorInput = true;
    }
    else {
      let ptTaberr = document.getElementById(tabErr[idx]);
      ptTaberr.textContent = "";
    }
    idx++;
  }
  if (errorInput) {                                          // Si une des entrées du client est erroné
    alert("Veuillez modifier la ou les saisies érronées !");
    return false;
  }

  let contact = {                       // Préparation des données pour la requête
      firstName: tabGet[0],
      lastName: tabGet[1],
      address: tabGet[2],
      city: tabGet[3],
      email: tabGet[4]
  };

  let products = [];
  for (const pt of panier) {                                // Récupère tous les id du panier dans l'array products
    products.push(pt.productId);
  }

  sendInfos(JSON.stringify({contact,products}));
}

// Envoi la requête sur l'API et attend en retour le numéro de commande

// requette : données émise pour la requete POST sur l'API l'object contact & le tableau des ID produit

function sendInfos(requete) {

  fetch("http://localhost:3000/api/products/order", {
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
      window.location.href = `./confirmation.html?id=${value.orderId}`;     // Renvoi vers la page confirmation
    })
    .catch((err) => {
      console.log(err);
      alert("Le serveur ne répond pas,\nveuillez réessayer ultérieurement.");
  });
}
