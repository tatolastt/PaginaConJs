let carrito = [];
let totalApagar;
let aurisJSON=[];
let ofertaActiva = false;
let seccionProds = document.getElementById("productos");
let botonRevertir = document.getElementById("vaciarCarrito");

const GuardarAlLocalStorage = (clave, valor) => { localStorage.setItem(clave,valor); }

const almacenados = JSON.parse(localStorage.getItem("carritooAuris"));

console.log(carrito);


//obtener los datos del json 
async function obtenerDatos(){
    const URL = "/auriculares.json";
    const respuesta = await fetch(URL);
    const data = await respuesta.json();
    aurisJSON = data;
    seccionProductos();
    console.log(aurisJSON);
}

obtenerDatos();

function renderizar(){
    if(almacenados != null) {
        carrito = almacenados;

        if(JSON.parse(localStorage.getItem("oferta"))){
            ofertaActiva = true;
        }

        carrito.forEach(auricular => {
            document.getElementById("tablaBody").innerHTML += `
        <tr>
            <td class="texto-center lineaTabla" >${auricular.nombre}</td>
            <td class="texto-center lineaTabla" > $${auricular.precio}</td>
            <td><button class="btn botonEliminar" onclick="eliminar(event)">eliminar</button></td>
        </tr>
        `
        });

        let totalApagar =  carrito.reduce((acumulador,auricularElegido) => acumulador + auricularElegido.precio,0);
        let total = document.getElementById("total");
        total.innerText = `Total: $${totalApagar}`;
    }
    else
    {
        carrito = [];
    }
}

renderizar();



function ofertaPagina(){

    setTimeout(() => {
        if(ofertaActiva == false){
            Swal.fire({
                title: 'OFERTA DEL DIA!',
                text: "Desea aceptar la oferta?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Quiero la oferta!',
            }).then((result) => {
                if (result.isConfirmed) {
                Swal.fire(
                    'Oferta del 10%!',
                    'Podras verla en tus Proximas Compras!',
                    'success')
                    ofertaActiva = true;
                    aurisJSON.forEach(auricular => {
                        auricular.precio = parseInt(auricular.precio * 0.9);
                    });
                    GuardarAlLocalStorage("oferta", JSON.stringify(ofertaActiva));
                }
                else{
                    ofertaActiva = false;
                    GuardarAlLocalStorage("oferta", JSON.stringify(ofertaActiva));
                }
            })
        }
        else{
            Swal.fire({
                title: 'Quieres cancelar tu oferta?',
                text: "Cancelaras tu oferta del 10%!",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Quiero cancelarla!',
            }).then((result) => {
                if (result.isConfirmed) {
                Swal.fire(
                    'Has cancelado tu oferta',
                    'Podras verla en tus Proximas Compras!',
                    'error')
                    ofertaActiva = false;
                    aurisJSON.forEach(auricular => {
                        auricular.precio = parseInt(auricular.precio );
                    });
                    GuardarAlLocalStorage("oferta", JSON.stringify(ofertaActiva));
                }
                else{
                    ofertaActiva = true;
                    GuardarAlLocalStorage("oferta", JSON.stringify(ofertaActiva));
                }
            })
        }
        
    }, 4000);
}

ofertaPagina();

function seccionProductos(){
    for(const auricular of aurisJSON){
        seccionProds.innerHTML += `
        <button id="btn${auricular.id}" class="modelo modelo-${auricular.modelo}">
        <h3>${auricular.nombre}</h3>
        <p class="precio">$${auricular.precio}</p>
        </button>
        `
    }

    //evento
    aurisJSON.forEach(auricular => {
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
    Toastify({
        text: "Agregado Al carrito",
        className: "info",
        style: {
          background: "linear-gradient(to right, #1073BA, #00DA55)",
        }
      }).showToast();

    document.getElementById("tablaBody").innerHTML += `
    <tr>
        <td class="texto-center lineaTabla" >${auricularElegido.nombre}</td>
        <td class="texto-center lineaTabla" > $${auricularElegido.precio}</td>
        <td><button class="btn texto-center" onclick="eliminar(event)">eliminar</button></td>
    </tr>
    `;
    let totalApagar =  carrito.reduce((acumulador,auricularElegido) => acumulador + auricularElegido.precio,0);
    let total = document.getElementById("total");
    total.innerText = `Total: $${totalApagar}`;
};


function eliminar(ev){
    //primero me fijo quien fue el que mando el evento
    let fila = ev.target.parentElement.parentElement;
    
    //luego reviso que fila es y guardo el nombre del producto
    let nombre = fila.children[0].innerText;
    
    //luego busco el producto en el carrito
    let indice = carrito.findIndex(auricular => auricular.nombre === nombre);
    //luego lo elimino
    carrito.splice(indice,1);
    //luego lo elimino de la tabla
    console.table(carrito);
    //luego lo elimino de la fila
    fila.remove();

    let preciosAcumulados = carrito.reduce((acumulador,auricularElegido) => acumulador + auricularElegido.precio,0);
    total.innerText = `Total: $${preciosAcumulados}`;

    GuardarAlLocalStorage("carritooAuris", JSON.stringify(carrito));
}


botonRevertir.addEventListener("click", vaciarCarrito);

function vaciarCarrito(){
    aurisJSON.forEach(auricular => {
        carrito.pop(auricular);
    });
    Swal.fire({
        title: 'Estas Seguro?',
        text: "No puedes revertirlo despues!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Estoy seguro!',
        width: 600,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Eliminado!',
            'Puedes seguir comprando.',
            'success'
          )
          document.getElementById("tablaBody").innerHTML = "";
          totalApagar = 0;
          let total = document.getElementById("total");
          total.innerText = `Total: $${totalApagar}`;
          GuardarAlLocalStorage("carritooAuris", JSON.stringify(carrito));
        }
      }) 
}




