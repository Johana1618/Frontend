// =============================================
// Funcionalidades del Panel de Administración - DigitalCore Solutions
// =============================================

// Estado global para el modal
let modo = "crear"; 
let servicioEditandoId = null;

// Cargar y renderizar servicios
document.addEventListener('DOMContentLoaded', function () {
    fetch('data/servicios.json')
        .then(response => response.json())
        .then(data => {
            // Inicializar localStorage si no existe
            if (!localStorage.getItem('servicios')) {
                localStorage.setItem('servicios', JSON.stringify(data));
            }

            // Render inicial
            renderServicios();
        })
        .catch(error => console.error('Error loading servicios:', error));
});

// =============================================
// Renderizar servicios en la tabla
// =============================================
function renderServicios(filtro = "") {
    const serviciosData = JSON.parse(localStorage.getItem('servicios'));
    const serviciosContainer = document.querySelector('.tr-servicios');

    // Limpiar tabla antes de volver a pintar
    serviciosContainer.innerHTML = "";

    // Filtrar si hay texto
    const filtroLower = filtro.toLowerCase();
    const serviciosFiltrados = serviciosData.servicios.filter(servicio =>
        servicio.titulo.toLowerCase().includes(filtroLower)
    );

    // Pintar servicios filtrados
    serviciosFiltrados.forEach(servicio => {
        const precioNumerico = parseInt(servicio.precio.replace(/\./g, ''), 10);

        const serviceTr = document.createElement('tr');
        serviceTr.setAttribute("data-id", servicio.id);

        serviceTr.innerHTML = `
            <td>${servicio.id}</td> 
            <td><div class="service-icon laptop">${servicio.imagen}</div></td>
            <td>${servicio.titulo}</td>
            <td class="precio" data-precio="${precioNumerico}">${servicio.promocion 
                ? formatoPrecio(aplicarDescuento(precioNumerico, 5)) 
                : formatoPrecio(precioNumerico)}</td>
            <td>${servicio.cantidad}</td>
            <td>
                <label class="toggle">
                    <input type="checkbox" ${servicio.promocion ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </td>
            <td class="descuento">${servicio.promocion ? '5%' : '0%'}</td>
            <td class="tr-servicios">
                <div class="actions">
                    <button class="action-btn edit">📝</button>
                    <button class="action-btn delete">🗑️</button>
                </div>
            </td>
        `;
        serviciosContainer.appendChild(serviceTr);
    });

    // Actualizar contador
    document.getElementById('totalServicios').textContent = serviciosFiltrados.length;
}

// =============================================
// Verificar autenticación antes de cargar el panel
// =============================================
function verificarAutenticacion() {
    const storedData = localStorage.getItem('usuario');
    
    if (!storedData) {
        console.log('No hay datos de usuario, redirigiendo al login');
        window.location.replace('login.html');
        return false;
    }
    
    const userData = JSON.parse(storedData);
    
    if (!userData.auth) {
        console.log('Usuario no autenticado, redirigiendo al login');
        window.location.replace('login.html');
        return false;
    }
    
    console.log('Usuario autenticado correctamente');
    return true;
}

if (!verificarAutenticacion()) {
    throw new Error('Acceso no autorizado');
}

// =============================================
// Cerrar sesión
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    const cerrarSesionBtn = document.getElementById('cerrarSesion');
    
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const storedData = localStorage.getItem('usuario');
            if (storedData) {
                const userData = JSON.parse(storedData);
                userData.auth = false;
                localStorage.setItem('usuario', JSON.stringify(userData));
                console.log('Auth actualizado a false:', userData);
            }
            
            sessionStorage.clear();
            window.location.replace('login.html?logout=true');
        });
    }
});

// =============================================
// Eventos delegados en la tabla
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    const serviciosContainer = document.querySelector('.tr-servicios');

    // Toggle de promociones
    serviciosContainer.addEventListener('change', function (e) {
        if (e.target && e.target.type === 'checkbox') {
            const fila = e.target.closest('tr');
            const servicioId = fila.getAttribute("data-id"); 
            const estado = e.target.checked;

            togglePromocionServicio(servicioId, estado, fila);

            const descuentoCell = fila.querySelector('.descuento');
            const precioCell = fila.querySelector('.precio');
            if (descuentoCell && precioCell) {
                const precioOriginal = parseInt(precioCell.getAttribute('data-precio'), 10);

                if (estado) {
                    descuentoCell.textContent = '5%';
                    precioCell.textContent = formatoPrecio(aplicarDescuento(precioOriginal, 5));
                } else {
                    descuentoCell.textContent = '0%';
                    precioCell.textContent = formatoPrecio(precioOriginal);
                }
            }
        }
    });

    // Eliminar servicio
    serviciosContainer.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('delete')) {
            const fila = e.target.closest('tr');
            const servicioId = fila.getAttribute("data-id");

            if (confirm(`¿Seguro que deseas eliminar el servicio con ID ${servicioId}?`)) {
                eliminarServicio(servicioId, fila);
            }
        }
    });

    // Editar servicio
    serviciosContainer.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('edit')) {
            const fila = e.target.closest('tr');
            servicioEditandoId = fila.getAttribute("data-id");
            abrirModal("editar", servicioEditandoId);
        }
    });

    // Buscador de servicios
    const buscador = document.getElementById('buscadorServicios');
    buscador.addEventListener('input', function () {
        const valor = buscador.value.trim();
        renderServicios(valor);
    });

    // Crear servicio
    document.querySelector('.create-btn').addEventListener('click', () => {
        abrirModal("crear");
    });
});

