/**
 * Conversor de coordenadas a formato UTM
 * Utiliza la librería utm (https://www.npmjs.com/package/utm)
 */

class UTMConverter {
    /**
     * Convierte coordenadas lat/long a UTM
     * @param {number} latitude - Latitud en grados
     * @param {number} longitude - Longitud en grados
     * @returns {Object} Objeto con zona UTM, este y norte
     */
    static latLonToUTM(latitude, longitude) {
        try {
            // Usar la librería utm para convertir
            const coords = utm.fromLatLon(latitude, longitude);
            
            return {
                zone: coords.zoneNum + coords.zoneLetter,
                zoneNum: coords.zoneNum,
                zoneLetter: coords.zoneLetter,
                este: Math.round(coords.easting),
                norte: Math.round(coords.northing),
                success: true
            };
        } catch (error) {
            console.error('Error al convertir a UTM:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Convierte coordenadas UTM a lat/long
     * @param {number} zoneNum - Número de zona (1-60)
     * @param {string} zoneLetter - Letra de zona (C-X, excepto I, O)
     * @param {number} easting - Coordenada Este
     * @param {number} northing - Coordenada Norte
     * @returns {Object} Objeto con latitud y longitud
     */
    static utmToLatLon(zoneNum, zoneLetter, easting, northing) {
        try {
            const coords = utm.toLatLon(easting, northing, zoneNum, zoneLetter);
            
            return {
                latitude: parseFloat(coords.lat.toFixed(6)),
                longitude: parseFloat(coords.lon.toFixed(6)),
                success: true
            };
        } catch (error) {
            console.error('Error al convertir desde UTM:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Calcula la zona UTM basada en longitud
     * @param {number} longitude - Longitud en grados
     * @returns {number} Número de zona UTM
     */
    static getUTMZone(longitude) {
        return Math.floor((longitude + 180) / 6) + 1;
    }

    /**
     * Obtiene la letra de zona basada en latitud
     * @param {number} latitude - Latitud en grados
     * @returns {string} Letra de zona UTM
     */
    static getUTMZoneLetter(latitude) {
        const letters = 'CDEFGHJKLMNPQRSTUVWXX';
        const index = Math.floor((latitude + 80) / 8);
        return letters[Math.max(0, Math.min(index, letters.length - 1))];
    }

    /**
     * Formatea coordenadas UTM como string legible
     * @param {Object} utmCoords - Objeto con datos UTM
     * @returns {string} String formateado
     */
    static formatUTM(utmCoords) {
        if (!utmCoords.success) {
            return 'Error en conversión';
        }
        return `Zona ${utmCoords.zone} | E: ${utmCoords.este.toLocaleString()} m | N: ${utmCoords.norte.toLocaleString()} m`;
    }

    /**
     * Valida si las coordenadas están dentro de rangos válidos
     * @param {number} latitude - Latitud
     * @param {number} longitude - Longitud
     * @returns {boolean} true si son válidas
     */
    static validateCoordinates(latitude, longitude) {
        return latitude >= -90 && latitude <= 90 && 
               longitude >= -180 && longitude <= 180;
    }
}

// Exportar para uso en navegador
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UTMConverter;
}