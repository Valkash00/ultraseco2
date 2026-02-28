// Script para el chat con Google Gemini 2.5 Flash
let generativeModel;
let chatSession;

// Configuración del prompt de sistema
const systemPrompt = `Eres el Asistente Técnico Experto de UltraSeco. Tu misión es asesorar a clientes, contratistas y dueños de hogar para que elijan la solución hidrofóbica o de mantenimiento adecuada según su problema específico.

### REGLAS DE ORO:
1. DIAGNÓSTICO PRIMERO: Antes de recomendar, pregunta qué superficie quieren tratar (pared, piso, concreto, vehículo o minería) y qué problema tienen (humedad, filtración, suciedad o falta de brillo).
2. TERMINOLOGÍA TÉCNICA: Usa términos de las fichas como "Efecto Loto", "Nanotecnología", "Hidrofóbico" y "Protección 3D" para generar confianza.
3. SEGURIDAD: Siempre que se mencione el Nano Aditivo o el Escudo Cerámico, recuerda las precauciones básicas (uso de mascarilla para polvos o guantes).
4. NO INVENTAR: Si el cliente pide algo que no está en el catálogo, indica que no está disponible pero ofrece la alternativa más cercana.

### CATÁLOGO DE SOLUCIONES (Resumen Técnico):

1. Estuco Hidrofóbico: Pasta lista para usar. Ideal para paredes que sufren de humedad por capilaridad leve. Ahorra 30% de pintura.
2. Fortificador™: Consolidante para paredes arenosas o pisos de concreto viejos que sueltan polvo. Se usa puro para sellar o 1:3 como primer.
3. Solución Exterior: Protector invisible para fachadas (ladrillo, concreto) con protección UV. No amarillea.
4. Solución Interior: Nanotecnología para paredes pintadas o drywall. Invisible y transpirable (deja que la pared respire).
5. Pintura Súper Hidrofóbica (Tipo A): Con tecnología "Easy-Clean". Soporta 5,000 ciclos de lavado. Ideal para zonas de alto tráfico o húmedas.
6. Nano Aditivo: Impermeabilizante integral para mezclas de concreto (impermeabilización 3D). Se mezcla en seco con el cemento.
7. Eco Capturador™: Tecnología para minería. Mejora la captura de oro fino en alfombras sin usar mercurio.
8. Ultra F3™: Espuma extintora biodegradable libre de flúor para incendios Clase A y B.
9. Aditivo Asfáltico: Promotor de adherencia para pavimentación. Evita baches y resiste humedad extrema.
10. Línea Car Care & Luxury: 
    - Champú Nano: pH neutro con cera.
    - Cera Nano Protectora: Mantenimiento con Carnauba y polímeros.
    - Escudo Cerámico 9H: Protección permanente para topes de granito, mármol y vidrios. Resiste rayones y ácidos.

### FORMATO DE RESPUESTA:
- Saludo amable.
- Breve explicación de por qué recomiendas x producto.
- Menciona un beneficio clave (ej: "Esto hará que tu pintura rinda 30% más").
- Instrucción rápida de aplicación (ej: "Recuerda que para el Fortificador debes diluir 1:3 en paredes").`;

// Configuración de la API (para desarrollo - en producción usar variables de entorno)
const API_CONFIG = {
    apiKey: 'AIzaSyAqdEMAXBL-BI2zvg-y72E3UNm3c0kIWRQ', // Reemplazar con variable de entorno en producción
    modelName: 'gemini-1.5-flash',
    maxRetries: 3,
    retryDelay: 1000
};

