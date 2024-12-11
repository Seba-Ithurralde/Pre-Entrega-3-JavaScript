function principal () {
    let productos = [
        {
            id: 1,
            nombre: 'Notebook Gamer ASUS',
            precio: 1799,
            stock: 10,
            categoria: 'computacion',
            image: "img/notebookasus.png"
        },
        {
            id: 2,
            nombre: 'Mouse Logitech',
            precio: 69,
            stock: 20,
            categoria: 'accesorios',
            image: "img/mouselogitech.jpg"
        },
        {
            id: 3,
            nombre: 'Teclado ASUS',
            precio: 129,
            stock: 5,
            categoria: 'accesorios',
            image: "img/tecladoasus.jpg"
        },
        {
            id: 4,
            nombre: 'Monitor 27" Samsung',
            precio: 1299,
            stock: 8,
            categoria: 'computacion',
            image: "img/monitorsamsung.jpg"
        },
        {
            id: 5,
            nombre: 'Headset Oculus Rift',
            precio: 499,
            stock: 15,
            categoria: 'reproductores',
            image: "img/headset.jpg"
        },
        {
            id: 6,
            nombre: 'Smartphone Samsung Galaxy',
            precio: 899,
            stock: 12,
            categoria: 'celulares',
            image: "img/samsunggalaxy.jpg"
        },
        {
            id: 7,
            nombre: 'Smartwatch Apple Watch',
            precio: 249,
            stock: 25,
            categoria: 'reproductores',
            image: "img/AppleWatch.jpg"
        },
        {
            id: 8,
            nombre: 'Disco Duro SSD 1TB',
            precio: 149,
            stock: 15,
            categoria: 'accesorios',
            image: "img/discoSSD.jpg"
        },
        {
            id: 9,
            nombre: 'Adaptador USB Type-C',
            precio: 39,
            stock: 30,
            categoria: 'accesorios',
            image: "img/USB.jpg"
        },
        {
            id: 10,
            nombre: 'Camara IP',
            precio: 199,
            stock: 20,
            categoria: 'reproductores',
            image: "img/camaraIP.png"
        },
        {
            id: 11,
            nombre: 'Iphone 15 Pro Max',
            precio: 1369,
            stock: 12,
            categoria: 'celulares',
            image: "img/iphone15promax.jpg"
        }
    ]

    let carrito = recuperarCarrito("carrito");
    mostrarCarrito(carrito);

    generarProductos(productos);

    let  inputBuscar= document.getElementById("buscar");
    inputBuscar.addEventListener("keyup", (e) => buscarProductos(e, productos));

    let botonBuscar = document.getElementById("botonBuscar");
    botonBuscar.addEventListener("click", () => botonProductos(inputBuscar, productos));

    let botonProductosCarrito = document.getElementById("productosCarrito");
    botonProductosCarrito.addEventListener("click", ocultarCarrito)

    let botonProductos = document.getElementsByClassName("agregarAlCarrito");
    for (const boton of botonProductos) {  
        boton.addEventListener("click", (e) => agregarCarrito(e, productos));
    }

    let botonComprar = document.getElementById("botonComprar");
    botonComprar.addEventListener("click", () => comprarProductos(carrito, productos));

    let vaciar = document.getElementById("carrito");
    vaciar.addEventListener("click", vaciarCarrito);

    let compraProductos = document.getElementById("compraProductos");
    compraProductos.addEventListener("change",(e) => buyProducts(e, productos));
}

principal();

function buyProducts(e, productos) {
    let categoria = e.target.value; 
    let products = productos.filter(producto => producto.categoria.includes(categoria));
    generarProductos(products);
}


function calcularTotal(productos) {
    return productos.reduce((acum, producto) => acum + producto.subtotal, 0);
}

function vaciarCarrito() {
    let carrito = document.getElementById("carrito");
    carrito.innerHTML = "";
}

function actualizarTotal(total) {
    let elementoTotal = document.getElementById("total");
    if (elementoTotal === 0) {
        elementoTotal.innerText = "No hay productos en el carrito";
    } 
    else {
        elementoTotal.innerText = "Total de la compra: $" + total
    }
}

function comprarProductos () {
    mostrarCarrito([]);
    localStorage.removeItem("carrito");
    alert("Muchas gracias por su compra!");
}

function buscarProductos (productos) {
    let inputBuscar = document.getElementById("buscar");
    let productosFiltrados = filtrar(inputBuscar.value, productos);
    generarProductos(productosFiltrados);
}

function botonProductos (e, productos) {
    if (e.keyCode === 13) {
    let productosFiltrados = filtrar(e.target.value, productos);
    generarProductos(productosFiltrados);
    }

    e.target.value === "" && generarProductos(productos);
}

function filtrar (valor, productos) {
    return productos.filter(({ nombre, categoria }) => nombre.includes(valor) || categoria.includes(valor));
}

