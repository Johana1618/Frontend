document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceName = urlParams.get('name');

    if (!serviceName) {
        console.error('No service name provided in URL');
        return;
    }

    // Helper para formatear precio
    function formatoPrecio(valor) {
        const numero = parseInt(valor.toString().replace(/\D/g, ''), 10) || 0;
        return `$${numero.toLocaleString('es-CO')} COP`;
    }

    // Función para mostrar detalles del servicio
    function mostrarServicio(servicio) {
        if (!servicio) {
            console.error('Service not found');
            return;
        }

        document.getElementById('titulo-detalle-servicio').textContent = servicio.titulo;
        document.getElementById('descripcion-detalle-servicio').textContent = servicio.descripcion;
        document.getElementById('imagen-detalle-servicio').textContent = servicio.imagen;
        document.getElementById('cantidad-detalle-servicio').textContent = servicio.cantidad;
        document.getElementById('precio-detalle-servicio').textContent = formatoPrecio(servicio.precio);

        const promoBadge = document.getElementById('promocion-detalle-servicio');
        promoBadge.style.display = servicio.promocion ? 'block' : 'none';
    }

    // Cargar desde localStorage
    let serviciosData = JSON.parse(localStorage.getItem('servicios'));

    if (serviciosData && serviciosData.servicios) {
        const servicio = serviciosData.servicios.find(
            s => s.titulo.toLowerCase() === serviceName.toLowerCase()
        );
        mostrarServicio(servicio);
    } else {
        // Si no hay en localStorage, cargar desde JSON y guardar
        fetch('data/servicios.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('servicios', JSON.stringify(data));
                const servicio = data.servicios.find(
                    s => s.titulo.toLowerCase() === serviceName.toLowerCase()
                );
                mostrarServicio(servicio);
            })
            .catch(error => console.error('Error loading servicios:', error));
    }
});