// Función para inicializar el modelo con reintentos
async function initializeGemini() {
    let retries = 0;
    
    while (retries < API_CONFIG.maxRetries) {
        try {
            // Verificar si la librería se cargó correctamente
            if (typeof GoogleGenerativeAI === 'undefined') {
                throw new Error('La librería Google Generative AI no se cargó correctamente');
            }

            // Validar API Key
            if (!API_CONFIG.apiKey || API_CONFIG.apiKey === 'TU_API_KEY_AQUÍ') {
                throw new Error('API Key no configurada. Por favor, configura una API Key válida.');
            }

            // Inicializar el modelo con la API Key de Gemini
            const genAI = new GoogleGenerativeAI(API_CONFIG.apiKey);
            generativeModel = genAI.getGenerativeModel({ 
                model: API_CONFIG.modelName,
                systemInstruction: systemPrompt
            });

            // Iniciar sesión de chat
            chatSession = generativeModel.startChat({
                generationConfig: {
                    temperature: 0.7,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 500,
                },
            });

            console.log('Asesor IA con Gemini inicializado correctamente');
            return true;
            
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

// Inicializar el modelo cuando el script se cargue
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initializeGemini();
        
    } catch (error) {
        console.error('Error crítico al inicializar Gemini:', error);
        mostrarErrorInicializacion(error);
    }
});

// Elementos del DOM
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Eventos
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

// Funciones principales
async function sendMessage() {
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    console.log('Enviando mensaje al modelo:', message);
    
    // Añadir mensaje del usuario
    addMessage(message, 'user');
    
    // Limpiar input
    userInput.value = '';
    
    // Mostrar typing indicator
    showTypingIndicator();
    
    try {
        console.log('Llamando a chatSession.sendMessage...');
        // Enviar mensaje a Gemini
        const result = await chatSession.sendMessage(message);
        console.log('Respuesta recibida del modelo');
        
        const response = await result.response;
        console.log('Procesando respuesta...');
        
        const text = response.text();
        console.log('Texto de respuesta:', text);
        
        removeTypingIndicator();
        addMessage(text, 'ai');
        
    } catch (error) {
        console.error('Error al comunicarse con Gemini:', error);
        console.error('Tipo de error:', error.constructor.name);
        console.error('Mensaje de error:', error.message);
        
        removeTypingIndicator();
        
        // Mensaje de error amigable
        const errorMessage = "Lo siento, actualmente no puedo acceder al asesor técnico. Por favor, intenta de nuevo en unos momentos o contacta a nuestro equipo directamente.";
        addMessage(errorMessage, 'ai');
    }
}

function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    
    contentDiv.appendChild(paragraph);
    messageDiv.appendChild(contentDiv);
    chatBox.appendChild(messageDiv);
    
    // Desplazar hacia abajo
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message';
    typingDiv.id = 'typing-indicator';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const dots = document.createElement('div');
    dots.className = 'typing-dots';
    dots.innerHTML = '<span></span><span></span><span></span>';
    
    contentDiv.appendChild(dots);
    typingDiv.appendChild(contentDiv);
    chatBox.appendChild(typingDiv);
    
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function mostrarErrorInicializacion(error) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message ai-message';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const paragraph = document.createElement('p');
    
    if (error && error.message) {
        if (error.message.includes('API Key')) {
            paragraph.innerHTML = `⚠️ <strong>Configuración requerida:</strong> ${error.message}<br><br>Para usar este asesor técnico, necesitas:<br>1. Obtener una API Key de <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a><br>2. Reemplazar la API Key en el archivo asesor-gemini.js`;
        } else if (error.message.includes('librería')) {
            paragraph.innerHTML = `⚠️ <strong>Error de carga:</strong> ${error.message}<br><br>Por favor, asegúrate de que el proyecto esté correctamente configurado o contacta al administrador.`;
        } else {
            paragraph.innerHTML = `⚠️ <strong>Error:</strong> ${error.message}<br><br>Por favor, verifica la consola para más detalles o contacta a nuestro equipo directamente.`;
        }
    } else {
        paragraph.innerHTML = '⚠️ <strong>Importante:</strong> Error al cargar el asesor técnico con Google Gemini. Por favor, verifica la consola para más detalles o contacta a nuestro equipo directamente.';
    }
    
    contentDiv.appendChild(paragraph);
    errorDiv.appendChild(contentDiv);
    chatBox.appendChild(errorDiv);
    
    chatBox.scrollTop = chatBox.scrollHeight;
}
