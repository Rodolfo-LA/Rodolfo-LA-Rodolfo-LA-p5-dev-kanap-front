
// Variables globales

var tb = new Array();


// Récupération des données de l'API du serveur dans le tableau value

fetch("http://192.168.1.200:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
  for (var z=0;z<value.length;z++)  // Copie des éléments du tableau dans la variable globale tb
    tb[z] = value[z];

  var txt = '';
    for (var z=0;z<tb.length;z++) { // Génération du code HTML
      txt+='<a href=\"./product.html?id=' + tb[z]._id + '\"><article><img src=\"'+ tb[z].imageUrl + '\" alt=\"' + tb[z].altTxt +'\"><h3 class=\"productName\">\"' + tb[z].name + '\"</h3><p class=\"productDescription\">' + tb[z].description + '</p></article></a>'
    }
    document.getElementById("items").innerHTML = txt;  // Insertion du code HTML
  })
  .catch(function(err) {
    // Affichage d'un message d'erreur
      console.log("! Le serveur est indisponible !");
  });
