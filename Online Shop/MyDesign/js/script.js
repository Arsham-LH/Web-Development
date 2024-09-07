// [
//     {
//       "id": 1,
//       "title": "عنوان محصول",
//       "description": "توضیح محصول",
//       "image": "http://localhost:3000/images/product-image.jpg",
//       "brand": "برند محصول",
//       "price": "62999000"
//     }
//   ]


// ***********************************Classes********************************
class Product {
    constructor(id, title, description, image, brand, price) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.image = image;
        this.brand = brand;
        this.price = price;
    }
    get id() {
        return this.id;
    }
}
//**************************************************************************



//***********************************Variables********************************
let productsList_el = document.querySelector("#products-list");
const sampleProduct_el = productsList_el.firstElementChild;

let cartItemsList_el = document.getElementById("cart-items");
sampleCartItem_el = cartItemsList_el.firstElementChild;

let products;

let emptyCart_div = document.createElement("span");
emptyCart_div.classList.add("fs-4", "text-muted", "text-center", "mx-auto")
emptyCart_div.innerHTML = "سبد شما خالی است!";

const priceFilter_in = document.getElementById("priceRange");
const priceFilter_out = document.getElementById("priceValue");
const brandFilterOpts = document.querySelector("#filters #brand-filter #options");

const sortDir_btn = document.getElementById("sort-dir-btn");
let sortDir = "up";
const brandSort_btn = document.getElementById("brand-sort-btn");
const priceSort_btn = document.getElementById("price-sort-btn");
const dateSort_btn = document.getElementById("date-sort-btn");
const slctSort_el = document.getElementById("selected-sort");

//***************************************************************************


//***********************************Function Calls********************************
clearPage();
renderProducts();

// fixCardHeights(2);
//*********************************************************************************


//***********************************Functions********************************
function addItem(event) {
    let targetCartItem_el = event.target.closest("li");
    let target_id = targetCartItem_el.id.match(/\d+/g);
    let current_count = localStorage.getItem(String(target_id));
    localStorage.setItem(String(target_id), Number(current_count) + 1);
    renderCartItems(products);
}

function removeItem(event) {
    let targetCartItem_el = event.target.closest("li");
    let target_id = targetCartItem_el.id.match(/\d+/g);
    let current_count = localStorage.getItem(String(target_id));
    localStorage.setItem(String(target_id), Number(current_count) - 1);
    renderCartItems(products);
}

function addToCart(event) {
    let targetProduct_el = event.target.closest(".card").parentElement;
    let target_id = targetProduct_el.id[targetProduct_el.id.length - 1];
    let current_count = localStorage.getItem(String(target_id));
    localStorage.setItem(String(target_id), Number(current_count) + 1);
    renderCartItems(products);
}


function clearPage() {
    clearProducts();
    clearCartItems();
    resetFilters();
}

function renderProducts() {
    fetch('http://localhost:3000/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((server_products) => {
            products = server_products;
            console.log(products);
            updateProducts(products);
            resetSort(products); ////////////////////////////////////////////////////////////////////////////////////////HERE
            // initLocalStorage(products);
            renderCartItems(products);
            checkFilters(products);
        })
        .catch((error) => {});
}

function clearProducts() {
    while (productsList_el.childElementCount > 0) {
        productsList_el.removeChild(productsList_el.firstElementChild);
    }
}

function clearCartItems() {
    while (cartItemsList_el.childElementCount > 0) {
        cartItemsList_el.removeChild(cartItemsList_el.firstElementChild);
    }
}

function resetFilters() {
    let priceFilterMin = priceFilter_in.getAttribute("min");
    let priceFilterMax = priceFilter_in.getAttribute("max");
    let minMaxLabels_div = document.getElementById("min-max-labels");
    minMaxLabels_div.firstElementChild.innerHTML = `${new Intl.NumberFormat().format(priceFilterMin)} تومان`;
    minMaxLabels_div.lastElementChild.innerHTML = `${new Intl.NumberFormat().format(priceFilterMax)} تومان`;
    priceFilter_in.value = priceFilterMax;
    priceFilter_out.innerHTML = `${new Intl.NumberFormat().format(priceFilter_in.value)} تومان`

    for (let brand_el of brandFilterOpts.children) {
        let brand_checkbox = brand_el.querySelector("input");
        brand_checkbox.checked = false;
    }
}