function ocultarCarrito (e) {
    let carrito = document.getElementById("pantallaCarrito");
    let contenedorProductos = document.getElementById("pantallaProductos");
    carrito.classList.toggle("ocultar");
    contenedorProductos.classList.toggle("ocultar");
       
    if(e.target.innerText === "Carrito") {
       e.target.innerText = "Productos";
    } 
    else {
        e.target.innerText = "Carrito";
    }
}

function generarProductos (productos) {
    let contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = ""; 
    productos.forEach(({ image, nombre, precio, stock, id }) => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <article>
            <img src="${image}" alt="${nombre}">
            <h3>${nombre}</h3>
            <p>Precio: $${precio}</p>
            <p>Stock: ${stock}</p>
            </p>
            <button class=agregarAlCarrito id="agc${id}">Agregar al carrito</button>
            </article>
            `;
        contenedor.append(card);
    }
)};

function agregarCarrito (e, productos) {
    let carrito = recuperarCarrito();
    let idProducto = Number(e.target.id.substring(3));
    let producto = productos.find(p => p.id === idProducto);
    let { nombre, id, precio, } = producto;
    let indiceCarrito = carrito.findIndex(producto => producto.id === idProducto);
    if (indiceCarrito === -1) {
        carrito.push({
            id: id,
            nombre: nombre,
            precioUnitario: precio,
            unidades: 1,
            subtotal: precio
        });
    
    } else {
        carrito[indiceCarrito].unidades++;
        carrito[indiceCarrito].subtotal = carrito[indiceCarrito].unidades * carrito[indiceCarrito].precioUnitario;
    }

    guardarCarrito(carrito);
    mostrarCarrito(carrito);
    const total = calcularTotal(carrito);
    actualizarTotal(total);
}

function mostrarCarrito (carrito) {
    let carritoHTML = document.getElementById("carrito");
    carritoHTML.innerHTML = "";
    carrito.forEach(({ nombre, precioUnitario, unidades, subtotal, id }) => {
        let fila = document.createElement("div");
        fila.innerHTML = `
            <p>${nombre}</p>
            <p>$${precioUnitario}</p>
            <div class=unidades>
            <button id="run${id}"> - </button> 
            <p>${unidades}</p>
            <button id="sun${id}"> + </button>
            </div>
            <p>$${subtotal}</p>
            <p><button class=eliminarProducto id="${id}">Eliminar</button></p>
            `;
        carritoHTML.append(fila);
        fila.querySelector(".eliminarProducto").addEventListener("click", eliminarProducto);
        
        let restar = document.getElementById("run" + id);
        restar.addEventListener("click", restarUnidad);
        
        let sumar = document.getElementById("sun" + id);
        sumar.addEventListener("click", sumarUnidad);

    });

    let total = calcularTotal(carrito);
    actualizarTotal(total);  
}

function restarUnidad (e) {
    let id = Number(e.target.id.substring(3));
    let carrito = recuperarCarrito();
    let indiceCarrito = carrito.findIndex(producto => producto.id === id);
    if (indiceCarrito !== -1 && carrito[indiceCarrito].unidades > 1) {
        carrito[indiceCarrito].unidades--;
        carrito[indiceCarrito].subtotal = carrito[indiceCarrito].unidades * carrito[indiceCarrito].precioUnitario;
        guardarCarrito(carrito);

        e.target.parentElement.children[1].innerText = carrito[indiceCarrito].unidades;
        e.target.parentElement.nextElementSibling.innerText = carrito[indiceCarrito].subtotal;
    }

    const total = calcularTotal(carrito);
    actualizarTotal(total);
}

function sumarUnidad (e) {
    let id = Number(e.target.id.substring(3));
    let carrito = recuperarCarrito();
    let indiceCarrito = carrito.findIndex (producto => producto.id === id);
    if (indiceCarrito !== -1) {
        carrito[indiceCarrito].unidades++;
        carrito[indiceCarrito].subtotal = carrito[indiceCarrito].unidades * carrito[indiceCarrito].precioUnitario;
        guardarCarrito(carrito);

        e.target.parentElement.children[1].innerText = carrito[indiceCarrito].unidades;
        e.target.parentElement.nextElementSibling.innerText = carrito[indiceCarrito].subtotal;
    }

    const total = calcularTotal(carrito);
    actualizarTotal(total);
}   

function guardarCarrito (clave, valor) {
    let valorProducto = JSON.stringify(valor);
    localStorage.setItem(clave, valorProducto);   
}

function recuperarCarrito () {
    let valorCarrito = localStorage.getItem("carrito");
    let carrito = JSON.parse(valorCarrito); 
    if (!carrito) {
        carrito = [];
    }
    return carrito;
}

function eliminarProducto(e) {
    let carrito = recuperarCarrito();
    let id = Number(e.target.id.substring(3));
    let indiceCarrito = carrito.findIndex(producto => producto.id === id);
    if (indiceCarrito!== -1) {
        carrito.splice(indiceCarrito, 1);
        e.target.parentElement.remove();
    }

    guardarCarrito(carrito);
    const total = calcularTotal(carrito);
    actualizarTotal(total);
}