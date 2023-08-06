var productsPerPage = 6;
var currentPage = 1;
var productsData;
var cart = [];
$(document).ready(function() {
  $.getJSON('data.json', function(data1) {
    productsData = data1.products;
    displayProducts(productsData, currentPage);
    $('#searchInput').on('input', function() {
      var searchTerm = $(this).val();
      searchProducts(searchTerm);
    });
    $('#home').click(function() {
      $('#searchInput').val('');
      displayProducts(productsData, 1);
    });
    $(document).on('click', '.add-to-cart', function() {
      var productId = $(this).data('product-id');
      addToCart(productId);
    });

    $('#cart').click(function() {
      displayCartItems();
    });
    $(document).on('click', '.remove-from-cart', function() {
      var productId = $(this).data('product-id');
      removeFromCart(productId);
    });
    $('#categoryFilter').change(function() {
      var selectedCategory = $(this).val();
      filterProductsByCategory(selectedCategory);
    });
    $('#sortProducts').change(function() {
      var sortBy = $(this).val();
      sortProductsByPrice(sortBy);
    });
  });
});


function displayProducts(products, page) {
  var startIndex = (page - 1) * productsPerPage;
  var endIndex = startIndex + productsPerPage;
  var productListDiv = $('#product-list');
  productListDiv.empty();
  for (var i = startIndex; i < endIndex && i < products.length; i++) {
    var product = products[i];
    var productDiv = $('<div class="product">');
    productDiv.append(`<h2>${product.name}</h2>`);
    productDiv.append(`<img src="${product.image}" width="160" height="140">`);
    productDiv.append(`<p>Brand: ${product.brand}</p>`);
    productDiv.append(`<p>Category: ${product.category}</p>`);
    productDiv.append(`<p><b>Price: $${product.price}</b></p>`);

    // Check if the product is already in the cart
    var inCart = cart.some(item => item.id === product.id);

    // Create the button based on whether the product is in the cart or not
    var buttonContent = inCart ? 'Remove from Cart' : 'Add to Cart';
    var buttonClass = inCart ? 'remove-from-cart' : 'add-to-cart';

    var cartButton = $(`<button class="${buttonClass}" data-product-id="${product.id}" style="height:30px;width:140px;background-color: blue;color: white;">${buttonContent}</button>`);
    productDiv.append(cartButton);

    productListDiv.append(productDiv);
  }
  createPagination(products.length, page);
}

function createPagination(totalProducts, currentPage) {
  var totalPages = Math.ceil(totalProducts / productsPerPage);
  var paginationDiv = $('#pagination');
  paginationDiv.empty();
  for (var i = 1; i <= totalPages; i++) {
    var pageButton = $(`<button style=" background-color: #ff9900;color: #ffffff;width:30px;height:30px;">${i}</button>`);
    if (i === currentPage) {
      pageButton.addClass('active');
    }
    pageButton.click(function() {
      currentPage = parseInt($(this).text());
      displayProducts(productsData, currentPage);
    });
    paginationDiv.append(pageButton);
  }
}
function searchProducts(searchTerm) {
  var filteredProducts = productsData.filter(product => {
    return product.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  displayProducts(filteredProducts, 1);
}
function addToCart(productId) {
  alert('Item added to cart!');
  console.log('Adding to cart, product ID:', productId);
  var existingProduct = cart.find(product => product.id === productId);
  if (!existingProduct) {
    var product = productsData.find(product => product.id === productId);
    if (product) {
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }
}


function displayCartItems() {
  displayProducts(cart, 1);
}

function removeFromCart(productId) {
  console.log('Removing from cart, product ID:', productId);
  var index = cart.findIndex(product => product.id === productId);
  console.log('Index:', index);
  if (index !== -1) {
    cart.splice(index, 1);
    console.log('Updated cart:', cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
  }
}
function filterProductsByCategory(category) {
  if (category === '') {
    displayProducts(productsData, currentPage);
  } else {
    var filteredProducts = productsData.filter(product => product.category === category);
    displayProducts(filteredProducts, 1);
  }
}
function sortProductsByPrice(sortBy) {
  if (sortBy === 'lowToHigh') {
    productsData.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'highToLow') {
    productsData.sort((a, b) => b.price - a.price);
  }

  displayProducts(productsData, currentPage);
}






