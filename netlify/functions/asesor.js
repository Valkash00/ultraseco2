// Asesor Técnico UltraSeco - Función Netlify
// Conexión a Google Gemini 2.5 Flash con datos técnicos de UltraSeco

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Configuración del prompt de sistema con datos técnicos de UltraSeco
const systemPrompt = `Eres el Asistente Técnico Experto de UltraSeco. Tu misión es asesorar a clientes, contratistas y dueños de hogar para que elijan la solución hidrofóbica o de mantenimiento adecuada según su problema específico.

### DATOS TÉCNICOS CLAVE DE ULTRASECO:
- Estuco Hidrofóbico: Pasta lista para usar que ahorra 30% de pintura en aplicaciones de acabado.
- Nano Aditivo: Impermeabilizante integral para concreto que se mezcla en seco con el cemento para una impermeabilización 3D completa.
- Fortificador™: Consolidante para paredes arenosas o pisos de concreto viejos que sueltan polvo.
- Solución Exterior: Protector invisible para fachadas con protección UV que no amarillea.
- Solución Interior: Nanotecnología para paredes pintadas o drywall, invisible y transpirable.
- Pintura Súper Hidrofóbica (Tipo A): Tecnología "Easy-Clean" que soporta 5,000 ciclos de lavado.
- Eco Capturador™: Tecnología para minería que mejora la captura de oro fino sin usar mercurio.
- Ultra F3™: Espuma extintora biodegradable libre de flúor para incendios Clase A y B.
- Aditivo Asfáltico: Promotor de adherencia para pavimentación que evita baches y resiste humedad extrema.
- Línea Car Care & Luxury: Champú Nano, Cera Nano Protectora y Escudo Cerámico 9H para vehículos.

### REGLAS DE ORO:
1. DIAGNÓSTICO PRIMERO: Antes de recomendar, pregunta qué superficie quieren tratar (pared, piso, concreto, vehículo o minería) y qué problema tienen (humedad, filtración, suciedad o falta de brillo).
2. TERMINOLOGÍA TÉCNICA: Usa términos como "Efecto Loto", "Nanotecnología", "Hidrofóbico" y "Protección 3D" para generar confianza.
3. SEGURIDAD: Siempre que se mencione el Nano Aditivo o el Escudo Cerámico, recuerda las precauciones básicas (uso de mascarilla para polvos o guantes).
4. NO INVENTAR: Si el cliente pide algo que no está en el catálogo, indica que no está disponible pero ofrece la alternativa más cercana.

### FORMATO DE RESPUESTA:
- Saludo amable.
- Breve explicación de por qué recomiendas x producto.
- Menciona un beneficio clave (ej: "Esto hará que tu pintura rinda 30% más").
- Instrucción rápida de aplicación (ej: "Recuerda que para el Fortificador debes diluir 1:3 en paredes").`;

// Configuración de la API
const API_CONFIG = {
    modelName: 'gemini-1.5-flash',
    maxRetries: 3,
    retryDelay: 1000
};

// Función para inicializar el modelo con reintentos
async function initializeGemini() {
    let retries = 0;
    
    while (retries < API_CONFIG.maxRetries) {
        try {
            // Obtener API Key de variables de entorno
            const apiKey = process.env.GEMINI_API_KEY;
            
            if (!apiKey) {
                throw new Error('GEMINI_API_KEY no está configurada en las variables de entorno');
            }

            // Inicializar el modelo con la API Key de Gemini
            const genAI = new GoogleGenerativeAI(apiKey);
            const generativeModel = genAI.getGenerativeModel({ 
                model: API_CONFIG.modelName,
                systemInstruction: systemPrompt
            });

            // Iniciar sesión de chat
            const chatSession = generativeModel.startChat({
                generationConfig: {
                    temperature: 0.7,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 500,
                },
            });

            console.log('Asesor IA con Gemini inicializado correctamente');
            return chatSession;
            
        } catch (error) {
            retries++;
            console.error(`Error al inicializar Gemini (intento ${retries}/${API_CONFIG.maxRetries}):`, error);
            
            if (retries >= API_CONFIG.maxRetries) {
                throw error;
            }
            
            // Esperar antes de reintentar
            await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay * retries));
        }
    }
}

// Variable para almacenar la sesión de chat
let chatSession = null;

// Función principal de la API
exports.handler = async (event) => {
    try {
        // Parsear el cuerpo de la solicitud
        const body = JSON.parse(event.body);
        const message = body.message;
        
        if (!message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ 
                    error: 'Se requiere un mensaje en el cuerpo de la solicitud' 
                })
            };
        }

        // Inicializar la sesión de chat si no existe
        if (!chatSession) {
            chatSession = await initializeGemini();
        }

        // Enviar mensaje a Gemini
        const result = await chatSession.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ 
                response: text,
                success: true 
            })
        };

    } catch (error) {
        console.error('Error en la función asesor:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ 
                error: 'Error al procesar tu solicitud. Por favor, intenta de nuevo.',
                details: error.message,
                success: false 
            })
        };
    }
};