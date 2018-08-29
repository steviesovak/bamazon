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

