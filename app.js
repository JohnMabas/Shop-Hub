// home........

const API = "https://dummyjson.com/products";

const grid = document.getElementById("productGrid");
const category = document.getElementById("categorySelect");
const search = document.getElementById("searchInput");
const page = document.getElementById("pageNumber");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");

// Load Categories
async function loadCategories() {
  const res = await fetch(API + "/categories");
  const data = await res.json();

  data.forEach((cat) => {
    category.innerHTML += `
<option value="${cat.slug || cat.name || cat}">
${cat.name || cat}
</option>
`;
  });
}

// Load Products
async function loadProducts() {
  const skip = (currentPage - 1) * limit;

  const res = await fetch(`${API}?limit=${limit}&skip=${skip}`);

  const data = await res.json();

  totalProducts = data.total;

  displayProducts(data.products);

  page.innerHTML = `Page ${currentPage} of ${Math.ceil(totalProducts / limit)}`;
}

// Display Products

function displayProducts(products) {
  grid.innerHTML = "";

  products.forEach((product) => {
    grid.innerHTML += `

<div class="bg-white rounded-xl shadow hover:shadow-lg duration-300">

<img
src="${product.thumbnail}"
class="w-full h-52 object-cover rounded-t-xl">

<div class="p-4">

<h2 class="font-bold text-lg truncate">
${product.title}
</h2>

<p class="text-green-600 font-bold mt-2">
$${product.price}
</p>

<p class="text-sm text-gray-500 mt-2 line-clamp-2">
${product.description}
</p>

<button
onclick="viewProduct(${product.id})"
class="bg-blue-600 text-white w-full mt-4 py-2 rounded hover:bg-blue-700">

View Details

</button>

</div>

</div>

`;
  });
}

// Product Details

async function viewProduct(id) {
  const res = await fetch(API + "/" + id);

  const p = await res.json();

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  modalContent.innerHTML = `

<img
src="${p.thumbnail}"
class="rounded-lg w-full h-64 object-cover">

<h2 class="text-2xl font-bold mt-4">
${p.title}
</h2>

<p class="text-gray-600 mt-3">
${p.description}
</p>

<p class="text-xl text-green-600 font-bold mt-3">
$${p.price}
</p>

<p class="mt-2">
 ${p.rating}
</p>

`;
}

// Close Modal

document.getElementById("closeModal").onclick = () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
};

// Pagination

let currentPage = 1;
const limit = 10;
let totalProducts = 0;

document.getElementById("nextBtn").onclick = () => {
  if (currentPage < Math.ceil(totalProducts / limit)) {
    currentPage++;

    loadProducts();
  }
};

document.getElementById("prevBtn").onclick = () => {
  if (currentPage > 1) {
    currentPage--;

    loadProducts();
  }
};

// Search

search.addEventListener("keyup", async () => {
  if (search.value == "") {
    loadProducts();

    return;
  }

  const res = await fetch(API + "/search?q=" + search.value);

  const data = await res.json();

  displayProducts(data.products);

  page.innerHTML = `Search Results`;
});

// Filter

category.addEventListener("change", async () => {
  if (category.value == "") {
    loadProducts();

    return;
  }

  const res = await fetch(API + "/category/" + category.value);

  const data = await res.json();

  displayProducts(data.products);

  page.innerHTML = category.value;
});

loadCategories();
loadProducts();
