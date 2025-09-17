document.querySelector('.login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nuevaPassword = document.getElementById('usuario').value.trim(); // Campo "Nueva contraseña"
    const confirmarPassword = document.getElementById('contraseña').value.trim(); // Campo "Confirmar"
    const botonCambiar = document.querySelector('.login-button');
    
    if (!nuevaPassword || !confirmarPassword) {
        alert('Por favor, complete todos los campos');
        return;
    }
    
    if (nuevaPassword !== confirmarPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    if (nuevaPassword.length < 4) {
        alert('La contraseña debe tener al menos 4 caracteres');
        return;
    }
    
    botonCambiar.textContent = 'Cambiando...';
    botonCambiar.disabled = true;
    
    try {
        const response = await fetch('data/usuario.json');
        
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }
        
        const data = await response.json();
        
        // Simular cambio exitoso (actualiza la contraseña del usuario admin)
        console.log('Contraseña anterior:', data.contraseña);
        console.log('Contraseña nueva:', nuevaPassword);
        
        alert('¡Contraseña cambiada exitosamente!');
        
        // Limpiar formulario
        document.getElementById('usuario').value = '';
        document.getElementById('contraseña').value = '';
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        
    } catch (error) {
        alert('Error al cambiar la contraseña. Intente nuevamente.');
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