function initLocalStorage(products) {
    for (let i = 0; i < products.length; i++) {
        localStorage.setItem(String(products[i].id), "0");
    }
}

function updateProducts(products) {
    for (let i = 0; i < products.length; i++) {
        const product_el = sampleProduct_el.cloneNode(true);
        product_el.querySelector(".card-img-top").src = products[i].image;
        product_el.querySelector(".card-title").innerHTML = products[i].title;
        product_el.querySelector(".card-subtitle").innerHTML = `${new Intl.NumberFormat().format(products[i].price)} تومان`;
        product_el.querySelector(".card-text").innerHTML = products[i].description;
        product_el.id = `product-${products[i].id}`;
        product_el.setAttribute("brand-name", products[i].brand);
        productsList_el.append(product_el);
    }
    let addCart_btn_arr = document.getElementsByName("add-to-cart-btn");

    for (let i = 0; i < addCart_btn_arr.length; i++) {
        addCart_btn_arr[i].addEventListener("click", addToCart);
    }
}

function renderCartItems(products) {
    for (let i = 0; i < localStorage.length; i++) {
        let item_id = localStorage.key(i);
        let item_count = localStorage.getItem(String(item_id));
        let target_el = document.getElementById(`product-${item_id}-cart-item`)
        if (target_el) {
            if (item_count != "0") {
                target_el.getElementsByClassName("cart-item-count")[0].innerHTML = item_count;
            } else {
                cartItemsList_el.removeChild(target_el);
            }
        } else {
            if (item_count != "0") {
                cartItem_el = sampleCartItem_el.cloneNode(true);
                cartItem_el.getElementsByClassName("cart-item-title")[0].innerHTML = products.filter((product) => product.id == item_id)[0].title;
                cartItem_el.getElementsByClassName("cart-item-count")[0].innerHTML = item_count;
                cartItem_el.id = `product-${item_id}-cart-item`;
                cartItemsList_el.append(cartItem_el);
            }
        }
    }

    if (cartItemsList_el.childElementCount == 0) {
        cartItemsList_el.appendChild(emptyCart_div);
    } else {
        if (cartItemsList_el.contains(emptyCart_div))
            cartItemsList_el.removeChild(emptyCart_div);
    }

    //Add to/Remove from cart buttons
    let add_btns = document.getElementsByName("add-item-btn");
    let remove_btns = document.getElementsByName("remove-item-btn");
    for (let i = 0; i < add_btns.length; i++) {
        add_btns[i].addEventListener("click", addItem);
        remove_btns[i].addEventListener("click", removeItem);
    }
}

function checkFilters(products) {
    priceFilter_in.addEventListener("input", renderCurrentPrice);
    priceFilter_in.addEventListener("change", function() {
        applyPriceFilter(products);
    });

    for (let i = 0; i < brandFilterOpts.childElementCount; i++) {
        brandFilterOpts.children[i].querySelector("input").addEventListener("input", applyBrandFilters);
    }
}

function renderCurrentPrice() {
    priceFilter_out.innerHTML = `${new Intl.NumberFormat().format(priceFilter_in.value)} تومان`;
}

function applyPriceFilter(products) {
    let currentPrice = priceFilter_in.value;
    console.log(currentPrice);
    for (let i = 0; i < productsList_el.childElementCount; i++) {
        if (Number(products[i].price) > Number(currentPrice)) {
            productsList_el.children[i].setAttribute("price-filt", "true");
        } else {
            productsList_el.children[i].setAttribute("price-filt", "false");
        }
    }
    renderFilters();
}


function applyBrandFilters() {
    let uncheckedAllBrands = true;
    for (let brand_el of brandFilterOpts.children) {
        let brand_checkbox = brand_el.querySelector("input");
        if (brand_checkbox.checked) {
            uncheckedAllBrands = false;
        }
    }
    if (uncheckedAllBrands) {
        for (let brand_el of brandFilterOpts.children) {
            let brand_name = brand_el.getAttribute("brand-name");
            toggleFilterByBrandName(brand_name, true);
        }
    } else {
        for (let brand_el of brandFilterOpts.children) {
            let brand_name = brand_el.getAttribute("brand-name");
            let brand_checkbox = brand_el.querySelector("input");

            if (brand_checkbox.checked) {
                uncheckedAllBrands = false;
                toggleFilterByBrandName(brand_name, true);
            } else {
                toggleFilterByBrandName(brand_name, false);
            }
        }
    }
    renderFilters();
}

