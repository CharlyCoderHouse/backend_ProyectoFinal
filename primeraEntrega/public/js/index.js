// Botón para agregar / Eliminar productos
const  addProduct = document.getElementById('addProduct')
addProduct.addEventListener('click', (event) => {
    window.location= "/realTimeProducts";
});
// Botón para ver lista de productos
const  viewProduct = document.getElementById('viewProduct')
viewProduct.addEventListener('click', (event) => {
    window.location= "/api/products";
});
