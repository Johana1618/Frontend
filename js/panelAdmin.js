// Funcionalidades del Panel de Administración - DigitalCore Solutions

// Verificar autenticación antes de cargar el panel
function verificarAutenticacion() {
    const storedData = localStorage.getItem('usuario');
    
    if (!storedData) {
        // No hay datos de usuario, redirigir al login
        console.log('No hay datos de usuario, redirigiendo al login');
        window.location.replace('login.html');
        return false;
    }
    
    const userData = JSON.parse(storedData);
    
    if (!userData.auth) {
        // Usuario no autenticado, redirigir al login
        console.log('Usuario no autenticado, redirigiendo al login');
        window.location.replace('login.html');
        return false;
    }
    
    console.log('Usuario autenticado correctamente');
    return true;
}

// Verificar autenticación al cargar la página
if (!verificarAutenticacion()) {
    // Si no está autenticado, no ejecutar el resto del código
    throw new Error('Acceso no autorizado');
}

// Cerrar sesión
document.addEventListener('DOMContentLoaded', function() {
    const cerrarSesionBtn = document.getElementById('cerrarSesion');
    
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Actualizar el campo auth a false en localStorage
            const storedData = localStorage.getItem('usuario');
            if (storedData) {
                const userData = JSON.parse(storedData);
                userData.auth = false;
                localStorage.setItem('usuario', JSON.stringify(userData));
                console.log('Auth actualizado a false:', userData);
            }
            
            // Limpiar datos de sesión
            sessionStorage.clear();

            
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