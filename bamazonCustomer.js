var mysql = require("mysql");
var inquirer = require("inquirer");

//create the connection information for the sql database

var connection = mysql.createConnection({
	host:"localhost",
	port:3306,
	user:"root",
	password:"",
	database:"BamazonDB"
});

//connect to the mysql server and sql database

connection.connect(function(err) {
    if (err) throw err;
    console.log("====================================\n");
    console.log("Welcome to Bamazon!!");
    console.log("====================================\n");
    displayItems();
  });

  //function to display all items in Bamazon Shop
  
  function displayItems() {
    connection.query("SELECT * FROM bamazonTable", function(err, res) {
  
      console.log("Items for sale:");
      console.log("\n=====================================");

      for (i = 0; i < res.length; i++){
        console.log("+++++++++++++++++++++++");
        console.log("Item ID: " + res[i].item_id);
        console.log("Name: " + res[i].product_name);
        console.log("Category: " + res[i].department_name);
        console.log("Price: $" + res[i].price)
        console.log("Qty: " + res[i].stock_quantity)
      }
      console.log("+++++++++++++++++++++++\n");
      promptID();
    })
  };

  //function to prompt shopper which item they want to buy

  function promptID() {
    inquirer.prompt([
    {
      name: "promptID",
      message: "To purchase an item, enter the product ID"
    }])
    .then(function(answers) {
  
      var itemID = answers.promptID;
  
      if (answers.promptID > 10 || answers.promptID < 1) {
        console.log("Please enter an existing product ID")
        promptID();
      }
  
      connection.query("SELECT * FROM bamazonTable where item_id=" + itemID, function(err, res) {
  
  
        if (res[0].stock_quantity == 0){
          console.log("Sorry, this item is out of stock.");
          promptID();
        }
        else {
          console.log("\nYou selected:");
          console.log("\n====================================");
          console.log("Item ID: " + res[0].item_id);
          console.log("Name: " + res[0].product_name);
          console.log("Category: " + res[0].department_name);
          console.log("Price: $" + res[0].price)
          console.log("Qty: " + res[0].stock_quantity)
          console.log("\n====================================");
          promptQty(itemID)
        }
        
      })
    });
  };

  //function to prompt shopper to give qty of the item they want to buy
  
  function promptQty(itemID) {
    inquirer.prompt([
    {
      name: "promptQty",
      message: "How many of these would you like to buy?"
    }])
    .then(function(answers){
      var quantity = answers.promptQty;
  
      connection.query("SELECT * FROM bamazonTable where item_id=" + itemID, function(err, res) {
        
        var stockQuantity = res[0].stock_quantity;
        var productName = res[0].product_name;
        var productPrice = res[0].price;
        var total = res[0].price * quantity;
  
    // based on their qty answer
        
        if (quantity > stockQuantity){
          console.log("Sorry! There are only " + stockQuantity + " available");
          promptQty(itemID);
        }
        else {
          
          // if they want a qty of 1
          if (quantity === 1){
            console.log("+++++++++++++++++++++++\n");
            console.log("Thank you for shopping with Bamazon.");
            console.log("You ordered " + quantity + " " + productName + " for $" + productPrice + ".");
            console.log("Your total is $" + total + ".");
            console.log("++++++++++++++++++++++++\n");

  
            updateQty(itemID, productName, quantity, stockQuantity)
            confirm();
          }

          //if they want a qty greater than 1
          else if (quantity > 1){
            console.log("++++++++++++++++++++++++\n");
            console.log("Thank you for shopping with Bamazon.");
            console.log("You ordered " + quantity + " " + productName + "s for $" + productPrice + " each.");
            console.log("Your total is $" + total + ".");
            console.log("++++++++++++++++++++++++\n");

  
            updateQty(itemID, productName, quantity, stockQuantity)
            confirm();
          }
          else if (quantity == 0){
            console.log("You typed 0...Did you mean to order nothing??");
            confirm();
          }
          else {
            console.log("Please enter a valid quantity to continue.");
            promptQty(itemID);
          }
        }
      })
    })  
  };

  //function to update quantity available 
  
  function updateQty(itemID, productName, quantity, stockQuantity) {
  
    var updatedQuantity = stockQuantity - quantity;
    console.log("===================");
    console.log("ItemID: " + itemID);
    console.log("There was " + stockQuantity);
    console.log("You Bought " + quantity);
    console.log("There are now " + updatedQuantity);
    console.log("===================");
  
    var sql = "UPDATE bamazonTable SET stock_quantity = '" + updatedQuantity + "' WHERE item_id = '" + itemID + "'";
    connection.query(sql , function (err, result) {
      if (err) throw err;
    });
  }

  //confirm function
  
  function confirm() {
    inquirer.prompt([
    {
      name: "confirm",
      message: "Press any key to continue."
    }])
    .then(function(answers){
      var confirm = answers.confirm;
      displayItems();
    })
  };
  


