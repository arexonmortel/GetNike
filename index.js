//const { saveToDatabase } = require('./node.js');

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
  loadCart();
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














// Add an event listener to all "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll('.product button');
const order = document.querySelector('.order-count')

// Define an empty array to store the cart items
/* let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orderCount = parseInt(localStorage.getItem('orderCount')) || 0; */

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('orderCount', orderCount);

}

function loadCart() {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  orderCount = localStorage.getItem('orderCount') || 0;
  if(orderCount <= 0){
    orderCount = 0
    order.innerHTML = ""
    order.style.backgroundColor = 'transparent';
  } else {
    order.textContent = orderCount.toString();
    order.style.backgroundColor = '#C1DCDC';

  }
}
loadCart();

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

  // Create a pop-up with product details and quantity/size selection
  const popup = document.createElement('div');
  popup.classList.add('popup-div');

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

const optionsContainer = document.createElement('div');
optionsContainer.classList.add('options-container');

const sizeLabel = document.createElement('label');
sizeLabel.innerText = 'Size:';
optionsContainer.appendChild(sizeLabel);

const sizeSelect = document.createElement('select');
sizeSelect.name = 'size';
sizeSelect.id = 'size-select';
const sizes = ['38', '39', '40', '41', '42', '43', '44', '45', '46', '47'];
for (let i = 0; i < sizes.length; i++) {
  const option = document.createElement('option');
  option.value = sizes[i];
  option.text = sizes[i];
  sizeSelect.appendChild(option);
}
optionsContainer.appendChild(sizeSelect);

const quantityLabel = document.createElement('label');
quantityLabel.innerText = 'Quantity:';
optionsContainer.appendChild(quantityLabel);

const quantityInput = document.createElement('input');
quantityInput.type = 'number';
quantityInput.value = 1;
quantityInput.min = 1;
quantityInput.max = 10;
quantityInput.id = 'quantity-input';
optionsContainer.appendChild(quantityInput);

productDetails.appendChild(optionsContainer);

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
  const size = sizeSelect.value;
  const productObj = {
    productName: productName,
    quantity: quantity,
    price: productPrice,
    image: productImage,
    size: size
  };
  cart.push(productObj);
  orderCount++; // increment orderCount
  /*  order.textContent = orderCount.toString();
  order.style.backgroundColor = '#C1DCDC'; */

  /*  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('orderCount', orderCount); */
  saveCart();
  loadCart();
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



// Select the cart button and popup elements
const cartBtn = document.getElementById('order-cart-btn');
const popupOrder = document.getElementById('order-popup');
const closeBtn = document.querySelector('.order-close-btn');
const checkoutBtn = document.getElementById('order-checkout-btn');
const cartItems = document.getElementById('order-cart-items');
const totalPrice = document.getElementById('order-total-price');

// Add event listener to cart button
cartBtn.addEventListener('click', displayCart);

