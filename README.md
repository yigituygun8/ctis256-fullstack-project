# CTIS 256 Full-Stack Project

A full-stack web application for markets built for CTIS 256.

## Tech Stack

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js, Express.js
- Database: MySQL

## Quick Start

1. Clone this repository.
2. Install backend dependencies:
	- `npm install`
3. Create and configure your MySQL database.
4. Add your database credentials to your environment/config file.
5. Start the backend server:
	- `npm start`
6. Open the frontend in your browser.

## Problem:  
- The waste of expired products in markets poses a serious challenge in terms of efficient 
resource utilization. Many products are discarded before they are sold, resulting in financial losses for 
markets and unnecessary waste of valuable resources. This issue highlights the need for systems that can 
help reduce such waste. 

## Solution: 
- An information system that enables the sale of products nearing their expiration date at 
discounted prices can help reduce waste. In this way, markets can reduce product loss, while consumers 
benefit from lower prices, creating a win-win situation for both parties. 
## System Overview: 
- The system will have two types of users: market users and customers. Market users 
can add products nearing their expiration date to the system, including details such as the normal price, 
discounted price, and expiration date. Customers can search for products based on criteria such as district 
or product name and view nearby markets offering discounted items. They can also see how many days 
remain until a product’s expiration date.


INITIAL ENDPOINT DESIGNS:

PUBLIC ENDPOINTS:
GET  /
GET  /login
POST /login
GET  /register
POST /register
GET  /verify-email
POST /verify-email
POST /logout
GET  /products - list of all products that customer and market users can view
GET  /product/:id - details of a specific product

CONSUMER ENDPOINTS:
GET  /cart - view shopping cart contents
POST /cart/add - add product to cart
POST /cart/update - update product quantity in cart
POST /cart/remove - remove product from cart
POST /cart/purchase - complete purchase
GET  /profile - customer profile page
POST /profile/edit - update customer profile

MARKET ENDPOINTS:
GET  /dashboard - market overview and products list
GET  /dashboard/product/:id/new - form to add new product
POST /dashboard/product - create new product
GET  /dashboard/product/:id/edit - form to edit existing product
POST /dashboard/product/:id/edit - update existing product
POST /dashboard/product/:id/delete - delete existing product
GET  /dashboard/profile - market profile page
POST /dashboard/profile/edit - update market profile