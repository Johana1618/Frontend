document.querySelector('.login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nuevaPassword = document.getElementById('usuario').value.trim(); // Campo "Nueva contraseña"
    const confirmarPassword = document.getElementById('contraseña').value.trim(); // Campo "Confirmar"
    const botonCambiar = document.querySelector('.login-button');
    
    if (!nuevaPassword || !confirmarPassword) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos vacíos',
            text: 'Por favor, complete todos los campos',
            confirmButtonColor: '#3085d6'
        });
        return;
    }
    
    if (nuevaPassword !== confirmarPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las contraseñas no coinciden',
            confirmButtonColor: '#3085d6'
        });
        return;
    }
    
    if (nuevaPassword.length < 4) {
        Swal.fire({
            icon: 'warning',
            title: 'Contraseña muy corta',
            text: 'La contraseña debe tener al menos 4 caracteres',
            confirmButtonColor: '#3085d6'
        });
        return;
    }
    
    botonCambiar.textContent = 'Cambiando...';
    botonCambiar.disabled = true;
    
    try {
        // SIEMPRE usar localStorage como fuente principal
        let usuario;
        const storedData = localStorage.getItem('usuario');
        if (storedData) {
            usuario = JSON.parse(storedData);
            console.log('Datos cargados desde localStorage (fuente principal):', usuario);
        } else {
            // Solo cargar desde JSON la primera vez
            try {
                const response = await fetch('data/usuario.json');
                if (response.ok) {
                    usuario = await response.json();
                    console.log('Primera carga desde JSON:', usuario);
                } else {
                    throw new Error('No se pudo cargar JSON');
                }
            } catch (error) {
                // Fallback si no se puede cargar JSON
                usuario = {
                    "usuario": "admin",
                    "contraseña": "1234",
                    "auth": false
                };
                console.log('Usando datos por defecto:', usuario);
            }
            // Guardar en localStorage para que sea la fuente principal
            localStorage.setItem('usuario', JSON.stringify(usuario));
            console.log('Datos guardados en localStorage como fuente principal');
        }

        // Actualizar la contraseña
        usuario.contraseña = nuevaPassword;

        // Guardar de vuelta en localStorage (fuente principal permanente)
        localStorage.setItem('usuario', JSON.stringify(usuario));

        console.log('Contraseña actualizada exitosamente en localStorage (fuente principal)');

        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: '¡Contraseña cambiada exitosamente!',
            confirmButtonColor: '#3085d6',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            // Limpiar formulario
            document.getElementById('usuario').value = '';
            document.getElementById('contraseña').value = '';
            window.location.href = 'login.html';
        });
        
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cambiar la contraseña. Intente nuevamente.',
            confirmButtonColor: '#3085d6'
        });
        console.error('Error:', error);
    } finally {
        setTimeout(() => {
            botonCambiar.textContent = 'Cambiar contraseña';
            botonCambiar.disabled = false;
        }, 1500);
    }
});

// Validación en tiempo real para confirmar contraseña
document.getElementById('contraseña').addEventListener('input', function() {
    const nuevaPassword = document.getElementById('usuario').value;
    const confirmarPassword = this.value;
    
    if (confirmarPassword && nuevaPassword !== confirmarPassword) {
        this.style.borderColor = '#ef4444';
    } else {
        this.style.borderColor = '';
    }
});