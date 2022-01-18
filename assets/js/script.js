fetch('assets/data/articles.json')
    .then(response => response.json())
    .then((listArticles) => {
        listArticles.articles.map((articles) => {
        
        let id       = articles.id;
        let title    = articles.title;
        let overview = articles.overview;
        let img_path = articles.img_path;
        let img_alt  = articles.img_alt;
        let price    = articles.price;
        let age      = articles.age;
        let playTime = articles.playTime;
        let category = articles.category;
        
        let nouvelArticle = `
        <div class="col-md-6 my-3">
          <div class="card orangeBorder">
            <div class="d-flex">
              <div class="col-md-5 d-flex align-items-center">
                <img src="assets/img/${img_path}" class="img-fluid rounded-start" alt="${img_alt}">
              </div>
              <div class="col-md-7 card-body">
                <p class="card-title fs-3">${title}</p>
                <p class="card-text">${overview}</p>
                <div class="row d-flex align-items-end">
                  <div class="col">
                    <small class="row text-muted">catégorie : ${category}</small>
                    <small class="row text-muted">durée : ~${playTime} min</small>
                    <small class="row text-muted">age : ${age} ans</small>
                  </div>
                  <div class="col">
                    <p class="row mb-3 fs-3 fw-bold d-flex justify-content-center">${price} €</p>
                    <a id="${id}" class="row btn orangeBorder js-btn-addToCart" href="#!" role="button">Ajouter au panier</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;

        document.getElementById('products').innerHTML += nouvelArticle;
        })
    });

let btnAddToCartList = document.querySelectorAll('.js-btn-addToCart');
console.log(btnAddToCartList.length);

// Pour chaque bouton
for (btnAddToCart of btnAddToCartList) {
    btnAddToCartList.onclick = (e) => {
        // Grace à l'objet événement (e), je peux repérer le bouton cliqué (target).
        // Ensuite, je vais chercher son id et je l'utilise pour pointer les informations à ajouter au panier.
        let idTarget = e.target.id;
        console.log(idTarget);
        console.log("idTarget");
    };
}