const http = require('http');
const querystring = require('querystring');
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',    // MySQL server host
  user: 'root', // MySQL username
  password: '', // MySQL password
  database: 'Order' // Name of the database to connect to
});


// Connect to MySQL server
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL:', error);
    return;
  }

  // Create customer table
  const createCustomerTableQuery = `
    CREATE TABLE IF NOT EXISTS customer (
      orderNumber VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(255) NOT NULL
    )
  `;

  connection.query(createCustomerTableQuery, (error) => {
    if (error) {
      console.error('Error creating customer table:', error);
    }
  });

  // Create order_items table
  const createOrderItemsTableQuery = `
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      itemName VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      image LONGBLOB NOT NULL,
      size VARCHAR(50) NOT NULL,
      orderNumber VARCHAR(50),
      FOREIGN KEY (orderNumber) REFERENCES customer(orderNumber)
    )
  `;

  connection.query(createOrderItemsTableQuery, (error) => {
    if (error) {
      console.error('Error creating order_items table:', error);
    }
  });
});

// ...





app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());


app.post('/submit', (req, res) => {
  const customerDetails = req.body.customer;
  const orderList = req.body.order;
  const orderNumber = Date.now().toString(); // Generate a unique order number

  const { name, address, phone, email } = customerDetails;




  // Insert into the customer table
  const insertCustomerQuery = `
    INSERT INTO customer (orderNumber, name, address, phone, email)
    VALUES (?, ?, ?, ?, ?)
  `;
  connection.query(insertCustomerQuery, [orderNumber, name, address, phone, email], (error) => {
    if (error) {
      console.error('Error inserting into customer table:', error);
      return res.status(500).send('Error inserting into customer table');
    }

    // Prepare the values for insertion into the order_items table
    const orderItemValues = orderList.map((orderItem) => [
      orderItem.itemName,
      orderItem.quantity,
      orderItem.price,
      orderItem.image,
      orderItem.size,
      orderNumber
    ]);

    // Insert into the order_items table
    const insertOrderItemsQuery = `
      INSERT INTO order_items (itemName, quantity, price, image, size, orderNumber)
      VALUES ?
    `;
    connection.query(insertOrderItemsQuery, [orderItemValues], (error) => {
      if (error) {
        console.error('Error inserting into order_items table:', error);
        return res.status(500).send('Error inserting into order_items table');
      }

      // Prepare the response message
      const responseMessage = 'Order submitted successfully';
    });
  });




  // Build the order summary HTML
  let orderSummaryHTML = `
    <html>
      <head>
        <title>Order Summary</title>
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Prompt:wght@300;400;500;600;700;800;900&display=swap');


        :root {
            --primary-color:  #C1DCDC;
            --title-color: #1E1E1E;
            --nav-title-color: rgba(30, 30, 30, 0.5);
            --hover: #a2dada;
            --card-background:#c1dcdc9b;
            --secondary-card-background:linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
            linear-gradient(0deg, #FFFFFF, #FFFFFF);
            
            
        
          }
  body {
    background-color: #f2f2f2;
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 50px;
    font-size: 16px; /* Adjust the base font size */
  }
  h1 {
    font-size: 24px; /* Decrease the heading font size */
    margin-bottom: 20px;
  }
  p {
    font-size: 18px; /* Decrease the paragraph font size */
    margin-bottom: 15px; /* Reduce the margin for paragraphs */
  }
  a {
    font-size: 16px; /* Decrease the link font size */
    display: inline-block;
    background-color: #4CAF50;
    color: #fff;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  a:hover {
    background-color: #3e8e41;
  }
  img {
    max-width: 100px;
  }
  .order-item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    width: 50%
  }
  .order-item-image {
    display: flex;
    align-items: center;
    justify-content; center;
    width: 50%
  }
  .total-amount {
    font-size: 22px; /* Decrease the total amount font size */
    font-weight: bold;
    margin-top: 30px;
  }
 
  .order-items-container {
    margin-left: -20px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content; space-between;
    flex-direction: column;
    gap: 1rem;
    width: 100%;

  } 
</style>

      </head>
      <body>
        <h1>Thank you for your order, ${name}!</h1>
        <h2>Order Summary:</h2>
  `;

// Add order items to the order summary
orderSummaryHTML += `
  <p><strong>Order Items:</strong></p>
  <div class="order-items-container">`;
  let totalPrice = 0;
orderList.forEach((orderItem) => {
  const { itemName, quantity, price, image, size } = orderItem;
  
  orderSummaryHTML += `
    <div class="order-item">
      <img src="${image}" alt="${itemName}" class="order-item-image" />
      <div>
        <p><strong>Item Name:</strong> ${itemName}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Price:</strong> ₱${price}</p>
        <p><strong>Size:</strong> ${size}</p>
      </div>
    </div>
  `;
  totalPrice += parseFloat(price) * parseInt(quantity);
});
orderSummaryHTML += `</div>`;

// Display the total amount
orderSummaryHTML += `
  <p class="total-amount">Total Amount: ₱${totalPrice.toFixed(2)}</p>
`;

// Add order confirmation and tracking information

orderSummaryHTML += `
  <p>Your order has been submitted successfully.</p>
  <p><strong>Order Tracking Number:</strong> ${orderNumber}</p>
  <a href="#" onclick="javascript:history.back();">Continue shopping</a>
`;


  // Close the HTML document
  orderSummaryHTML += `
    </body>
    </html>
  `;

  // Send the order summary HTML as the response
  res.send(orderSummaryHTML);


  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
