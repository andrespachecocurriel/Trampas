# Red de Trampas 🪤

Sistema de encuesta online con geolocalización en tiempo real y conversión de coordenadas a formato UTM.

## Características

✅ Encuesta online interactiva
✅ Mapa en tiempo real con Leaflet.js
✅ Captura automática de coordenadas GPS
✅ Conversión automática a formato UTM
✅ Backend Node.js con Express
✅ Base de datos MongoDB
✅ Almacenamiento seguro de datos

## Tecnologías

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Mapas:** Leaflet.js + OpenStreetMap
- **Backend:** Node.js + Express
- **Base de Datos:** MongoDB
- **Conversión Coordenadas:** utm library

## Estructura del Proyecto

```
Trampas/
├── frontend/
│   ├── index.html          # Interfaz de encuesta
│   ├── css/
│   │   └── style.css       # Estilos
│   └── js/
│       ├── main.js         # Lógica principal
│       ├── geolocation.js  # Manejo de GPS
│       └── utm-converter.js # Conversión de coordenadas
├── backend/
│   ├── server.js           # Servidor Express
│   ├── routes/
│   │   └── encuestas.js    # Rutas API
│   ├── models/
│   │   └── Encuesta.js     # Modelo de datos
│   └── config/
│       └── database.js     # Configuración MongoDB
├── .env.example            # Variables de entorno
├── package.json            # Dependencias Node.js
└── README.md               # Este archivo

```

## Instalación

### Requisitos
- Node.js 18+
- MongoDB local o Atlas
- Navegador moderno

### Pasos

1. **Clonar repositorio**
```bash
git clone https://github.com/andrespachecocurriel/Trampas.git
cd Trampas
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales MongoDB
```

4. **Ejecutar servidor**
```bash
npm start
```

5. **Acceder a la aplicación**
```
http://localhost:3000
```

## Uso

1. Abre la encuesta en tu navegador
2. Completa los campos del formulario
3. El mapa capturará automáticamente tu ubicación
4. Las coordenadas se convertirán a UTM automáticamente
5. Envía la encuesta para guardar los datos

## API Endpoints

### POST /api/encuestas
Guardar nueva encuesta

**Body:**
```json
{
  "usuario": "Juan",
  "descripcion": "Trampa activa",
  "tipo_trampa": "Ratonera",
  "estado": "Activa",
  "latitud": 4.7110,
  "longitud": -74.0721,
  "utm_zone": "18M",
  "utm_este": "1000000",
  "utm_norte": "500000",
  "foto": "base64...",
  "fecha_hora": "2026-07-25T16:51:46Z"
}
```

### GET /api/encuestas
Obtener todas las encuestas

### GET /api/encuestas/:id
Obtener encuesta específica

## Formato UTM

Las coordenadas se guardan automáticamente en formato UTM:
- **Zona UTM:** ej. 18M
- **Este (E):** coordenada X en metros
- **Norte (N):** coordenada Y en metros

Ejemplo: Zona 18M, E: 1000000, N: 500000

## Licencia

MIT
