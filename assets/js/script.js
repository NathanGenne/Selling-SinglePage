fetch('assets/data/articles.json')
  .then(response => response.json())
  .then((listArticles) => {
    listArticles.articles.map((articles) => {
    
    let id       = articles.id;
    let title    = articles.title;
    let overview = articles.overview;
    let img_path = articles.img_path;
    let price    = articles.price;
    let age      = articles.age;
    let playTime = articles.playTime;
    let category = articles.category;
    
    let nouvelArticle = `
    <div class="col-md-6 my-3">
      <div class="card orangeBorder">
        <div class="d-flex">
          <div class="col-md-5 d-flex align-items-center">
            <img src="assets/img/${img_path}" class="js-img img-fluid rounded-start" alt="Boite ${title}">
          </div>
          <div class="col-md-7 card-body">
            <p class="card-title fw-bold fs-3">${title}</p>
            <p class="card-text">${overview}</p>
            <div class="row d-flex align-items-end">
              <div class="col">
                <small class="row text-muted">durée : ~${playTime} min</small>
                <small class="row text-muted">age : ${age}+</small>
                <small class="row text-muted">catégorie : ${category}</small>
              </div>
              <div class="col">
                <p class="js-price row mb-3 fs-3 fw-bold d-flex justify-content-center">${price} €</p>
                <a id="${id}" class="row btn orangeBorder js-btn-addToCart me-1" href="#!" role="button">Ajouter au panier</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
    document.getElementById('products').innerHTML += nouvelArticle;
    })

    // Appel des fonctions
    addToCart();
    panier();
});

// Création des variables fullprice et nbItems 
let fullprice      = 0;
let finalprice     = 0;
let nbItems        = 0;
let articlesIdList = [];

// --------------------------------------------------
// Fonction qui ajoute un objet sélectionné au panier
// --------------------------------------------------

function addToCart() {
  // pointe les boutons cibles
  let btnAddToCartList = document.querySelectorAll('.js-btn-addToCart');
  // Pour chaque bouton
  for (btn of btnAddToCartList) {
    btn.onclick = (e) => {
      // Grace à l'objet événement (e), je peux repérer le bouton cliqué (target) et l'id de ce bouton (id).
      // Ensuite, je l'utilise pour pointer les informations à ajouter au panier.
      // racourcis utiles
      let button   = e.target;
      let card = e.target.closest('.card');
      // liste des infos utiles
      let idTarget    = button.id;
      let title       = card.querySelector(`.card-title`).textContent;
      let img_path    = card.querySelector(`.js-img`).src.split("/").pop();
      let price       = parseFloat(card.querySelector(`.js-price`).textContent.split(" ").shift());
      // fullprice : prix des articles aditionnés
      fullprice       = price + fullprice;
      // finalprice : prix des articles aditionnés + frais de port
      finalprice      = fullprice;

      // Addition des frais de port pour moins de 50 € d'achat
      if ( fullprice <= 50 ) { finalprice = fullprice + 10; }

      // génération d'un nouveau cadre d'article
      let articlePanier = `
      <div class="card mb-4 orangeBorder">
          <div class="card-body p-4">

            <div class="row align-items-center">
              <div class="col-md-3">
                <img src="assets/img/${img_path}" class="img-fluid" alt="Boite ${title}">
              </div>
              <div class="col-md-3 d-flex justify-content-center">
                <div>
                  <p class="text-muted mb-4 pb-2">nom</p>
                  <p class="lead fw-normal mb-0">${title}</p>
                </div>
              </div>
              <div class="col-md-2 d-flex justify-content-center">
                <div>
                  <p class="text-muted mb-4 pb-2">Quantité</p>
                  <div class="ItemQuantity">
                    <a class="col btn"><i class="bi bi-dash-square quantity minus"></i></a>
                    <a class="col btn btn-secondary number"id="quantity${idTarget}">1</a>
                    <a class="col btn"><i class="bi bi-plus-square quantity plus"></i></a>
                  </div>
                </div>
              </div>
              <div class="col-md-2 d-flex justify-content-center">
                <div>
                  <p class="text-muted mb-4 pb-2">Prix individuel</p>
                  <p class="price lead fw-normal mb-0">${price} €</p>
                </div>
              </div>
              <div class="col-md-2 d-flex justify-content-center">
                <div>
                  <a class="btn orangeBorder js-btn-delete me-1" href="#!" role="button">X</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Si cet article est déjà dans le panier :
      if (articlesIdList.includes(idTarget)) {
        // Récupèrer un tableau de la quantité de cet article en stock
        let nbItem = articlesIdList.filter(function(e) { return e == idTarget; });
        // Change la quantité d'article dans le panier
        document.getElementById(`quantity${idTarget}`).innerHTML = nbItem.length+1;
      }
      // Sinon : ajoute un nouveau cadre au panier
      else {
        document.getElementById('listArticlesPanier').innerHTML += articlePanier;
      }
      // Ajout de l'id de l'article ajouté pour une future comptabilisation
      articlesIdList.push(idTarget);
      
      // Change le prix total du panier
      document.getElementById('fullprice').innerHTML  = fullprice.toFixed(2) + ' €';

      // Change les frais de ports selon le prix total (fullprice)
      if (fullprice <= 50) {
        document.getElementById('shipment').innerHTML   = '10 €';
      } else {
        document.getElementById('shipment').innerHTML   = 'GRATUIT !';
      }
      // Change le prix à payer
      document.getElementById('payedprice').innerHTML = finalprice.toFixed(2) + ' €';

      nbArticleInCart();

      // Appel des fonctions
      supprPanier(idTarget);
      quantity(idTarget);
    };
  }
}


// --------------------------------------------------
// Affiche / cache le panier
// --------------------------------------------------

function panier() {
  // Pointe les boutons clickables
  let btnCart = document.querySelectorAll('.js-btn-cart');

  // Si un bouton est clické :
  for (btn of btnCart) {
    btn.onclick = (e) => {

    // On   affiche  /    cache     le panier
    document.querySelector(`.panier`).classList.toggle("d-none");
    // On    cache   /   affiche    la liste des produits
    document.getElementById(`products`).classList.toggle("d-none");
    document.getElementById(`title`).classList.toggle("d-none");
    }
  }
}


// ------------------------------------------------------
// Changement de quantité d'un article dans le panier
// ------------------------------------------------------

function quantity(idTarget) {
  // Pointe les boutons clickables
  let btnQuantity = document.querySelectorAll('.quantity');
  // Si un bouton est clické :
  for (btn of btnQuantity) {
    btn.onclick = (e) => {
      // Pointe le plus haut parent
      let card = e.target.closest('.card');
      // Pointe le prix de l'objet
      let price = parseFloat(card.querySelector('.price').innerHTML.split(" ").shift());
      // Indique si on additionne ou soustrait le prix
      let claculus;
      // Si le bouton est un bouton + :
      if (e.target.classList.contains('plus')) {
        card.querySelector('.number').innerHTML = parseFloat(card.querySelector('.number').innerHTML)+1;
        claculus = price;
      }
      // Si le bouton est un bouton - :
      else {
        card.querySelector('.number').innerHTML = parseFloat(card.querySelector('.number').innerHTML)-1;
        claculus = -price;
      }
      // Le prix total des articles additionnés
      let fullpriceTemp = parseFloat(document.getElementById('fullprice').innerHTML.split(" ").shift());
      // Le nouveau prix à payer (hors frais de port) après changement de valeur
      let newPrice = fullpriceTemp+claculus;
      // Le nouveau prix que le consommateur devra payer
      let newFinalPrice;

      // Change le prix total du panier
      document.getElementById('fullprice').innerHTML = newPrice.toFixed(2) + ' €';

      // Change les frais de ports selon le prix total (newPrice)
      if (newPrice <= 50) {
        document.getElementById('shipment').innerHTML = '10 €';
        newFinalPrice = parseFloat(newPrice+10);
      } else {
        document.getElementById('shipment').innerHTML = 'GRATUIT !';
        newFinalPrice = newPrice;
      }
      // Change le prix à payer
      document.getElementById('payedprice').innerHTML = newFinalPrice.toFixed(2) + ' €';

      // Suppression d'un article dans la liste
      // cette ligne ne fonctionne pas, malheureusement
      //articlesIdList = removeItemFromArray(articlesIdList,articlesIdList.indexOf(idTarget));
      delete articlesIdList[articlesIdList.indexOf(idTarget)];
      console.log(articlesIdList);

      // Si la quantité est nulle, on supprime le cadre de l'article
      if (card.querySelector('.number').innerHTML=='0') {
        card.remove();
      }

      // Si il n'y a plus rien dans le panier :
      if (parseFloat(document.getElementById('fullprice').innerHTML.split(" ").shift())==0) {
        emptyPrice();
      }

      // Mise à jour du nombre d'articles
      nbArticleInCart();
    }
  }
}


// --------------------------------------------------
// Supprime un objet du panier
// --------------------------------------------------

function supprPanier(idTarget) {
  // Pointe les boutons clickables
  let btnDeleteList = document.querySelectorAll('.js-btn-delete');
// Pour chaque bouton
for (btnDelete of btnDeleteList) {
    btnDelete.onclick = (e) => {
      // Pointe le plus haut parent
      let card         = e.target.closest('.card');
      // Pointe le prix de l'objet
      let itemPrice    = parseFloat(card.querySelector('.price').textContent.split(" ").shift());
      // Pointe la quantité d'objet
      let quantity     = parseFloat(card.querySelector('.number').textContent);
      // Multiplie les deux pour obtenir le prix total à enlever
      let removedPrice = itemPrice*quantity;
      // Le prix total des articles additionnés
      let fullpriceTemp = parseFloat(document.getElementById('fullprice').innerHTML.split(" ").shift());
      // Soustrait ce prix à enlever au coût total des articles
      let newPrice     = fullpriceTemp-removedPrice;
      // Le nouveau prix que le consommateur devra payer
      let newFinalPrice;
      // Change le prix total du panier
      document.getElementById('fullprice').innerHTML = newPrice.toFixed(2) + ' €';

      // Change les frais de ports selon le prix total (newPrice)
      if (newPrice <= 50) {
        document.getElementById('shipment').innerHTML = '10 €';
        newFinalPrice = newPrice+10;
      } else {
        document.getElementById('shipment').innerHTML = 'GRATUIT !';
      }
      // Change le prix à payer
      document.getElementById('payedprice').innerHTML = newFinalPrice.toFixed(2) + ' €';

      // Change la quantité d'articles comptés par la liste
      articlesIdList = articlesIdList.filter(function(e) { return e != idTarget; });

      // Si il n'y a plus rien dans le panier :
      if (parseFloat(document.getElementById('fullprice').innerHTML.split(" ").shift())==0) {
        emptyPrice();
      }

      // Grace à l'objet événement (e), je peux repérer le bouton cliqué (target)
      // Ensuite, je vais chercher le plus proche ancêtre ".orangeBorder" avec closest et je le supprime (remove).
      e.target.closest('.card').remove();

      // Mise à jour du nombre d'articles
      nbArticleInCart();
    };
}
}


// --------------------------------------------------
// Supprime l'affichage du prix
// --------------------------------------------------

function emptyPrice() {
  document.getElementById('fullprice').innerHTML  = '';
  document.getElementById('shipment').innerHTML   = '';
  document.getElementById('payedprice').innerHTML = '';
  // reset du prix total
  fullprice  = 0;
  finalprice = 0;
}


// --------------------------------------------------
// Affichage du nombre d'articles dans le panier
// --------------------------------------------------

function nbArticleInCart() {
  let divNbItems = document.getElementById('nbItems');
  // Gestion de l'orthographe
  if (articlesIdList.length == 1) {
    divNbItems.innerHTML = `(1 article)`;
  } else { divNbItems.innerHTML = `(${articlesIdList.length} articles)`; }
}

// --------------------------------------------------
// Supprime un article de la liste
// --------------------------------------------------

function removeItemFromArray(array, n) {
  const newArray = [];

  for ( let i = 0; i < array.length; i++) {
      if(array[i] !== n) {
          newArray.push(array[i]);
      }
  }
  return newArray;
}