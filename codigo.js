const carrito = [];
let totalApagar;
let seccionProds = document.getElementById("productos");

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
    console.log(carrito);
    alert("Agregaste " + auricularElegido.nombre + " al carrito");

    document.getElementById("tablaBody").innerHTML += `
    <tr>
        <td class="texto-center lineaTabla" >${auricularElegido.nombre}</td>
        <td class="texto-center lineaTabla" > $${auricularElegido.precio}</td>
    </tr>
    `;
    totalApagar += carrito.reduce((acumulador,auricularElegido) => acumulador + auricularElegido.precio,0);
    let total = document.getElementById("total");
    total.innerText = `total a pagar ${totalApagar}`;
};

