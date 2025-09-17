// Funcionalidades del Panel de Administración - DigitalCore Solutions

// Cerrar sesión
document.addEventListener('DOMContentLoaded', function() {
    const cerrarSesionBtn = document.getElementById('cerrarSesion');
    
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Limpiar datos de sesión
            sessionStorage.clear();
            localStorage.clear();
            
            // Redirigir con parámetro de logout
            window.location.replace('login.html?logout=true');
        });
    }
});

// Aquí puedes agregar más funcionalidades del panel:
// - Búsqueda de servicios
// - Crear/Editar/Eliminar servicios  
// - Toggle de promociones
// - etc.