const db = require('./database_drive');
const insert = require('prompt-sync')({ sigint: true });


class EletricProducts {

    constructor() {
        this.controlMenu = null; // Menu principal
        
        this.sqlValue1 = null; // Valor que será inserido no banco de dados
        
        this.sqlValue2 = null; // Valor que será inserido no banco de dados
    }

    async connectSQL() {
        await db.connect();
    }

    async closeConnection() {
        await db.end();
    }

    async mainMenu(connectSqlDrive) {
        if (connectSqlDrive === 1) {
            this.connectSQL();
        }

        console.clear();
        console.log("************************************************************************");
        console.log("*                     ***Welcome the list items***                     *");
        console.log("*                                                                      *");
        console.log("*                                                                      *");
        console.log("* 1 - Insert a new item.                                              *");
        console.log("* 2 - List all items.                                                 *");
        console.log("* 3 - Delete item.                                                    *");
        console.log("* 4 - Edit item.                                                      *");
        console.log("* 5 - Exit.                                                           *");
        console.log("*                                                                      *");
        console.log("************************************************************************\n\n");
        this.controlMenu = insert("Choice: ");

        if (this.controlMenu == 0) {
            this.mainMenu();
        } else if (this.controlMenu == 1) {
            console.clear();
            console.log("\n\n\n");
            this.sqlValue1 = insert("Enter the name of the new product ==> ");
            this.InsertProducts(this.sqlValue1);
            this.mainMenu(3); //1
        } else if (this.controlMenu == 2) {
            this.ReadProducts();
        } else if (this.controlMenu == 3) {
            console.clear();
            console.log("\n\n\n");
            this.sqlValue1 = insert("Enter the name of the product you want to remove ==> ");
            this.DropProducts(this.sqlValue1);
            this.mainMenu(3); //1
        } else if (controlMenu == 4) {
            console.clear();
            console.log("\n\n\n");
            this.sqlValue1 = insert("Enter the new value to be placed ==> ");
            console.log("\n\n");
            this.sqlValue2 = insert("Enter the name of the product to be changed ==> ");
            this.EditProducts(this.sqlValue1, this.sqlValue2);
            this.mainMenu(3); //1
        } else if (controlMenu == 5) {
            this.closeConnection(); // Encerrar a conexão com o banco de dados.
        } else {
            this.mainMenu();
        }
    }

    async InsertProducts(value) {
        const queryEvent = "INSERT INTO products (name_product) VALUES  ($1)";
        await db.query(queryEvent, [value]);
    }

    async ReadProducts() {
        console.clear();
        let rowCount = 1;
        let resultDates = await db.query('SELECT name_product FROM products');

        console.log("-----------------------");
        resultDates.rows.map((element) => {
            console.log("|" + (rowCount++) + "|>> " + element.name_product + " <<|");
        });
        console.log("-----------------------\n\n");
        this.controlMenu = insert("Press ENTER to return");
        this.mainMenu(3);
    }

    async DropProducts(value) {
        const queryEvent = "DELETE FROM products WHERE name_product = ($1)";
        await db.query(queryEvent, [value]);
    }

    async EditProducts(value, value2) {
        const queryEvent = "UPDATE products SET name_product = ($1) WHERE name_product = ($2)";
        await db.query(queryEvent, [value, value2]);
    }
}

const obj = new EletricProducts();
obj.mainMenu(1);