// Function to display the pop-up div
function displayCart() {
  loadCart();
  // Clear the current content of the cart items and total price
  cartItems.innerHTML = '';
  totalPrice.innerHTML = '';
  
  // Check if the cart is not empty
  if (cart.length !== 0) {
    // Loop through each item in the cart
    cart.forEach(item => {
      loadCart();
      // Create a div for the item and add it to the cart items container
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('order-cart-item');
      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.productName}">
        <div class="item-info">
          <h3>${item.productName}</h3>
          <p>₱ ${item.price}</p>
          <p>Quantity: ${item.quantity}</p>
          <button class="delete-btn">Delete</button>
        </div>
      `;
      cartItems.appendChild(itemDiv);
      
      // Add event listener to delete button
      const deleteBtn = itemDiv.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => {
        // Remove the item from the cart array
        const index = cart.indexOf(item);
        cart.splice(index, 1);
        orderCount--; 
        
        // Refresh the cart display
        saveCart();
        loadCart();
        displayCart();
      });
    });
    
    // Calculate and display the total price
    const prices = cart.map(item => item.price * item.quantity);
    const total = prices.reduce((acc, curr) => acc + curr);
    const formattedTotal = new Intl.NumberFormat('en-PH').format(total);
    totalPrice.innerHTML = `<h3>Total: ₱ ${formattedTotal}</h3>`;
    
    // Enable the checkout button
    checkoutBtn.disabled = false;
  } else {
    loadCart();
    // If the cart is empty, display a message and disable the checkout
    const emptyCartMsg = document.createElement('p');
    emptyCartMsg.innerText = 'Your cart is empty.';
    cartItems.appendChild(emptyCartMsg);

    // Disable the checkout button
    checkoutBtn.disabled = true;
  }
  
  // Display the popup
  popupOrder.style.display = 'block';
}


// Add event listener to close button
closeBtn.addEventListener('click', hideCart);

// Function to hide the pop-up div
function hideCart() {
  loadCart();
  popupOrder.style.display = 'none';
}






checkoutBtn.addEventListener('click', () => {
  // Create popup form
  
  const popup = document.createElement('div');
  popup.classList.add('popup-checkout');
  popup.style.zIndex = '9999';
  popup.style.height = '500px';
  popup.style.overflowY = 'scroll';
  popupOrder.style.display ='none'

 

  const cartCheckout = JSON.parse(localStorage.getItem('cart')) || [];

  // Create form element
  const form = document.createElement('form');
  form.setAttribute('id', 'checkout-form');
  form.setAttribute('method', 'POST'); 
  form.setAttribute('action', '/submit');  

  // Create inputs for name, address, phone, and email
  const nameInput = createInput('text', 'Name', 'Enter your name');
  nameInput.querySelector('input').name = 'name';
  nameInput.setAttribute('id', 'nameInput');

  const addressInput = createInput('text', 'Complete Address', 'Enter your delivery address');
  addressInput.querySelector('input').name = 'address';
  addressInput.setAttribute('id', 'addressInput');

  const phoneInput = createInput('tel', 'Phone', 'Enter your phone number');
  phoneInput.querySelector('input').name = 'phone';
  phoneInput.setAttribute('id', 'phoneInput');

  const emailInput = createInput('email', 'Email', 'Enter your email address');
  emailInput.querySelector('input').name = 'email';
  emailInput.setAttribute('id', 'emailInput');

  
  // Create cancel icon
  const cancelIcon = document.createElement('i');
  cancelIcon.classList.add('fa', 'fa-times');
  cancelIcon.addEventListener('click', () => {
    popup.remove();
  });
  
  // Create product preview table
  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Size</th>
        <th>Quantity</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      ${cartCheckout.map(item => `
        <tr>
          <td><img src="${item.image}" alt="${item.productName}" width="50"></td>
          <td>${item.productName}</td>
          <td>${item.size}</td>
          <td>${item.quantity}</td>
          <td>₱${item.price}</td>
        </tr>
      `).join('')}
      <tr>
        <td colspan="4"><strong>Total:</strong></td>
        <td>₱${cartCheckout.reduce((total, item) => total + (item.price * item.quantity), 0)}</td>
      </tr>
    </tbody>
  `;

  // Add inputs and table to form
  form.appendChild(nameInput);
  form.appendChild(addressInput);
  form.appendChild(phoneInput);
  form.appendChild(emailInput);
  form.appendChild(table);

  // Create submit button
  const submitBtn = document.createElement('button');
  submitBtn.setAttribute('type', 'submit');
  submitBtn.textContent = 'Place Order';
  submitBtn.setAttribute('id', 'submit-btn');

  // Add form and submit button to popup
  popup.appendChild(cancelIcon);
  popup.appendChild(form);
  popup.appendChild(submitBtn);
  
  // Add popup to document
  document.body.appendChild(popup);

  
  
  
  /* submitBtn.addEventListener('click', ()=>{
    
    fetch('http://localhost:3000/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cart)
  }).then(response => {
    // Handle response from server
  });

  //checkoutForm.submit();
  console.log("click")
  form.submit();
  localStorage.removeItem('cart');
  localStorage.removeItem('orderCount');
  popup.remove();
  console.log("submitted")
  loadCart();

  
}) */

const checkoutForm = document.getElementById('checkout-form');
const customerName = document.getElementById('nameInput');
const customerAddress = document.getElementById('addressInput');
const customerPhone = document.getElementById('phoneInput');
const customerEmail = document.getElementById('emailInput');


let savedName = '';
let savedAddress = '';
let savedPhone = '';
let savedEmail = '';

// Function to check if all input fields are filled
function checkAllInputsFilled() {
  return (
    customerName.value !== '' &&
    customerAddress.value !== '' &&
    customerPhone.value !== '' &&
    customerEmail.value !== ''
  );
}

// Function to enable/disable the submit button
function updateSubmitButtonState() {
  submitBtn.disabled = !checkAllInputsFilled();
}

// Event listeners for input fields
customerName.addEventListener('input', (event) => {
  savedName = event.target.value;
  updateSubmitButtonState();
});

customerAddress.addEventListener('input', (event) => {
  savedAddress = event.target.value;
  updateSubmitButtonState();
});

customerPhone.addEventListener('input', (event) => {
  savedPhone = event.target.value;
  updateSubmitButtonState();
});

customerEmail.addEventListener('input', (event) => {
  savedEmail = event.target.value;
  updateSubmitButtonState();
});

submitBtn.disabled = !checkAllInputsFilled() ? true : false;


submitBtn.addEventListener('click', (event) => {
  event.preventDefault();
  if (!checkAllInputsFilled()) {
    // Disable the "Place Order" button if any input field is empty
    submitBtn.disabled = true;
    return; // Exit the function
  } else {
    submitBtn.disabled = false;
  }

  const customerDetails = {
    name: savedName,
    address: savedAddress,
    phone: savedPhone,
    email: savedEmail
  };

  // Extract order items from the form, e.g., using DOM manipulation
  const orderList = [];

  for (let i = 0; i < cartCheckout.length; i++) {
    const itemName = cartCheckout[i].productName;
    const quantity = cartCheckout[i].quantity;
    const price = cartCheckout[i].price;
    const image = cartCheckout[i].image;
    const size = cartCheckout[i].size;

    const orderItem = {
      itemName,
      quantity,
      price,
      image,
      size
    };
    orderList.push(orderItem);
  }

  const data = {
    customer: customerDetails,
    order: orderList
  };

  fetch('http://localhost:3000/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.text())
    .then((orderSummaryHTML) => {
      // Store the order summary HTML in local storage
      localStorage.setItem('orderSummaryHTML', orderSummaryHTML);
      // Redirect the user to the order summary page
      window.location.href = 'order-summary.html';
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle any errors that occurred during the request
    });

  localStorage.removeItem('cart');
  localStorage.removeItem('orderCount');
  popup.remove();
  console.log('submitted');
  loadCart();
});





});

function createInput(type, label, placeholder) {
  const div = document.createElement('div');
  const input = document.createElement('input');
  const labelEl = document.createElement('label');
  
  div.classList.add('form-group');
  
  input.setAttribute('type', type);
  input.setAttribute('name', label.toLowerCase());
  input.setAttribute('placeholder', placeholder);
  input.setAttribute('required', '');
  
  labelEl.textContent = label;
  labelEl.setAttribute('for', label.toLowerCase());
  
  div.appendChild(labelEl);
  div.appendChild(input);
  
  return div;
}

