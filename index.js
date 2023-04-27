const navLinks = document.querySelectorAll('.nav-pages');
const mainSection = document.querySelector('main');

const product = document.querySelectorAll('.card-shoe')
const explore = document.querySelector('.explore')
const seemoreBtn = document.querySelector('.see-more')
const bestSelling = document.querySelectorAll('.card')

explore.addEventListener('click', changeToProductPage)
seemoreBtn.addEventListener('click', changeToProductPage)
bestSelling.forEach( shoe =>{
  shoe.addEventListener('click', changeToProductPage)

})
product.forEach( shoe =>{
  shoe.addEventListener('click', changeToProductPage)

})

function changeToProductPage(){
  const productSection = document.querySelector('#all-product-section');
  document.querySelectorAll('section:not(#all-product-section)').forEach(section => {
    section.style.display = 'none';
  });
  productSection.classList.add('active');
  productSection.style.display = 'flex';

  const productLink = document.querySelector('#product-page');
  navLinks.forEach(link => {
    link.classList.remove('active');
  });
  productLink.classList.add('active');
}


window.addEventListener('load', () => {
  const homeSection = document.querySelector('#landing-page');
  document.querySelectorAll('section:not(#landing-page)').forEach(section => {
    section.style.display = 'none';
  });
  homeSection.classList.add('active');
  homeSection.style.display = 'flex';

  const homeLink = document.querySelector('#home');
  navLinks.forEach(link => {
    link.classList.remove('active');
  });
  homeLink.classList.add('active');
  
});



navLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    const url = link.getAttribute('href');
    // Hide all sections except the one with the ID matching the URL
    document.querySelectorAll('section:not(' + url + ')').forEach(section => {
      section.style.display = 'none';
    });
    // Show the section with the ID matching the URL
    const targetSection = document.querySelector(url);
    targetSection.classList.add('active');
    targetSection.style.display = 'flex';

    // remove .active class from all links
    navLinks.forEach(link => {
      link.classList.remove('active');
    });

    // add .active class to clicked link
    link.classList.add('active');
  });
});











// Define an empty array to store the cart items
let cart = [];
let orderCount = 0;

// Add an event listener to all "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll('.product button');
const order = document.querySelector('.order-count')



addToCartButtons.forEach(button => {
  button.addEventListener('click', addToCart);
});

// Function to add product to the cart array
function addToCart(event) {
  // Get the product details
  const product = event.target.parentElement;
  const productName = product.querySelector('h3').innerText;
  const productImage = product.querySelector('img').src;

  const priceElement = product.querySelector('.price'); // Select the .price element within the product
  const priceString = priceElement.innerText.trim(); // Get the inner text and remove any leading/trailing whitespace
  const productValue = parseFloat(priceString.replace(/[^\d.]/g, '')); // Remove all non-numeric characters except the decimal point and convert to float
  const decimalPlaces = (priceString.split('.')[1] || []).length; // Get the number of decimal places
  const productPrice = productValue.toFixed(decimalPlaces);
  
  // Create a pop-up with product details and quantity selection
  const popup = document.createElement('div');
  popup.classList.add('popup');
  
  const productInfo = document.createElement('div');
  productInfo.classList.add('product-info');
  
  const productImg = document.createElement('img');
  productImg.src = productImage;
  productInfo.appendChild(productImg);
  
  const productDetails = document.createElement('div');
  productDetails.classList.add('product-details');
  
  const productNameElement = document.createElement('h3');
  productNameElement.innerText = productName;
  productDetails.appendChild(productNameElement);
  
  const productPriceElement = document.createElement('p');
  const formattedPrice = new Intl.NumberFormat('en-PH').format(productPrice);
  productPriceElement.innerText = `₱ ${formattedPrice}`;
  productDetails.appendChild(productPriceElement);
  

  const quantityLabel = document.createElement('label');
  quantityLabel.innerText = 'Quantity:';
  productDetails.appendChild(quantityLabel);
  
  const quantityInput = document.createElement('input');
  quantityInput.type = 'number';
  quantityInput.value = 1;
  quantityInput.min = 1;
  quantityInput.max = 10;
  productDetails.appendChild(quantityInput);
  
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');
  
  const cancelButton = document.createElement('button');
  cancelButton.innerText = 'Cancel';
  cancelButton.addEventListener('click', () => {
    popup.remove();
  });
  buttonsContainer.appendChild(cancelButton);
  
  const placeOrderButton = document.createElement('button');
  placeOrderButton.innerText = 'Place Order';
  placeOrderButton.addEventListener('click', () => {
    const quantity = parseInt(quantityInput.value);
    const productObj = {
      name: productName,
      quantity: quantity,
      price: productPrice,
      image: productImage
    };
    cart.push(productObj);
    orderCount++; // increment orderCount
    order.textContent = orderCount.toString();
    order.style.backgroundColor = '#C1DCDC';

    console.log(orderCount)
    popup.remove();
    console.log(cart); // Remove this line after testing
  });
  buttonsContainer.appendChild(placeOrderButton);
  
  productDetails.appendChild(buttonsContainer);
  productInfo.appendChild(productDetails);
  popup.appendChild(productInfo);
  
  document.body.appendChild(popup);
}
