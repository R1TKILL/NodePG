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
        console.clear();
        console.log("************************************************************************");
        console.log("*                     ***Bem-vindo à Lista de Produtos***               *");
        console.log("*                                                                      *");
        console.log("* 1 - Inserir um novo produto                                        *");
        console.log("* 2 - Listar todos os produtos                                       *");
        console.log("* 3 - Excluir um produto                                            *");
        console.log("* 4 - Editar um produto                                             *");
        console.log("* 5 - Sair                                                           *");
        console.log("*                                                                      *");
        console.log("************************************************************************\n\n");
        
        const choice = prompt("Digite a sua escolha: ");
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
                this.closeConnection();
                break;
            default:
                console.log("Escolha inválida. Por favor, tente novamente.");
                this.mainMenu();
        }
    }

    async insertProduct() {
        const productName = prompt("Digite o nome do novo produto: ");
        try {
            const query = "INSERT INTO products (name_product) VALUES ($1)";
            await db.query(query, [productName]);
            console.log("Produto inserido com sucesso.");
        } catch (error) {
            console.log("Erro ao inserir o produto:", error);
        }
        this.mainMenu();
    }

    async readProducts() {
        try {
            const result = await db.query('SELECT name_product FROM products');
            console.clear();
            console.log("Lista de Produtos:");
            result.rows.forEach((product, index) => {
                console.log(`[${index + 1}] ${product.name_product}`);
            });
        } catch (error) {
            console.log("Erro ao ler os produtos:", error);
        }
        prompt("Pressione Enter para retornar ao menu principal...");
        this.mainMenu();
    }

    async deleteProduct() {
        const productName = prompt("Digite o nome do produto que deseja remover: ");
        try {
            const query = "DELETE FROM products WHERE name_product = ($1)";
            await db.query(query, [productName]);
            console.log("Produto excluído com sucesso.");
        } catch (error) {
            console.log("Erro ao excluir o produto:", error);
        }
        this.mainMenu();
    }

    async editProduct() {
        const currentName = prompt("Digite o nome do produto que deseja editar: ");
        try {
            const checkQuery = "SELECT * FROM products WHERE name_product = ($1)";
            const result = await db.query(checkQuery, [currentName]);
            
            if (result.rows.length === 0) {
                console.log("Produto não encontrado. A operação de edição não pode ser realizada.");
            } else {
                const newName = prompt("Digite o novo nome do produto: ");
                const editQuery = "UPDATE products SET name_product = ($1) WHERE name_product = ($2)";
                await db.query(editQuery, [newName, currentName]);
                console.log("Produto editado com sucesso.");
            }
        } catch (error) {
            console.log("Erro ao editar o produto:", error);
        }
        this.mainMenu();
    }
}

const productManager = new ElectricProducts();
productManager.connectSQL();
productManager.mainMenu();
