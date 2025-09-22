    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');
    const editRegionSelect = document.getElementById('edit-region');
    const editComunaSelect = document.getElementById('edit-comuna');

    function cargarRegiones(selectElement) {
        selectElement.innerHTML = '<option value="">Seleccione una región</option>';
        if (window.regionesComunas) {
            regionesComunas.regiones.forEach(region => {
                const option = document.createElement('option');
                option.value = region.region;
                option.textContent = region.region;
                selectElement.appendChild(option);
            });
        }
    }

    function cargarComunas(regionSeleccionada, selectComunaElement) {
        selectComunaElement.innerHTML = '<option value="">Seleccione una comuna</option>';
        if (window.regionesComunas) {
            const regionData = regionesComunas.regiones.find(r => r.region === regionSeleccionada);
            if (regionData) {
                regionData.comunas.forEach(comuna => {
                    const option = document.createElement('option');
                    option.value = comuna;
                    option.textContent = comuna;
                    selectComunaElement.appendChild(option);
                });
            }
        }
    }
    
    regionSelect.addEventListener('change', () => cargarComunas(regionSelect.value, comunaSelect));
    editRegionSelect.addEventListener('change', () => cargarComunas(editRegionSelect.value, editComunaSelect));