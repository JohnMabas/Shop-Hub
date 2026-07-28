
// Loading Products
// Shadow State
// Rendering

const API = "https://dummyjson.com/products";

// Local Shadow State....

let shadowProducts = [];
let filteredProducts = [];

let selectedProduct = null;

let activityLog = [];

let added = 0;
let updated = 0;
let deleted = 0;

//  DOM Elements.........


const table = document.getElementById("productTable");
const mobile = document.getElementById("mobileProducts");

const totalProducts = document.getElementById("totalProducts");
const addedCount = document.getElementById("addedCount");
const updatedCount = document.getElementById("updatedCount");
const deletedCount = document.getElementById("deletedCount");

const search = document.getElementById("adminSearch");

const loading = document.getElementById("loading");
const toast = document.getElementById("toast");

const activity = document.getElementById("activityLog");

// -----------------------------
// Loading Screen
// -----------------------------

function showLoading() {

    loading.classList.remove("hidden");
    loading.classList.add("flex");

}

function hideLoading() {

    loading.classList.add("hidden");
    loading.classList.remove("flex");

}

// -----------------------------
// Toast
// -----------------------------

function showToast(message) {

    toast.innerHTML = message;

    toast.classList.remove("hidden");

    setTimeout(() => {

        toast.classList.add("hidden");

    }, 2000);

}

// -----------------------------
// Dashboard Counters
// -----------------------------

function updateCounters() {

    totalProducts.innerHTML = shadowProducts.length;

    addedCount.innerHTML = added;

    updatedCount.innerHTML = updated;

    deletedCount.innerHTML = deleted;

}

// -----------------------------
// Activity Log
// -----------------------------

function addActivity(text) {

    activityLog.unshift({

        text,

        time: new Date().toLocaleTimeString()

    });

    renderActivity();

}

function renderActivity() {

    if (activityLog.length === 0) {

        activity.innerHTML = `

        <div class="p-4 text-gray-500">

        No activity yet.

        </div>

        `;

        return;

    }

    activity.innerHTML = "";

    activityLog.forEach(item => {

        activity.innerHTML += `

        <div class="border-b p-4">

            <p class="font-semibold">

                ${item.text}

            </p>

            <small class="text-gray-500">

                ${item.time}

            </small>

        </div>

        `;

    });

}

// -----------------------------
// Load Products
// -----------------------------

async function loadProducts() {

    showLoading();

    try {

        const response = await fetch(API + "?limit=100");

        const data = await response.json();

        // Shadow copy

        shadowProducts = [...data.products];

        filteredProducts = [...shadowProducts];

        renderProducts();

        updateCounters();

    }

    catch (err) {

        alert("Failed to load products");

        console.log(err);

    }

    hideLoading();

}

// -----------------------------
// Render Products
// -----------------------------

function renderProducts() {

    renderTable();

    renderMobile();

    updateCounters();

}

// -----------------------------
// Desktop Table
// -----------------------------

function renderTable() {

    table.innerHTML = "";

    filteredProducts.forEach(product => {

        table.innerHTML += `

<tr class="border-b hover:bg-gray-50">

<td class="p-3">

${product.id}

</td>

<td class="p-3">

<div class="flex items-center gap-3">

<img
src="${product.thumbnail}"
class="w-14 h-14 rounded object-cover">

<div>

<p class="font-semibold">

${product.title}

</p>

<p class="text-sm text-gray-500">

${product.brand}

</p>

</div>

</div>

</td>

<td class="p-3 font-bold text-green-600">

$${product.price}

</td>

<td class="p-3">

<div class="flex gap-2 flex-wrap">

<button

onclick="openEdit(${product.id})"

class="bg-blue-600 text-white px-3 py-1 rounded">

PUT

</button>

<button

onclick="quickEdit(${product.id})"

class="bg-yellow-500 text-white px-3 py-1 rounded">

PATCH

</button>

<button

onclick="removeProduct(${product.id})"

class="bg-red-600 text-white px-3 py-1 rounded">

DELETE

</button>

</div>

</td>

</tr>

`;

    });

}

