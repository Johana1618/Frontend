// ========================================
// SISTEMA DE TOAST NOTIFICATIONS
// ========================================

// Sistema de Toast Notifications
class ToastSystem {
    constructor() {
        this.container = document.getElementById('toast-container');
    }

    show(type, title, message, duration = 4000) {
        const toast = this.createToast(type, title, message);
        this.container.appendChild(toast);

        // Mostrar toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Iniciar progreso
        if (duration > 0) {
            this.startProgress(toast, duration);
            setTimeout(() => this.hide(toast), duration);
        }

        return toast;
    }

    createToast(type, title, message) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✓',
            error: '×',
            warning: '!',
            info: 'i'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="toastSystem.hide(this.parentElement)">×</button>
            <div class="toast-progress">
                <div class="toast-progress-bar"></div>
            </div>
        `;

        return toast;
    }

    hide(toast) {
        toast.classList.add('hide');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 400);
    }

    startProgress(toast, duration) {
        const progressBar = toast.querySelector('.toast-progress-bar');
        progressBar.style.transitionDuration = duration + 'ms';
        setTimeout(() => {
            progressBar.style.transform = 'translateX(0)';
        }, 100);
    }
}

// Inicializar sistema de toast
const toastSystem = new ToastSystem();

// Funciones para mostrar notificaciones específicas
function showLoginSuccess() {
    return toastSystem.show(
        'success', 
        '¡Login exitoso!', 
        'Bienvendido al Panel de Administración', 
        2000
    );
}

function showLoginError() {
    return toastSystem.show(
        'error', 
        'Acceso Denegado', 
        'Usuario o contraseña incorrectos', 
        4000
    );
}

function showFieldsError() {
    return toastSystem.show(
        'warning', 
        'Campos Requeridos', 
        'Por favor, complete todos los campos', 
        3000
    );
}

function showConnectionError(errorMessage) {
    return toastSystem.show(
        'error', 
        'Error de Conexión', 
        `No se pudo cargar los datos: ${errorMessage}`, 
        5000
    );
}

// Limpiar campos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('usuario').value = '';
    document.getElementById('contraseña').value = '';
});

// Manejar el formulario de login
document.querySelector('.login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('usuario').value.trim();
    const contraseña = document.getElementById('contraseña').value.trim();
    
    console.log('Usuario ingresado:', usuario);
    console.log('Contraseña ingresada:', contraseña);
    
    // Validar campos vacíos
    if (!usuario || !contraseña) {
        showFieldsError();
        return;
    }
    
    try {
        console.log('Cargando JSON...');
        const response = await fetch('data/usuario.json');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Datos cargados:', data);
        
        // Verificar credenciales
        if (data.usuario === usuario && data.contraseña === contraseña) {
            // Limpiar campos inmediatamente
            document.getElementById('usuario').value = '';
            document.getElementById('contraseña').value = '';
            
            // Mostrar notificación de éxito
            showLoginSuccess();
            
            // Redirigir después de mostrar la notificación
            setTimeout(() => {
                window.location.href = 'PanelAdmin.html';
            }, 2000);
            
        } else {
            // Mostrar notificación de error
            showLoginError();
        }
        
    } catch (error) {
        // Mostrar notificación de error de conexión
        showConnectionError(error.message);
        console.error('Error:', error);
    }
});