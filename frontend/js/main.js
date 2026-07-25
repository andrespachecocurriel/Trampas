/**
 * Script principal de la aplicación de encuesta
 */

let geoManager = null;
const API_BASE_URL = 'http://localhost:3000/api';

// Inicializar cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('Aplicación iniciada');
    
    // Inicializar geolocalización
    geoManager = new GeoLocationManager({ mapId: 'map' });
    
    // Event listeners
    document.getElementById('btnGeolocalizacion').addEventListener('click', handleGetLocation);
    document.getElementById('encuestaForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('foto').addEventListener('change', handlePhotoPreview);
});

/**
 * Maneja la obtención de ubicación
 */
async function handleGetLocation() {
    const btn = document.getElementById('btnGeolocalizacion');
    const statusDiv = document.getElementById('geoStatus');
    
    // Mostrar estado de carga
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Obteniendo ubicación...';
    statusDiv.className = '';
    
    try {
        const location = await geoManager.getCurrentLocation();
        
        // Actualizar campos del formulario
        document.getElementById('latitud').value = location.latitude.toFixed(6);
        document.getElementById('longitud').value = location.longitude.toFixed(6);
        
        // Convertir a UTM
        const utmCoords = UTMConverter.latLonToUTM(location.latitude, location.longitude);
        
        if (utmCoords.success) {
            document.getElementById('utm_zone').value = utmCoords.zone;
            document.getElementById('utm_este').value = utmCoords.este.toLocaleString();
            document.getElementById('utm_norte').value = utmCoords.norte.toLocaleString();
        }
        
        // Actualizar mapa
        geoManager.addMarker(location.latitude, location.longitude, 'Mi ubicación actual');
        geoManager.drawAccuracyCircle(location.latitude, location.longitude, location.accuracy);
        
        // Mostrar mensaje de éxito
        statusDiv.className = 'status-message success';
        statusDiv.innerHTML = `<i class="fas fa-check-circle"></i> ✓ Ubicación capturada correctamente (Precisión: ±${Math.round(location.accuracy)} m)`;
        
        showToast(`Ubicación capturada: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`, 'success');
    } catch (error) {
        statusDiv.className = 'status-message error';
        statusDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ✗ Error: ${error.message}`;
        showToast(error.message, 'error');
        console.error('Error de geolocalización:', error);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-satellite"></i> Obtener Mi Ubicación';
    }
}

/**
 * Maneja el envío del formulario
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!document.getElementById('usuario').value) {
        showToast('Por favor completa todos los campos requeridos', 'warning');
        return;
    }
    
    if (!document.getElementById('latitud').value) {
        showToast('Por favor obtén la ubicación primero', 'warning');
        return;
    }
    
    // Mostrar loading
    const loadingMsg = document.getElementById('loadingMessage');
    loadingMsg.style.display = 'block';
    
    try {
        // Preparar datos
        const formData = new FormData();
        formData.append('usuario', document.getElementById('usuario').value);
        formData.append('descripcion', document.getElementById('descripcion').value);
        formData.append('tipo_trampa', document.getElementById('tipo_trampa').value);
        formData.append('estado', document.getElementById('estado').value);
        formData.append('latitud', parseFloat(document.getElementById('latitud').value));
        formData.append('longitud', parseFloat(document.getElementById('longitud').value));
        formData.append('utm_zone', document.getElementById('utm_zone').value);
        formData.append('utm_este', parseInt(document.getElementById('utm_este').value.replace(/,/g, '')));
        formData.append('utm_norte', parseInt(document.getElementById('utm_norte').value.replace(/,/g, '')));
        formData.append('fecha_hora', new Date().toISOString());
        
        // Adjuntar foto si existe
        const fotoInput = document.getElementById('foto');
        if (fotoInput.files.length > 0) {
            formData.append('foto', fotoInput.files[0]);
        }
        
        // Enviar al servidor
        const response = await fetch(`${API_BASE_URL}/encuestas`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Error al guardar la encuesta');
        }
        
        const result = await response.json();
        
        showToast('✓ Encuesta guardada exitosamente', 'success');
        console.log('Encuesta guardada:', result);
        
        // Limpiar formulario
        document.getElementById('encuestaForm').reset();
        document.getElementById('preview-foto').innerHTML = '';
        document.getElementById('geoStatus').className = '';
        
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al guardar la encuesta: ' + error.message, 'error');
    } finally {
        loadingMsg.style.display = 'none';
    }
}

/**
 * Maneja la vista previa de foto
 */
function handlePhotoPreview(e) {
    const file = e.target.files[0];
    const previewDiv = document.getElementById('preview-foto');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            previewDiv.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    } else {
        previewDiv.innerHTML = '';
    }
}

/**
 * Muestra notificación tipo toast
 */
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    // Auto-ocultar después de 4 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

/**
 * Formatea número con separadores de miles
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}