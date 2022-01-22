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
    supprPanier();
});

// Création des variables fullprice et nbItems 
let fullprice      = 0;
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
      fullprice       = price + fullprice;
      // Réduction des frais de port à partir de 50 € d'achat
      if ( fullprice >= 50 ) { fullprice = fullprice - 10; }

      // Si cet article est déjà dans le panier :
      if (articlesIdList.includes(idTarget)) {
        // Récupèrer la quantité de cet article en stock
        let nbItem = articlesIdList.filter(function(e) {
          return e == idTarget;
        });
        console.log(nbItem);
        // Augmenter cette valeur de 1
        card.querySelector('.dropdown-toggle').innerHTML = parseInt(nbItem)++;
        // Sinon l'id est ajouté au tableau d'ID
      }
      articlesIdList.push(idTarget);
      console.log(articlesIdList);

      // création d'un nouveau cadre d'article
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
                  <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="quantity" data-bs-toggle="dropdown" aria-expanded="false">1</button>
                    <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="quantity">
                      <li><a class="dropdown-item" href="#">2</a></li>
                      <li><a class="dropdown-item" href="#">3</a></li>
                      <li><a class="dropdown-item" href="#">4</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-md-2 d-flex justify-content-center">
                <div>
                  <p class="text-muted mb-4 pb-2">Prix</p>
                  <p class="lead fw-normal mb-0">${price} €</p>
                </div>
              </div>
              <div class="col-md-2 d-flex justify-content-center">
                <div>
                  <a class="btn orangeBorder js-btn-delete me-1" href="#!" role="button">Supprimer</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.getElementById('listArticlesPanier').innerHTML += articlePanier;
      // Ajout d'un objet au compteur
      nbItems++;
      
      // Change le prix total du panier
      document.getElementById('fullprice').innerHTML = fullprice + ' €';
      let divNbItems = document.getElementById('nbItems');
      if (nbItems == 1) {
        divNbItems.innerHTML = `(${nbItems} article)`;
      } else { divNbItems.innerHTML = `(${nbItems} articles)`; }
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

// --------------------------------------------------
// Supprime un objet du panier
// --------------------------------------------------

function supprPanier() {
  // Pointe les boutons clickables
  btnDeleteList = document.querySelectorAll('.js-btn-delete');
// Pour chaque bouton
for (btnDelete of btnDeleteList) {
    btnDelete.onclick = (e) => {
      console.log('GG !');
        // Grace à l'objet événement (e), je peux repérer le bouton cliqué (target)
        // Ensuite, je vais chercher le plus proche ancêtre ".orangeBorder" avec closest et je le supprime (remove).
        e.target.closest('.orangeBorder').remove();
    };
}
}