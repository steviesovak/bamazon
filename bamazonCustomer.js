var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host:"localhost",
	port:3306,
	user:"root",
	password:"",
	database:"BamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("=================================\n");
    console.log("Welcome to Bamazon!!");
    console.log("=================================\n");
    displayItems();
  });
  
  function displayItems() {
    connection.query("SELECT * FROM bamazonTable", function(err, res) {
  
      console.log("Items for sale:");
      console.log("\n=================================");

      for (i = 0; i < res.length; i++){
        console.log("++++++++++++++++++++");
        console.log("Item ID: " + res[i].item_id);
        console.log("Name: " + res[i].product_name);
        console.log("Category: " + res[i].department_name);
        console.log("Price: $" + res[i].price)
        console.log("Qty: " + res[i].stock_quantity)
      }
      console.log("++++++++++++++++++++\n");
      promptID();
    })
  };