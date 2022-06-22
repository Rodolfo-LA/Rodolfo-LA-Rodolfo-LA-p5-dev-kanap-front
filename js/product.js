

// Code pour la page Produit


var url_API_canape = "http://192.168.1.200:3000/api/products/";
var url_courante = window.location.href;

var url = new URL(url_courante);
var id_canape = url.searchParams.get("id");

url_API_canape+=id_canape;

// Récupération des données de l'API du serveur du produit selectionné avec l'id de la page

fetch(url_API_canape)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {

    var txt='<img src=\"' + value.imageUrl + '\" alt=\"' + value.altTxt + '\">';
    const contents = document.getElementsByClassName('item__img');

    contents[0].innerHTML = txt;  // Insertion du code HTML url de l'image

    document.getElementById("title").innerHTML = value.name;  // Insertion du code HTML titre
    document.getElementById("price").innerHTML = value.price;  // Insertion du code HTML prix
    document.getElementById("description").innerHTML = value.description;  // Insertion du code HTML descritif

    txt = '';
    for (var i = 0; i < value.colors.length; i++) {
      txt+='<option value=\"' + value.colors[i] + '\">' + value.colors[i] + '</option>'
    }

    document.getElementById("colors").innerHTML = txt;  // Insertion du code HTML choix des couleurs disponibles    


})
  .catch(function(err) {
    // Affichage d'un message d'erreur
      console.log("! Le serveur est indisponible !");
  });
