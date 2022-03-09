$(document).ready(function(){
    let url = window.location.pathname;
    fetchData("nav.json", function(result){
        loadNavMenu(result);
    });
    fetchData("social-networks.json", function(result){
        loadFooterLinks(result, "social-networks");
    });
    fetchData("useful-links.json", function(result){
        loadFooterLinks(result, "useful-links");
    });
    if(url == "/index.html" || url=="/"){
        fetchData("best-seller.json", function(result){
            loadBestSeller(result);
        });
    }
    
    if(url == "/store.html"){
        var brands = [];
        fetchData("prices.json", function(result){
            loadPrice(result);
        });
        document.getElementById("sort-sneakers").addEventListener("change", filterChange);
        document.getElementById("search-sneakers").addEventListener("keyup", filterChange);
        document.getElementById("filter-discount").addEventListener("change", filterChange);
        document.getElementById("filter-best-seller").addEventListener("change", filterChange);
    }

    if(url == "/cart.html"){
        let sneakers = getItemFromLS("cart");
        if(sneakers == null){
            showEmptyCart();
        }
        else if(sneakers.length == 0){
            showEmptyCart();
        }
        else{
            showCart();
            quantityChange();
        }
    }
    cartNumber();
});
// FUNKCIJA ZA AJAX
function fetchData(file, result){
    $.ajax({
        url: "assets/data/" + file,
        method: "get",
        dataType: "json",
        success: result,
        error: function(err){
            console.log(err);
        }
    })
}
// FUNKCIJA ZA SKLADISTENJE PODATAKA U LOCAL STORAGE
function setItemToLS(name, data){
    localStorage.setItem(name, JSON.stringify(data));
}
// FUNKCIJA ZA CITANJE PODATKA IZ LOCAL STORAGE-A
function getItemFromLS(name){
    return JSON.parse(localStorage.getItem(name));
}
// FUNKCIJA ZA ISPIS BEST-SELLER PATIKA
function loadBestSeller(data){
    let divBestSeller = document.getElementById("best-sellers-main");
    let html = "";
    data.forEach(s => {
        html += 
        `<div class="card col-3 col-lg-3 mt-4 p-0 rounded overflow-hidden">
            <img src="assets/img/${s.image.src}" class="img-fluid" alt="${s.image.alt}">
            <div class="best-sellers-info text-center mt-4 mb-2">
                <p>${s.name}</p>
                <a href="store.html">Buy</a>
            </div>
        </div>`;
    });
    divBestSeller.innerHTML = html;
}
// FUNKCIJA ZA ISPIS NAVIGACIONOG MENIJA
function loadNavMenu(data){
    let divNav = document.getElementById('nav-menu');
    let html = '';
    data.forEach(link => {
        html+=
        `<li class="nav-item">
            <a class="nav-link" href="${link.href}">${link.name}</a>
        </li>`;
    });
    divNav.innerHTML = html;
}
// FUNKCIJA ZA ISPIS LINKOVA U FUTERU
function loadFooterLinks(data, div){
    let divLinks = document.getElementById(div);
    let html = "";
    data.forEach(link => {
        html +=
        `<p>
            <a href="${link.href}" class="text-reset">
                <i class="${link.icon} me-3"></i>${link.name}
            </a>
        </p>`;
    });
    divLinks.innerHTML = html;
}
// FUNKCIJA ZA ISPISIVANJE FILTERA CENA
function loadPrice(data){
    let divPrices = document.getElementById("filter-prices");
    let html = "";
    data.forEach(price => {
        html+=
        `<li class="form-check">
            <input class="form-check-input filter-price" type="checkbox" value="${price.id}" name="price" onclick="checkboxOne(this)"/>
            <label class="form-check-label" for="filter-price">${price.label}</label>
        </li>`;
    });
    divPrices.innerHTML = html;
    $(".filter-price").change(filterChange);
    fetchData("brands.json", function(result){
        loadBrands(result);
    });
}
// FUNKCIJA KOJA DOZVOLJAVA CEKIRANJE SAMO JEDNOG CHECKBOX-A
function checkboxOne(checkbox) {
    var checkboxes = document.querySelectorAll(".filter-price");
    checkboxes.forEach(ch => {
        if (ch !== checkbox) ch.checked = false
    })
}
// FUNKCIJA ZA ISPISIVANJE BRENDOVA
function loadBrands(data){
    let divBrands = document.getElementById("filter-brands");
    let html = "";
    data.forEach(brand => {
        html+=
        `<li class="form-check">
            <input class="form-check-input brand" type="checkbox" value="${brand.id}"/>
            <label class="form-check-label" for="brand">${brand.name}</label>
        </li>`;
    });
    divBrands.innerHTML = html;
    brands = data;
    $(".brand").change(filterChange);
    fetchData("sneakers.json", function(result){
        setItemToLS("allSneakers", result);
        loadSneakers(result);
    });
}
// FUNKCIJA ZA ISPISIVANJE PATIKA
function loadSneakers(data){
    data = sortData(data);
    data = filterBrand(data);
    data = filterPrice(data);
    data = filterDiscount(data);
    data = filterBestSellers(data);
    data = search(data);
    let divSneakers = document.getElementById("sneakers");
    let html = "";
    if(data.length > 0){
        data.forEach(s => {
            html+=
            `<div class="col-12 col-sm-6 col-md-3 mb-3 p-2">
                <div class="single-sneakers rounded overflow-hidden">
                    ${loadDiscountSneakers(s.discount)}
                    ${bestSellerMark(s.bestSeller)}
                    <div id="sneakers-carousel-${s.id}" class="carousel slide" data-bs-interval="false">
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <img src="assets/img/sneakers/${s.images[0].src}" class="d-block w-100" alt="${s.images[0].alt}">
                            </div>
                            <div class="carousel-item">
                                <img src="assets/img/sneakers/${s.images[1].src}" class="d-block w-100" alt="${s.images[1].alt}">
                            </div>
                            <div class="carousel-item">
                                <img src="assets/img/sneakers/${s.images[2].src}" class="d-block w-100" alt="${s.images[2].alt}">
                            </div>
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#sneakers-carousel-${s.id}" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#sneakers-carousel-${s.id}" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                    <div class="sneakers-name text-center">
                        <div class="sneakers-brand">
                            <span class="text-uppercase">${loadBrandName(s.brand)}</span>
                        </div>
                        <div class="sneakers-name">
                            <span>${s.name}</span>
                        </div>
                    </div>
                    <div class="sneakers-price text-center">
                        <div class="old-price">
                            <span class="text-decoration-line-through">${formatPrice(s.price.old)}</del>
                        </div>
                        <span>${formatPrice(s.price.current)}</span>
                    </div>
                    <div class="text-center p-1 mb-1">
                        <button class="add-to-cart btn btn-danger" data-id="${s.id}">Add to cart</button>
                    </div>
                </div>
            </div>`;
        });
    }
    else{
        html+=
        `<div class="container m-5 alert alert-danger"><p>No sneakers found.</p></div>`;
    }
    divSneakers.innerHTML = html;
    $(".add-to-cart").click(addToCart);
}
// FUNKCIJE ZA ISPISIVANJE POJEDINIH DELOVA PATIKA
function loadDiscountSneakers(discount){
    if(discount) return `<div class="sneakers-discount p-1">-` + discount +`%</div>`;
    else return "";
}
function bestSellerMark(bestSeller){
    if(bestSeller) return `<div class="sneakers-best-seller py-1 px-2"><i class="fa-brands fa-hotjar"></i></div>`;
    else return "";
}
function loadBrandName(brandId){
    let html = "";
    brands.forEach(brand => {
        if(brand.id === brandId) html = brand.name;
    })
    return html;
}
function formatPrice(price){
    if(price) return "€" + price;
    else return "";
}
// FUNKCIJA ZA SORTIRANJE
function sortData(data){
    let sortType = document.getElementById("sort-sneakers").value;
    if(sortType === "discount"){
        return data.sort((a, b) => {
            return b.discount - a.discount;
        })
    }
    else if(sortType === "price-asc"){
        return data.sort((a,b) => {
            return a.price.current - b.price.current;
        });
    }
    else if(sortType === "price-desc"){
        return data.sort((a,b) => {
            return b.price.current - a.price.current;
        });
    }
    else if(sortType === "name-asc"){
        return data.sort((a, b) => a.name > b.name ? 1 : -1);
    }
    else if(sortType === "name-desc"){
        return data.sort((a, b) => a.name < b.name ? 1 : -1);
    }
    else return data;
}
// FUNKCIJA ZA PRETRAGU PO IMENIMA
function search(data){
    let searchValue = document.getElementById("search-sneakers").value.toLowerCase();
    if(searchValue){
        return data.filter(s => s.name.toLowerCase().indexOf(searchValue)!=-1);
    }
    return data;
}
// FUNKCIJA ZA FILTRIRANJE PO BRENDOVIMA
function filterBrand(data){
    let selectedBrands = document.querySelectorAll(".brand:checked");
    let brandsIds = [];

    selectedBrands.forEach(brand =>{
         brandsIds.push(Number(brand.value));
    });
    if(brandsIds.length) return data.filter(s => brandsIds.includes(s.brand));
    return data;
}
// FUNKCIJA ZA FILTRIRANJE PO CENAMA
function filterPrice(data){
    let selectedPrice = document.querySelectorAll(".filter-price:checked");
    let priceId = [];

    selectedPrice.forEach(price => {
        priceId.push(Number(price.value));
    })
    if(priceId.length){
        for(let i of priceId){
            if(i == 1){
                return data.filter(s => s.price.current > 0 && s.price.current <= 100);
            }
            if(i == 2){
                return data.filter(s => s.price.current > 100 && s.price.current <= 150);
            }
            if(i == 3){
                return data.filter(s => s.price.current > 150 && s.price.current <= 200);
            }
            if(i == 4){
                return data.filter(s => s.price.current > 200);
            }
        }
    }
    return data;
}
//FUNKCIJA ZA FILTRIRANJE PO POPUSTU
function filterDiscount(data){
    let checked = document.querySelector("#filter-discount:checked");
    if(checked){
        return data.filter(s => s.discount); 
    }
    return data;
}
function filterBestSellers(data){
    let checked = document.querySelector("#filter-best-seller:checked");
    if(checked){
        return data.filter(s => s.bestSeller); 
    }
    return data;
}
function filterChange(){
    fetchData("sneakers.json", loadSneakers);
}
// FUNKCIJA ZA DODAVANJE U KORPU
function addToCart(){
    let id = $(this).data("id");
    let sneakers = getItemFromLS("cart");

    if(sneakers){
        if(sneakersAlreadyInCart(sneakers, id)){
            updateQuantity(sneakers, id);
        }
        else{
            addNewSneakersToCart(sneakers, id);
            cartNumber();
        }
    }
    else{
        addFirstSneakersToCart(id);
        cartNumber();
    }

    alert("Item has been added to the cart!");
}
// FUNKCIJA ZA PROVERU DA LI JE ODREDJENI ELEMENT VEC U KORPI
function sneakersAlreadyInCart(sneakers, id){
    return sneakers.filter(s => s.id == id).length;
}
// FUNKCIJA ZA DODAVANJE PRVOG ELEMENTA U LS KORPU
function addFirstSneakersToCart(id){
    let sneakers = [];
    sneakers[0] = {
        id: id,
        quantity: 1
    }

    setItemToLS("cart", sneakers);
}
// FUNKCIJA ZA DODAVANJE ELEMENTA U LS KORPU
function addNewSneakersToCart(sneakers, id){
    sneakers.push({
        id: id,
        quantity: 1
    });

    setItemToLS("cart", sneakers);
}
// FUNKCIJA ZA UVECANJE KOLICINE
function updateQuantity(sneakers, id){
    sneakers.forEach(s => {
        if(s.id == id){
            s.quantity++;
        }
    });

    setItemToLS("cart", sneakers);
}
// FUNKCIJA ZA PRIKAZIVANJE BROJA ELEMENATA U KORPI
function cartNumber(){
    let sneakers = getItemFromLS("cart");
    let cartNumberSpan = $('.number');
    let cartNumberText = "";

    if(sneakers){
        let sneakersNumber = sneakers.length;
        if(sneakersNumber == 0){
            sneakersNumber = "";
        }
        cartNumberText = sneakersNumber;
    }
    
    cartNumberSpan.html(cartNumberText);
}
// FUNKCIJA ZA SLUCAJ AKO JE KORPA PRAZNA
function showEmptyCart(){
    let html = 
    `<div class="row">
        <div class="col-6 text-center mx-auto">
            <img src="assets/img/cart-empty.png" alt="Cart is empty." class="w-100"/>
            <div>
                <h3 class="text-danger">Cart is empty.</h3> 
            </div>
        </div>
    </div>`;
    $("#shopping-cart").html(html);
}
// FUNKCIJA ZA SLUCAJ AKO IMA ELEMENATA U KORPI
function showCart(){
    let allSneakers = getItemFromLS("allSneakers");
    let sneakersCart = getItemFromLS("cart");

    let sneakersForDisplay = allSneakers.filter(s => {
        for(let sCart of sneakersCart){
            if(s.id == sCart.id){
                s.quantity = sCart.quantity;
                return true;
            }
        }
        return false;
    })
    loadCart(sneakersForDisplay);
}
// FUNKCIJA ZA ISPISIVANJE ELEMENATA U KORPI
function loadCart(sneakers){
    let html = "";
    sneakers.forEach(s => {
        html+=
        `<div class="row mx-0 align-items-center border p-3 text-center">
            <div class="col-4 col-lg-2">
                <img class="img-fluid" src="assets/img/sneakers/${s.images[0].src}" alt="${s.images[0].alt}"/>
            </div>
            <div class="col-8 col-lg-3">
                <h4>${s.name}</h4>
            </div>
            <div class="col-4 col-lg-2 mt-3 mt-lg-0">
                <p class="fw-bold">Price</p>
                <span class="price-per-piece">${formatPrice(s.price.current)}</span>
            </div>
            <div class="col-4 col-lg-3 mt-3 mt-lg-0">
                <p class="fw-bold">Quantity</p>
                <input type="number" class="sneakers-quantity" data-id="${s.id}" min="1" value="${s.quantity}"/>
                <span class="sum-per-sneakers">${formatPrice(s.price.current * s.quantity)}</span>
            </div>
            <div class="col-4 col-lg-2 text-end">
                <button class="btn btn-danger" onclick="removeFromCart(${s.id})">Remove</button>
            </div>
        </div>`;
    });
    html +=
    `<div class="container">
        <div class="my-2 text-end">
            <div class="my-2">
                <span id="total-sum" class="m-1 fw-bold">Total Sum is ${sumPrices(sneakers)}</span>
                <button id="purchase" class="btn btn-secondary mx-2" onclick ="purchase()" >Purchase</button>
            </div>
            <div class="my-2">
                <button id="remove-card" class="btn btn-danger mx-2" onclick="removeAll()">Remove All</button>
            </div>
        </div>
    </div>`;
    $("#shopping-cart").html(html);
}
// FUNKCIJA ZA BRISANJE ELEMENATA IZ KORPE LS
function removeAll(){
    localStorage.removeItem("cart");
    showEmptyCart();
    cartNumber();
}
// FUNKCIJA KOJOM SE OSTVARUJE PRIKAZIVANJE POPUP PORUKE ZA USPESNU PORUDZBINU
function purchase(){
    alert("Your purchase is successful." + "\n" + "Order number: " + Math.floor(Math.random() * 100000) + 1);
    removeAll();
}
// FUNKCIJA ZA BRISANJE ODREDJENOG ELEMENTA IZ KORPE
function removeFromCart(id) {
    let sneakers = getItemFromLS("cart");
    sneakers = sneakers.filter(s => s.id != id);

    setItemToLS("cart", sneakers);
    console.log(sneakers);
    if(sneakers.length < 1){
        showEmptyCart();
    }
    else{
        showCart();
        quantityChange();
    }

    cartNumber();
}
// FUNKCIJA ZA ZBIR CENA
function sumPrices(sneakers){
    let sum = 0;
    sneakers.forEach(s =>{
        sum += s.price.current * s.quantity;
    })
    return "€" + sum;
}
// FUNKCIJ ZA PROMENU KOLICINE
function update(){
    let sneakersSum = document.querySelectorAll(".sum-per-sneakers");
    let price = document.querySelectorAll(".price-per-piece");
    let quantity = document.querySelectorAll(".sneakers-quantity");
    let totalSum = document.querySelector("#total-sum");
    let sumPerSneakers = 0;

    for(let i=0; i < price.length; i++){
        let priceFormat = price[i].innerHTML.replace("€", "");

        sneakersSum[i].innerHTML = (priceFormat)*(quantity[i].value) + "€";
        
        sumPerSneakers += (priceFormat) * (quantity[i].value);
    }

    totalSum.innerHTML = "Total Sum is " + sumPerSneakers + "€";
}
function quantityChange(){
    $(".sneakers-quantity").change(function(){
        if(this.value > 0){
            update();
        }
        else{
            this.value = 1;
        }
    });
}
// VALIDACIJA FORME
var contactName = $("#contact-name");
var contactEmail = $("#contact-email");
var contactPhone = $("#contact-phone");
var contactSubject = $("#contact-subject");
var contactMessage = $("#contact-message");

