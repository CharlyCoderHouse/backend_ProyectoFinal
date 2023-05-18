const categSel = document.getElementById('categSel1')
if(categSel){

    const prueba = categSel.options[categSel.selectedIndex].text;
    console.log(prueba);
/* let changeCate = () => {
    if (categSel.value === "c1" ){
        const query = "" 
        console.log(query);
    }else{
        const query = categSel.text
        console.log(query);
    } 
    //console.log(query);
    window.location= "/api/products?"+`${query}`;
}  */
categSel.addEventListener('change', (event) => {
    let query ="";
    if (categSel.options[categSel.selectedIndex].value !== "c1" ){
        query = categSel.options[categSel.selectedIndex].text
        console.log(query);
    } 
    //console.log(query);
    window.location= "/api/products?query:"+`${query}`;
    console.log(categSel);
 }); 
} 


// Botón para ir al HOME
let goHome = document.getElementById('goHome')
if(goHome){
    goHome.addEventListener('click', (event) => {
        console.log(goHome);
        window.location= "/";
    });
}
// Botón para agregar productos
const addProduct = document.getElementById('addProduct')
if(addProduct){
    // addProduct.innerHTML = `<button id="addProduct" class="btn btn-secondary"> Ir a Cargar Productos</button>`
    addProduct.addEventListener('click', (event) => {
        window.location= "/realTimeProducts";
    });
}
// Botón para ver lista de productos
const viewProduct = document.getElementById('viewProduct')
if(viewProduct){
    // viewProduct.innerHTML = `<button id="viewProduct" class="btn btn-secondary"> Ver Productos</button>`
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
