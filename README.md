# Asesor Técnico IA - Ultraseco

## Configuración de Google Gemini API

Para utilizar el asesor técnico con Google Gemini 2.5 Flash, sigue estos pasos:

### 1. Obtener API Key de Google AI Studio

1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Get API Key" o "Obtener clave API"
4. Copia tu API Key

### 2. Configurar la API Key

1. Abre el archivo `asesor-gemini.js`
2. Busca la línea: `const genAI = new GoogleGenerativeAI('TU_API_KEY_AQUÍ');`
3. Reemplaza `'TU_API_KEY_AQUÍ'` con tu API Key real
4. Guarda el archivo

### 3. Uso

- Abre `asesor-gemini.html` en tu navegador
- El chat estará listo para responder consultas técnicas sobre productos hidrofóbicos y de mantenimiento

### Alternativas

Si no deseas usar Google Gemini:
- Usa `asesor.html` para el chat básico con respuestas predefinidas
- Usa `index.html` para la página principal

## Características del Asesor Técnico

El asesor utiliza un prompt de sistema especializado que incluye:

- **Diagnóstico primero**: Pregunta sobre la superficie y el problema antes de recomendar
- **Terminología técnica**: Usa términos como "Efecto Loto", "Nanotecnología", "Hidrofóbico"
- **Catálogo completo**: Conoce todos los productos de Ultraseco
- **Formato de respuesta estructurado**: Saludo, explicación, beneficio clave, instrucción de aplicación

## Productos que el asesor puede recomendar:

1. **Estuco Hidrofóbico** - Para humedad por capilaridad leve
2. **Fortificador™** - Para paredes arenosas o pisos de concreto
3. **Solución Exterior** - Para fachadas con protección UV
4. **Solución Interior** - Para paredes pintadas o drywall
5. **Pintura Súper Hidrofóbica** - Para zonas de alto tráfico
6. **Nano Aditivo** - Para impermeabilizar concreto
7. **Eco Capturador™** - Para minería sin mercurio
8. **Ultra F3™** - Espuma extintora biodegradable
9. **Aditivo Asfáltico** - Para pavimentación
10. **Línea Car Care & Luxury** - Para vehículos y superficies de lujo

## Seguridad

El asesor siempre recuerda las precauciones de seguridad:
- Uso de mascarilla para polvos
- Uso de guantes para productos químicos
- No inventar soluciones fuera del catálogo

## Contacto

Para soporte técnico o más información:
- Visita nuestro sitio web
- Contacta a nuestro equipo directamente
- Usa el enlace "contactenos" en la cabecera