document.addEventListener('DOMContentLoaded', () => {
const cerrarsesion = document.getElementById('cerrar-sesion');
if (cerrarsesion) {
    cerrarsesion.addEventListener('click', () => {
       alert('Sesión cerrada');
    
    });
}});