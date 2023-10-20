const db = require('./database_drive');
const prompt = require('prompt-sync')({ sigint: true });

class ElectricProducts {
    constructor() {
        this.sqlValue1 = null;
        this.sqlValue2 = null;
    }

    async connectSQL() {
        await db.connect();
    }

    async closeConnection() {
        await db.end();
    }

    async mainMenu() {
        console.clear()
        console.log("************************************************************************")
        console.log("*                     ***Welcome the list itens***                     *")
        console.log("*                                                                      *")
        console.log("* 1 - Insert the new iten.                                             *")
        console.log("* 2 - list all itens.                                                  *")
        console.log("* 3 - Delete iten.                                                     *")
        console.log("* 4 - Edit iten.                                                       *")
        console.log("* 5 - Exit.                                                            *")
        console.log("*                                                                      *")
        console.log("************************************************************************\n\n")
        
        let choice = prompt("Choose an option: ");
        this.handleChoice(choice);
    }

    async handleChoice(choice) {
        switch (choice) {
            case '1':
                this.insertProduct();
                break;
            case '2':
                this.readProducts();
                break;
            case '3':
                this.deleteProduct();
                break;
            case '4':
                this.editProduct();
                break;
            case '5':
                console.clear();
                this.closeConnection();
                break;
            default:
                this.mainMenu();
        }
    }

    async insertProduct() {
        console.clear();
        const productName = prompt("Insert the name of the new product: ");
        try {
            const query = "INSERT INTO products (name_product) VALUES ($1)";
            await db.query(query, [productName]);
        } catch (error) {
            console.log("Error to the inserting product in database: ", error);
        }
        this.mainMenu();
    }

    async readProducts() {
        try {
            const result = await db.query('SELECT name_product FROM products');
            console.clear();
            console.log("Product list:");
            result.rows.forEach((product, index) => {
                console.log(`[${index + 1}] ${product.name_product}`);
            });
        } catch (error) {
            console.log("Error reading products:", error);
        }
        prompt("Press ENTER to return for Main menu...");
        this.mainMenu();
    }

    async deleteProduct() {
        console.clear();
        const productName = prompt("Enter the name of the product you want to remove: ");
        try {
            const query = "DELETE FROM products WHERE name_product = ($1)";
            await db.query(query, [productName]);
        } catch (error) {
            console.log("Error deleting product: ", error);
        }
        this.mainMenu();
    }

    async editProduct() {
        console.clear();
        const currentName = prompt("Enter the name of the product you want to edit: ");
        try {
            const checkQuery = "SELECT * FROM products WHERE name_product = ($1)";
            const result = await db.query(checkQuery, [currentName]);
            
            if (result.rows.length === 0) {
                console.log("Product not found. Edit operation cannot be performed.");
            } else {
                const newName = prompt("\nEnter the new product name: ");
                const editQuery = "UPDATE products SET name_product = ($1) WHERE name_product = ($2)";
                await db.query(editQuery, [newName, currentName]);
            }
        } catch (error) {
            console.log("Error editing the product:", error);
        }
        this.mainMenu();
    }
}

const productManager = new ElectricProducts();
productManager.connectSQL();
productManager.mainMenu();
