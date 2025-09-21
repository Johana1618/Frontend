document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceName = urlParams.get('name');

    if (!serviceName) {
        console.error('No service name provided in URL');
        return;
    }

    fetch('data/servicios.json')
        .then(response => response.json())
        .then(data => {
            const servicio = data.servicios.find(s => s.titulo.toLowerCase() === serviceName.toLowerCase());

            if (!servicio) {
                console.error('Service not found');
                return;
            }

            // Populate the elements
            document.getElementById('titulo-detalle-servicio').textContent = servicio.titulo;
            document.getElementById('descripcion-detalle-servicio').textContent = servicio.descripcion;
            document.getElementById('imagen-detalle-servicio').textContent = servicio.imagen;
            document.getElementById('cantidad-detalle-servicio').textContent = servicio.cantidad;
            document.getElementById('precio-detalle-servicio').textContent = servicio.precio + ' COP';

            // Show/hide promotion badge
            const promoBadge = document.getElementById('promocion-detalle-servicio');
            if (servicio.promocion) {
                promoBadge.style.display = 'block';
            } else {
                promoBadge.style.display = 'none';
            }
        })
        .catch(error => console.error('Error loading servicios:', error));
});
