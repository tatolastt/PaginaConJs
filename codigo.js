let carrito = [];
let totalApagar;
let seccionProds = document.getElementById("productos");
let botonRevertir = document.getElementById("vaciarCarrito");

const GuardarAlLocalStorage = (clave, valor) => { localStorage.setItem(clave,valor); }

const almacenados = JSON.parse(localStorage.getItem("carritooAuris"));

console.log(carrito);

function renderizar(){
    if(almacenados != null || almacenados != 0) {
        carrito = almacenados;
        carrito.forEach(auricular => {
            document.getElementById("tablaBody").innerHTML += `
        <tr>
            <td class="texto-center lineaTabla" >${auricular.nombre}</td>
            <td class="texto-center lineaTabla" > $${auricular.precio}</td>
        </tr>
        `
        });

        let totalApagar =  carrito.reduce((acumulador,auricularElegido) => acumulador + auricularElegido.precio,0);
        let total = document.getElementById("total");
        total.innerText = `total a pagar $${totalApagar}`;
    }
    else
    {
        carrito = [];
    }
}

renderizar();


function seccionProductos(){
    for(const auricular of productosAuris){
        seccionProds.innerHTML += `
        <button id="btn${auricular.id}" class="modelo modelo-${auricular.modelo}">
        <h3>${auricular.nombre}</h3>
        <p class="precio">$${auricular.precio}</p>
        </button>
        `
    }

    //evento
    productosAuris.forEach(auricular => {
        document.getElementById(`btn${auricular.id}`).addEventListener("click", function(){
            agregarAlCarrito(auricular);
        });
    })
}


seccionProductos();

function agregarAlCarrito(auricularElegido){
    carrito.push(auricularElegido);
    //subir al local storage
    GuardarAlLocalStorage("carritooAuris", JSON.stringify(carrito));
    console.log(carrito);
    alert("Agregaste " + auricularElegido.nombre + " al carrito");

    document.getElementById("tablaBody").innerHTML += `
    <tr>
        <td class="texto-center lineaTabla" >${auricularElegido.nombre}</td>
        <td class="texto-center lineaTabla" > $${auricularElegido.precio}</td>
    </tr>
    `;
    let totalApagar =  carrito.reduce((acumulador,auricularElegido) => acumulador + auricularElegido.precio,0);
    let total = document.getElementById("total");
    total.innerText = `total a pagar $${totalApagar}`;
};

//subir al local storage




botonRevertir.addEventListener("click", vaciarCarrito);

function vaciarCarrito(){
    productosAuris.forEach(auricular => {
        carrito.pop(auricular);
    });
    alert("Carrito vaciado");
    document.getElementById("tablaBody").innerHTML = "";
    totalApagar = 0;
    let total = document.getElementById("total");
    total.innerText = `total a pagar ${totalApagar}`;
    GuardarAlLocalStorage("carritooAuris", JSON.stringify(carrito));
    
}




