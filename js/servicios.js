// =============================================
// Página de Servicios - DigitalCore Solutions
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    fetch('data/servicios.json')
        .then(response => response.json())
        .then(data => {
            // Inicializar localStorage si no existe
            if (!localStorage.getItem('servicios')) {
                localStorage.setItem('servicios', JSON.stringify(data));
            }

            // Usar siempre los datos desde localStorage
            const serviciosData = JSON.parse(localStorage.getItem('servicios'));

            document.getElementById('titulo-servicio').textContent = serviciosData.titulo;
            document.getElementById('descripcion-servicio').textContent = serviciosData.descripcion;

            const serviciosContainer = document.querySelector('.services-grid');
            serviciosData.servicios.forEach(servicio => {
                const serviceCard = document.createElement('div');
                serviceCard.classList.add('service-card');
                serviceCard.innerHTML = `
                    <a href="detalle-servicio.html?name=${encodeURIComponent(servicio.titulo)}">
                        <div class="icon-container">
                            <div class="icon">${servicio.imagen}</div>
                            ${servicio.promocion ? '<div class="fire-badge">🔥</div>' : ''}
                        </div>
                        <h3 class="service-title">${servicio.titulo}</h3>
                        <p class="service-price"><span class="price-amount">${formatoPrecio(servicio.precio)}</span> COP</p>

                    </a>`;
                serviciosContainer.appendChild(serviceCard);
            });
        })
        .catch(error => console.error('Error loading servicios:', error));
});

function formatoPrecio(valor) {
    // Asegurarnos de que sea número
    const numero = parseInt(valor.toString().replace(/\./g, ''), 10);
    return `$${numero.toLocaleString('es-CO')}`;
}