var regName = /^[A-ZŠĐČĆŽ][a-zšđčćž]{2,20}(\s[A-ZŠĐČĆŽ][a-zšđčćž]{2,20})+$/;
var regEmail = /^[a-z\.]{2,}@([a-z\.]{2,}\.)+[a-z]{2,4}$/;
var regPhone = /^(\+381|0)(\s)?[0-9]{2}(\s)?([0-9]{3}|[0-9]{4})(\s)?[0-9]{3}$/;

function checkName(){
    if(contactName.val() == ""){
        contactName.css(
            "border", "1px solid #f00"
        );
        contactName.val("");
        contactName.attr("placeholder", "Name can not be empty.");
        return false;
    }
    else if(!regName.test(contactName.val())){
        contactName.css(
            "border", "1px solid #f00"
        );
        contactName.val("");
        contactName.attr("placeholder", "Please provide valid name.");
        return false;
    }
    else{
        contactName.css(
            "border", "1px solid #000"
        );
        return true;
    }
}
function checkEmail(){
    if(contactEmail.val() == ""){
        contactEmail.css(
            "border", "1px solid #f00"
        );
        contactEmail.val("");
        contactEmail.attr("placeholder", "Email can not be empty.");
        return false;
    }
    else if(!regEmail.test(contactEmail.val())){
        contactEmail.css(
            "border", "1px solid #f00"
        );
        contactEmail.val("");
        contactEmail.attr("placeholder", "Please provide valid email.");
        return false;
    }
    else{
        contactEmail.css(
            "border", "1px solid #000"
        );
        return true;
    }
}
function checkPhone(){
    if(contactPhone.val() == ""){
        contactPhone.css(
            "border", "1px solid #f00"
        );
        contactPhone.val("");
        contactPhone.attr("placeholder", "Phone number can not be empty.");
        return false;
    }
    else if(!regPhone.test(contactPhone.val())){
        contactPhone.css(
            "border", "1px solid #f00"
        );
        contactPhone.val("");
        contactPhone.attr("placeholder", "Please provide valid phone number.");
        return false;
    }
    else{
        contactPhone.css(
            "border", "1px solid #000"
        );
        return true;
    }
}
function checkSubject(){
    if(contactSubject.val() == ""){
        contactSubject.css(
            "border", "1px solid #f00"
        );
        contactSubject.val("");
        contactSubject.attr("placeholder", "Subject can not be empty.");
        return false;
    }
    else{
        contactSubject.css(
            "border", "1px solid #000"
        );
        return true;
    }
}
function checkMessage(){
    if(contactMessage.val() == ""){
        contactMessage.css(
            "border", "1px solid #f00"
        );
        contactMessage.val("");
        contactMessage.attr("placeholder", "Message can not be empty.");
        return false;
    }
    else{
        contactMessage.css(
            "border", "1px solid #000"
        );
        return true;
    }
}
$("#contact-submit-button").click(function(e){
    e.preventDefault();
    let success = $("#form-success");
    let fullName = checkName();
    let email = checkEmail();
    let phone = checkPhone();
    let subject = checkSubject();
    let message = checkMessage();
    if(fullName && email && phone && subject && message){
        success.html('<p class="alert alert-success">Successful</p>');
        setTimeout(() => {success.html("")}, 5000);
        
    }
})

//