// -----------------------------
// Mobile Cards
// -----------------------------

function renderMobile() {

    mobile.innerHTML = "";

    filteredProducts.forEach(product => {

        mobile.innerHTML += `

<div class="bg-white border rounded-xl shadow p-4">

<div class="flex gap-4">

<img

src="${product.thumbnail}"

class="w-24 h-24 rounded object-cover">

<div class="flex-1">

<h3 class="font-bold">

${product.title}

</h3>

<p class="text-gray-500">

${product.brand}

</p>

<p class="text-green-600 font-bold mt-2">

$${product.price}

</p>

</div>

</div>

<div class="grid grid-cols-3 gap-2 mt-4">

<button

onclick="openEdit(${product.id})"

class="bg-blue-600 text-white rounded py-2">

PUT

</button>

<button

onclick="quickEdit(${product.id})"

class="bg-yellow-500 text-white rounded py-2">

PATCH

</button>

<button

onclick="removeProduct(${product.id})"

class="bg-red-600 text-white rounded py-2">

DELETE

</button>

</div>

</div>

`;

    });

}

// -----------------------------
// Search
// -----------------------------

search.addEventListener("keyup", () => {

    const value = search.value.toLowerCase();

    filteredProducts = shadowProducts.filter(product =>

        product.title.toLowerCase().includes(value) ||

        product.brand.toLowerCase().includes(value) ||

        product.category.toLowerCase().includes(value)

    );

    renderProducts();

});

// -----------------------------
// Initial Load
// -----------------------------

loadProducts();



// ==========================================
// ADMIN.JS - PART 2
// POST (Add Product)
// Optimistic UI
// Rollback on Failure
// ==========================================

// -----------------------------
// Form Elements
// -----------------------------

const productForm = document.getElementById("productForm");

const titleInput = document.getElementById("title");
const priceInput = document.getElementById("price");
const brandInput = document.getElementById("brand");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");
const imageInput = document.getElementById("image");

// -----------------------------
// Generate Temporary ID
// -----------------------------

function generateTempId() {

    return Date.now();

}

// -----------------------------
// Clear Form
// -----------------------------

function clearForm() {

    titleInput.value = "";
    priceInput.value = "";
    brandInput.value = "";
    categoryInput.value = "";
    descriptionInput.value = "";
    imageInput.value = "";

}

// -----------------------------
// Add Product
// -----------------------------

productForm.addEventListener("submit", addProduct);

// -----------------------------
// POST Product
// -----------------------------

async function addProduct(e) {

    e.preventDefault();

    if (
        titleInput.value.trim() === "" ||
        priceInput.value.trim() === ""
    ) {

        alert("Title and Price are required.");

        return;

    }

    // Backup (Rollback)

    const backup = [...shadowProducts];

    // New Product

    const newProduct = {

        id: generateTempId(),

        title: titleInput.value,

        price: Number(priceInput.value),

        brand: brandInput.value,

        category: categoryInput.value,

        description: descriptionInput.value,

        thumbnail:
            imageInput.value ||
            "https://placehold.co/600x400?text=Product"

    };

    // -----------------------------
    // Optimistic Update
    // -----------------------------

    shadowProducts.unshift(newProduct);

    filteredProducts = [...shadowProducts];

    added++;

    renderProducts();

    updateCounters();

    addActivity("Added Product : " + newProduct.title);

    showToast("Product Added");

    clearForm();

    // -----------------------------
    // Send POST Request
    // -----------------------------

    showLoading();

    try {

        const response = await fetch(API + "/add", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                title: newProduct.title,

                price: newProduct.price,

                brand: newProduct.brand,

                category: newProduct.category,

                description: newProduct.description

            })

        });

        if (!response.ok) {

            throw new Error("Failed");

        }

        const data = await response.json();

        console.log("POST Success");

        console.log(data);

    }

    catch (error) {

        console.log(error);

        // -----------------------------
        // Rollback
        // -----------------------------

        shadowProducts = backup;

        filteredProducts = [...shadowProducts];

        added--;

        renderProducts();

        updateCounters();

        addActivity("Rollback : Add Failed");

        showToast("Add Failed - Rolled Back");

    }

    hideLoading();

}

