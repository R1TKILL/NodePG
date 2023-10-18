// Função para associar event listeners aos botões
function setupButtonListeners() {
    document.getElementById('btnInsert').addEventListener('click', () => {
        productManager.insertProduct();
    });

    document.getElementById('btnList').addEventListener('click', () => {
        productManager.readProducts();
    });

    document.getElementById('btnDelete').addEventListener('click', () => {
        productManager.deleteProduct();
    });

    document.getElementById('btnEdit').addEventListener('click', () => {
        productManager.editProduct();
    });

    document.getElementById('btnExit').addEventListener('click', () => {
        productManager.closeConnection();
    });
}


document.addEventListener('DOMContentLoaded', () => {
    setupButtonListeners();
    productManager.connectSQL();
    productManager.mainMenu();
});
