
const API="https://dummyjson.com/products";

const featured=document.getElementById("featuredProducts");

const latest=document.getElementById("latestProducts");

const topRated=document.getElementById("topRatedProducts");

const loading=document.getElementById("loading");

function showLoading(){

loading.classList.remove("hidden");

loading.classList.add("flex");

}

function hideLoading(){

loading.classList.add("hidden");

loading.classList.remove("flex");

}

async function loadDashboard(){

showLoading();

const res=await fetch(API+"?limit=100");

const data=await res.json();

const products=data.products;

// Summary

document.getElementById("totalProducts").innerHTML=products.length;

const categories=[...new Set(products.map(p=>p.category))];

document.getElementById("totalCategories").innerHTML=categories.length;

const average=products.reduce((a,b)=>a+b.price,0)/products.length;

document.getElementById("averagePrice").innerHTML="$"+average.toFixed(0);

const highest=Math.max(...products.map(p=>p.rating));

document.getElementById("highestRating").innerHTML=highest;

// Featured

products.slice(0,8).forEach(product=>{

featured.innerHTML+=`

<div class="bg-white rounded-xl shadow hover:shadow-lg">

<img

src="${product.thumbnail}"

class="w-full h-52 object-cover rounded-t-xl">

<div class="p-4">

<h3 class="font-bold">

${product.title}

</h3>

<p class="text-green-600 font-bold mt-2">

$${product.price}

</p>

<p class="text-yellow-500 mt-2">

⭐ ${product.rating}

</p>

</div>

</div>

`;

});

// Latest

products.slice(-6).reverse().forEach(product=>{

latest.innerHTML+=`

<div class="bg-white rounded-xl shadow p-4 flex gap-4">

<img

src="${product.thumbnail}"

class="w-28 h-28 rounded object-cover">

<div>

<h3 class="font-bold">

${product.title}

</h3>

<p class="text-gray-500 mt-2">

${product.brand}

</p>

<p class="text-green-600 font-bold mt-2">

$${product.price}

</p>

</div>

</div>

`;

});

// Top Rated

products.sort((a,b)=>b.rating-a.rating)

.slice(0,6)

.forEach(product=>{

topRated.innerHTML+=`

<div class="bg-white rounded-xl shadow p-5">

<img

src="${product.thumbnail}"

class="w-full h-48 object-cover rounded">

<h3 class="font-bold mt-4">

${product.title}

</h3>

<p class="mt-2">

⭐ ${product.rating}

</p>

<p class="text-green-600 font-bold mt-2">

$${product.price}

</p>

</div>

`;

});

hideLoading();

}

loadDashboard();