// ==========================================
// OPTIONAL TEST BUTTON
// ==========================================

// Call this in the browser console:
//
// addDummyProduct();
//
// It lets you quickly test optimistic UI.
//

function addDummyProduct() {

    titleInput.value = "Gaming Laptop";

    priceInput.value = 1200;

    brandInput.value = "Dell";

    categoryInput.value = "Laptops";

    descriptionInput.value = "Demo Product";

    imageInput.value = "";

    productForm.requestSubmit();

}


// ===============================================
// ADMIN.JS - PART 3A
// PUT (Full Edit)
// Edit Modal
// Optimistic Update + Rollback
// ===============================================

// ----------------------------
// Modal Elements
// ----------------------------

const editModal = document.getElementById("editModal");
const closeEditModal = document.getElementById("closeEditModal");
const editForm = document.getElementById("editForm");

const editTitle = document.getElementById("editTitle");
const editPrice = document.getElementById("editPrice");
const editBrand = document.getElementById("editBrand");
const editCategory = document.getElementById("editCategory");
const editDescription = document.getElementById("editDescription");

// Product being edited
let currentEditId = null;

// ----------------------------
// Open Edit Modal
// ----------------------------

function openEdit(id) {

    const product = shadowProducts.find(p => p.id == id);

    if (!product) return;

    currentEditId = id;

    editTitle.value = product.title;
    editPrice.value = product.price;
    editBrand.value = product.brand;
    editCategory.value = product.category;
    editDescription.value = product.description;

    editModal.classList.remove("hidden");
    editModal.classList.add("flex");

}

// ----------------------------
// Close Modal
// ----------------------------

closeEditModal.onclick = () => {

    editModal.classList.add("hidden");
    editModal.classList.remove("flex");

};

window.addEventListener("click", (e) => {

    if (e.target === editModal) {

        editModal.classList.add("hidden");
        editModal.classList.remove("flex");

    }

});

// ----------------------------
// Save Changes (PUT)
// ----------------------------

editForm.addEventListener("submit", saveChanges);

async function saveChanges(e) {

    e.preventDefault();

    const index = shadowProducts.findIndex(p => p.id == currentEditId);

    if (index === -1) return;

    // Backup for rollback
    const backup = JSON.parse(JSON.stringify(shadowProducts));

    // Keep original thumbnail
    const old = shadowProducts[index];

    // Updated product
    const updatedProduct = {

        ...old,

        title: editTitle.value,

        price: Number(editPrice.value),

        brand: editBrand.value,

        category: editCategory.value,

        description: editDescription.value

    };

    // ----------------------------
    // Optimistic UI
    // ----------------------------

    shadowProducts[index] = updatedProduct;

    filteredProducts = [...shadowProducts];

    updated++;

    renderProducts();

    updateCounters();

    addActivity("Updated Product : " + updatedProduct.title);

    showToast("Product Updated");

    editModal.classList.add("hidden");
    editModal.classList.remove("flex");

    // ----------------------------
    // PUT Request
    // ----------------------------

    showLoading();

    try {

        const response = await fetch(API + "/" + currentEditId, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                title: updatedProduct.title,

                price: updatedProduct.price,

                brand: updatedProduct.brand,

                category: updatedProduct.category,

                description: updatedProduct.description

            })

        });

        if (!response.ok) {

            throw new Error("Update failed");

        }

        const data = await response.json();

        console.log("PUT Success");

        console.log(data);

    }

    catch (err) {

        console.log(err);

        // ----------------------------
        // Rollback
        // ----------------------------

        shadowProducts = backup;

        filteredProducts = [...shadowProducts];

        updated--;

        renderProducts();

        updateCounters();

        addActivity("Rollback : Update Failed");

        showToast("Update Failed");

    }

    hideLoading();

}