function toggleFilterByBrandName(brand_name, show) {
    for (let product_el of productsList_el.children) {
        if (product_el.getAttribute("brand-name") == brand_name) {
            if (show)
                product_el.setAttribute("brand-filt", "false");
            else
                product_el.setAttribute("brand-filt", "true");
        }
    }
}

function renderFilters() {
    for (const product_el of productsList_el.children) {
        if (product_el.getAttribute("price-filt") == "true" || product_el.getAttribute("brand-filt") == "true") {
            product_el.classList.add("d-none");
        } else {
            product_el.classList.remove("d-none");
        }
    }
}

function resetSort(products) {
    sortDir_btn.addEventListener("click", function() {
        changeSortDir(products);
    });

    brandSort_btn.addEventListener("click", function() {
        sortByBrand(products);
    });
    priceSort_btn.addEventListener("click", function() {
        sortByPrice(products);
    });
    dateSort_btn.addEventListener("click", function() {
        sortByDate(products);
    });

    sortByDate(products);
    slctSort_el.innerHTML = "تاریخ عرضه";
}

function changeSortDir(products) {
    sortDirIcon = sortDir_btn.firstElementChild;
    if (sortDir === "down") {
        sortDirIcon.classList.remove("bi-arrow-down-short");
        sortDirIcon.classList.add("bi-arrow-up-short");
        sortDir = "up";
    } else {
        sortDirIcon.classList.remove("bi-arrow-up-short");
        sortDirIcon.classList.add("bi-arrow-down-short");
        sortDir = "down";
    }

    switch (document.getElementById("selected-sort").innerHTML) {
        case "برند":
            sortByBrand(products);
            break;
        case "قیمت":
            sortByPrice(products);
            break;
        case "تاریخ عرضه":
            sortByDate(products);
            break;
        default:
            sortByBrand(products);
    }
}

function sortByBrand(products) {
    if (sortDir === "down")
        products.sort((a, b) => a.brand.localeCompare(b.brand, 'fa'));
    else
        products.sort((a, b) => b.brand.localeCompare(a.brand, 'fa'));


    sortProductsOnPage(products);
    slctSort_el.innerHTML = "برند";

}

function sortByPrice(products) {
    if (sortDir === "down")
        products.sort((a, b) => Number(a.price) >= Number(b.price));
    else
        products.sort((a, b) => Number(a.price) < Number(b.price));

    sortProductsOnPage(products);
    slctSort_el.innerHTML = "قیمت";
}

function sortByDate(products) {
    if (sortDir === "down")
        products.sort((a, b) => Number(a.release) >= Number(b.release));
    else
        products.sort((a, b) => Number(a.release) < Number(b.release));

    sortProductsOnPage(products);
    slctSort_el.innerHTML = "تاریخ عرضه";
}

function sortProductsOnPage(products) {
    let products_id_arr = Array(products.length);
    for (let i = 0; i < products.length; i++) {
        products_id_arr[i] = products[i].id;
    }

    let products_el_arr = Array.from(productsList_el.children);
    products_el_arr.sort((a, b) => {
        return products_id_arr.indexOf(Number(a.id[a.id.length - 1])) > products_id_arr.indexOf(Number(b.id[b.id.length - 1]));
    });

    clearProducts();
    for (const product_el of products_el_arr) {
        productsList_el.appendChild(product_el);
    }
}











function fixCardHeights(setLines) {

    let productsTitle_el = productsList_el.querySelectorAll(".card-title");

    console.log(productsTitle_el);
    for (let i = 0; i < productsTitle_el.length; i++) {
        console.log("her");
        let divHeight = productsTitle_el.item(i).offsetHeight
        let lineHeight = parseInt(productsTitle_el.item(i).style.lineHeight);
        let lines = divHeight / lineHeight;

        if (lines < setLines) {
            for (let j = 0; j < setLines - lines; j++) {
                productsTitle_el.item(i).appendChild("<br>")
            }
        }
    }
}
//*********************************************************************************