

// Code pour la page Produit


var url_API_canape = "http://192.168.1.200:3000/api/products/";
var url_courante = window.location.href;

var url = new URL(url_courante);
var id_canape = url.searchParams.get("id");

url_API_canape+=id_canape;

var tb = new Array();

var un_Clic = false;

// Récupération des données de l'API du serveur du produit selectionné avec l'id de la page

fetch(url_API_canape)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {

    for (var z=0;z<value.length;z++)  // Copie des éléments du tableau dans la variable globale tb
      tb[z] = value[z];

    var txt='<img src=\"' + value.imageUrl + '\" alt=\"' + value.altTxt + '\">';
    const contents = document.getElementsByClassName('item__img');

    contents[0].innerHTML = txt;  // Insertion du code HTML url de l'image

    document.getElementById("title").innerHTML = value.name;  // Insertion du code HTML titre
    document.getElementById("price").innerHTML = value.price;  // Insertion du code HTML prix
    document.getElementById("description").innerHTML = value.description;  // Insertion du code HTML descritif

    txt = '<option value="">--SVP, choisissez une couleur --</option>';
    for (var i = 0; i < value.colors.length; i++) {
      txt+='<option value=\"' + value.colors[i] + '\">' + value.colors[i] + '</option>'
    }

    document.getElementById("colors").innerHTML = txt;  // Insertion du code HTML choix des couleurs disponibles    


})
  .catch(function(err) {
    // Affichage d'un message d'erreur
      console.log("! Le serveur est indisponible !");
  });

// Sauvegarde dans le LocalStore les infos du produit selectionné

function Sauvegarde_Produit() {

  if (un_Clic == false) {    // un seul ajout au panier autorisé
    un_Clic = true;
    var couleur_Sel = document.getElementById("colors").value;
    var quantite_Sel = document.getElementById("quantity").value;
    var nb_Kanap = localStorage.length;
    var panierJson = {
      product_Id : id_canape,
      product_Qte : quantite_Sel,
      product_Coul : couleur_Sel
    }

    for (var i = 0; i < nb_Kanap; i++) {  // recherche d'un produit identique dans le localstorage
      var lectJson = JSON.parse(localStorage.getItem("panier"+ i));
      if (lectJson.product_Id == id_canape && lectJson.product_Coul == couleur_Sel) {
        panierJson.product_Qte = parseInt(panierJson.product_Qte,10) + parseInt(lectJson.product_Qte,10);
        localStorage.removeItem("panier"+ i);
        nb_Kanap = i;
        break;
      }
    }

    localStorage.setItem("panier"+nb_Kanap,JSON.stringify(panierJson));
  }
}

  // assigne la fonction au clic sur le bouton "Ajoute au panier"

  document.getElementById('addToCart').onclick = Sauvegarde_Produit;
