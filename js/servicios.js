document.addEventListener('DOMContentLoaded', function () {
    fetch('data/servicios.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('titulo-servicio').textContent = data.titulo;
            document.getElementById('descripcion-servicio').textContent = data.descripcion;

            const serviciosContainer = document.querySelector('.services-grid');
            data.servicios.forEach(servicio => {
                const serviceCard = document.createElement('div');
                serviceCard.classList.add('service-card');
                serviceCard.innerHTML = `
                    <a href="detalle-servicio.html?name=${encodeURIComponent(servicio.titulo)}">
                        <div class="icon-container">
                            <div class="icon">${servicio.imagen}</div>
                            ${servicio.promocion ? '<div class="fire-badge">🔥</div>' : ''}
                        </div>
                        <h3 class="service-title">${servicio.titulo}</h3>
                        <p class="service-price"><span class="price-amount">${servicio.precio}</span> COP</p>
                    </a>`;
                serviciosContainer.appendChild(serviceCard);
            });
        })
        .catch(error => console.error('Error loading servicios:', error));
});