// =============================================
// Función para actualizar la promo en localStorage
// =============================================
function togglePromocionServicio(id, estado, fila) {
    let serviciosData = JSON.parse(localStorage.getItem('servicios'));

    const servicio = serviciosData.servicios.find(s => s.id === id);
    if (servicio) {
        const precioOriginalAttr = parseInt(fila.querySelector('.precio').getAttribute('data-precio'), 10);

        if (estado) {
            servicio.promocion = true;
            servicio.precio = aplicarDescuento(precioOriginalAttr, 5).toString();
        } else {
            servicio.promocion = false;
            servicio.precio = precioOriginalAttr.toString();
        }
    }

    localStorage.setItem('servicios', JSON.stringify(serviciosData));
    console.log(`Servicio ${id} actualizado → promoción: ${estado}, precio guardado: ${servicio.precio}`);
}

// =============================================
// Función para eliminar un servicio
// =============================================
function eliminarServicio(id, fila) {
    let serviciosData = JSON.parse(localStorage.getItem('servicios'));

    serviciosData.servicios = serviciosData.servicios.filter(s => s.id !== id);

    localStorage.setItem('servicios', JSON.stringify(serviciosData));

    fila.remove();

    document.getElementById('totalServicios').textContent = serviciosData.servicios.length;

    console.log(`Servicio ${id} eliminado correctamente`);
}

// =============================================
// Modal Crear/Editar servicio
// =============================================
function abrirModal(modoModal, id = null) {
    modo = modoModal;
    const modal = document.getElementById('modalServicio');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('formServicio');

    form.reset();

    if (modo === "crear") {
        modalTitle.textContent = "Crear servicio";
        servicioEditandoId = null;
    } else {
        modalTitle.textContent = "Editar servicio";
        const serviciosData = JSON.parse(localStorage.getItem('servicios'));
        const servicio = serviciosData.servicios.find(s => s.id === id);
        if (servicio) {
            document.getElementById('tituloInput').value = servicio.titulo;
            document.getElementById('descripcionInput').value = servicio.descripcion;
            document.getElementById('cantidadInput').value = servicio.cantidad;
            document.getElementById('precioInput').value = servicio.precio;
            document.getElementById('imagenInput').value = servicio.imagen;
        }
    }

    modal.classList.add('show'); // 👈 usar la clase show
}

// Guardar servicio (crear o editar)
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formServicio');
    const modal = document.getElementById('modalServicio');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let serviciosData = JSON.parse(localStorage.getItem('servicios'));

        // Calcular nuevo ID si es crear
        let nuevoId;
        if (modo === "crear") {
            const ids = serviciosData.servicios.map(s => parseInt(s.id, 10));
            const maxId = ids.length ? Math.max(...ids) : 0;
            nuevoId = String(maxId + 1).padStart(3, '0'); // Ejemplo: "011"
        } else {
            nuevoId = servicioEditandoId;
        }

        const nuevoServicio = {
            id: nuevoId,
            titulo: document.getElementById('tituloInput').value,
            descripcion: document.getElementById('descripcionInput').value,
            cantidad: document.getElementById('cantidadInput').value,
            precio: document.getElementById('precioInput').value,
            imagen: document.getElementById('imagenInput').value,
            promocion: modo === "crear" 
                ? false 
                : JSON.parse(localStorage.getItem('servicios')).servicios.find(s => s.id === nuevoId).promocion
        };

        if (modo === "crear") {
            serviciosData.servicios.push(nuevoServicio);
        } else {
            const index = serviciosData.servicios.findIndex(s => s.id === servicioEditandoId);
            serviciosData.servicios[index] = nuevoServicio;
        }

        localStorage.setItem('servicios', JSON.stringify(serviciosData));

        renderServicios();
        modal.classList.remove('show'); // 👈 cerrar modal
    });

    document.getElementById('cancelarBtn').addEventListener('click', () => {
        modal.classList.remove('show'); // 👈 cerrar modal
    });
});

// =============================================
// Helpers
// =============================================
function aplicarDescuento(precio, porcentaje) {
    return Math.round(precio - (precio * porcentaje / 100));
}

function formatoPrecio(valor) {
    return `$${valor.toLocaleString('es-CO')}`;
}
