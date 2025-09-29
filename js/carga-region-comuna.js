document.addEventListener('DOMContentLoaded', () => {

    const regionSelect = document.getElementById('reg-region');
    const comunaSelect = document.getElementById('reg-comuna');
    
    
    const editRegionSelect = document.getElementById('edit-region');
    const editComunaSelect = document.getElementById('edit-comuna');

    function cargarRegiones(selectElement) {
        selectElement.innerHTML = '<option value="">Seleccione una región</option>';
        if (window.regionesComunas) {
            window.regionesComunas.regiones.forEach(region => {
                const option = document.createElement('option');
                option.value = region.region;
                option.textContent = region.region;
                selectElement.appendChild(option);
            });
        }
    }

    function cargarComunas(regionSeleccionada, selectComuna) {
        selectComuna.innerHTML = '<option value="">Seleccione una comuna</option>';
        if (window.regionesComunas) {
            const regionData = window.regionesComunas.regiones.find(r => r.region === regionSeleccionada);
            if (regionData) {
                regionData.comunas.forEach(comuna => {
                    const option = document.createElement('option');
                    option.value = comuna;
                    option.textContent = comuna;
                    selectComuna.appendChild(option);
                });
            }
        }
    }
    

    if (regionSelect && comunaSelect) {
        regionSelect.addEventListener('change', () => cargarComunas(regionSelect.value, comunaSelect));
        cargarRegiones(regionSelect); 
    }
    
    if (editRegionSelect && editComunaSelect) {
        editRegionSelect.addEventListener('change', () => cargarComunas(editRegionSelect.value, editComunaSelect));
        cargarRegiones(editRegionSelect); 
    }
});