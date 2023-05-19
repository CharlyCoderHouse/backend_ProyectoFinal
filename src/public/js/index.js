// Selector de Categoría
const categSel = document.getElementById('categSel1')
if(categSel){
    categSel.addEventListener('change', () => {
    if (categSel.options[categSel.selectedIndex].value === "c6" ){
        window.location= "/api/products";
    }else{
        const query = categSel.options[categSel.selectedIndex].text;
        window.location= "/api/products?query="+`${query}`;
    }; 
 }); 
}; 

// Selector de Orden de precio
const ordPri = document.getElementById('ordPri')
if(ordPri){
    ordPri.addEventListener('change', () => {
    let sort ="";
    if (ordPri.options[ordPri.selectedIndex].value === "v2" ){
        sort = 1; 
    }else if (ordPri.options[ordPri.selectedIndex].value === "v3" ){  
        sort = -1;
    } 
    window.location= "/api/products?sort="+`${sort}`;
 }); 
}; 
// Botón para ir al HOME
let goHome = document.getElementById('goHome')
if(goHome){
    goHome.addEventListener('click', (event) => {
        window.location= "/";
    });
}
// Botón para agregar productos
const addProduct = document.getElementById('addProduct')
if(addProduct){
    addProduct.addEventListener('click', (event) => {
        window.location= "/realTimeProducts";
    });
}
// Botón para ver lista de productos
const viewProduct = document.getElementById('viewProduct')
if(viewProduct){
    viewProduct.addEventListener('click', (event) => {
        window.location= "/api/products";
    });
}

// Botón para ir al chat
const viewChat = document.getElementById('viewChat')
if(viewChat){
    viewChat.addEventListener('click', (event) => {
        window.location= "/chat";
    });
}
