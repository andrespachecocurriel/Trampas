/**
 * Módulo de Geolocalización
 * Maneja la captura de coordenadas GPS y su visualización en mapa
 */

class GeoLocationManager {
    constructor(options = {}) {
        this.mapId = options.mapId || 'map';
        this.map = null;
        this.marker = null;
        this.watchId = null;
        this.lastPosition = null;
        
        this.initMap();
    }

    /**
     * Inicializa el mapa de Leaflet
     */
    initMap() {
        // Coordenadas por defecto (Bogotá, Colombia)
        const defaultLat = 4.7110;
        const defaultLon = -74.0721;
        
        this.map = L.map(this.mapId).setView([defaultLat, defaultLon], 13);
        
        // Capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            minZoom: 2
        }).addTo(this.map);
        
        // Control de escala
        L.control.scale().addTo(this.map);
        
        // Marcador inicial
        this.addMarker(defaultLat, defaultLon, 'Ubicación por defecto');
    }

    /**
     * Obtiene la ubicación actual del usuario
     * @returns {Promise}
     */
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocalización no soportada en este navegador'));
                return;
            }

            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.lastPosition = position;
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    });
                },
                (error) => {
                    reject(new Error(this.getGeolocationErrorMessage(error.code)));
                },
                options
            );
        });
    }

    /**
     * Obtiene mensajes de error de geolocalización
     */
    getGeolocationErrorMessage(code) {
        const errors = {
            1: 'Permiso de geolocalización denegado',
            2: 'Ubicación no disponible',
            3: 'Tiempo de espera agotado'
        };
        return errors[code] || 'Error desconocido en geolocalización';
    }

    /**
     * Añade un marcador al mapa
     * @param {number} lat - Latitud
     * @param {number} lon - Longitud
     * @param {string} titulo - Título del marcador
     */
    addMarker(lat, lon, titulo = 'Mi ubicación') {
        if (this.marker) {
            this.map.removeLayer(this.marker);
        }

        this.marker = L.marker([lat, lon], {
            title: titulo,
            icon: L.icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                shadowSize: [41, 41],
                iconAnchor: [12, 41],
                shadowAnchor: [12, 41]
            })
        }).bindPopup(`<b>${titulo}</b><br>Lat: ${lat.toFixed(6)}<br>Lon: ${lon.toFixed(6)}`);
        
        this.marker.addTo(this.map);
        this.map.setView([lat, lon], 15);
    }

    /**
     * Dibuja un círculo de precisión alrededor del marcador
     * @param {number} lat - Latitud
     * @param {number} lon - Longitud
     * @param {number} accuracy - Precisión en metros
     */
    drawAccuracyCircle(lat, lon, accuracy) {
        if (window.accuracyCircle) {
            this.map.removeLayer(window.accuracyCircle);
        }

        window.accuracyCircle = L.circle([lat, lon], {
            color: '#3498db',
            fillColor: '#3498db',
            fillOpacity: 0.1,
            weight: 2,
            radius: accuracy
        }).addTo(this.map);
    }

    /**
     * Comienza a monitorear cambios de posición
     * @param {Function} callback - Función a ejecutar con cada actualización
     */
    watchPosition(callback) {
        if (!navigator.geolocation) {
            console.error('Geolocalización no soportada');
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.lastPosition = position;
                callback({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                console.error('Error de monitoreo:', error);
            },
            options
        );
    }

    /**
     * Detiene el monitoreo de posición
     */
    stopWatchPosition() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    /**
     * Centra el mapa en una ubicación
     * @param {number} lat - Latitud
     * @param {number} lon - Longitud
     * @param {number} zoom - Nivel de zoom
     */
    centerMap(lat, lon, zoom = 15) {
        this.map.setView([lat, lon], zoom);
    }

    /**
     * Obtiene la última posición capturada
     */
    getLastPosition() {
        return this.lastPosition;
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.GeoLocationManager = GeoLocationManager;
}