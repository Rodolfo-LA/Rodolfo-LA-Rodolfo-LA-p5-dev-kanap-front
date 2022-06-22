



// code pour la gestion du panier


var tb = new Array();


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
var total_panier = 0;

for (var i = 0; i < localStorage.length; i++) {

	var pt_panier = "panier" + i;
	var panLinea = localStorage.getItem(pt_panier);
	var panJson = JSON.parse(panLinea);

	for (var v = 0; v < value.length; v++) {
		if (panJson.product_Id == value[v]._id) {

			total_panier+=(value[v].price * panJson.product_Qte);	// calcul du panier = somme des ( prix x quantité par élément)


			  	/*	'<article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
            <div class="cart__item__img">
              <img src="../images/product01.jpg" alt="Photographie d'un canapé">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>Nom du produit</h2>
                <p>Vert</p>
                <p>42,00 €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>'
          */

          txt+='<article class=\"cart__item\" data-id=' 
          + value[v]._id 
          + '\" data-color=\"'
          + panJson.product_Coul
          + '\"><div class="cart__item__img"><img src=\"' 
          + value[v].imageUrl 
          +'\" alt=\"' 
          + value[v].altTxt
          + '\"></div>'
          + '</article>';
          break;
      	}
  	}
}
document.getElementById("cart__items").innerHTML = txt;  // Insertion du code HTML
document.getElementById("totalPrice").innerHTML = total_panier;  // Insertion du code prix total du panier
})
.catch(function(err) {
    // Affichage d'un message d'erreur
    console.log("! Le serveur est indisponible !");
});







