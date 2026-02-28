// Funciones para el chat del asesor IA
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Respuestas del asesor IA
const aiResponses = [
    "Estoy procesando tu pregunta...",
    "Gracias por tu consulta. Déjame analizarlo...",
    "Tengo una respuesta para ti...",
    "Basado en mi conocimiento, te recomendaría...",
    "Esa es una excelente pregunta. La respuesta es...",
    "Permíteme ayudarte con eso...",
    "Según mis cálculos, la solución es...",
    "Entiendo tu inquietud. Mi sugerencia es..."
];

// Palabras clave y respuestas específicas
const keywordResponses = {
    "hola": "¡Hola! Bienvenido al asesor IA de Ultraseco. ¿En qué puedo ayudarte hoy?",
    "gracias": "¡De nada! Estoy aquí para ayudarte en lo que necesites.",
    "adios": "¡Hasta luego! No dudes en volver si tienes más preguntas.",
    "contacto": "Para contactarnos, puedes usar el enlace 'contactenos' en la cabecera o enviarnos un mensaje directamente.",
    "servicios": "En Ultraseco ofrecemos soluciones innovadoras y personalizadas para tus necesidades. ¿Sobre qué servicio te gustaría saber más?",
    "precios": "Los precios varían según el proyecto y tus necesidades específicas. ¿Podrías contarme más sobre lo que buscas?",
    "horario": "Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00. El asesor IA está disponible 24/7 para ayudarte.",
    "ayuda": "Estoy aquí para ayudarte. Por favor, dime qué necesitas y haré todo lo posible por asistirte."
};

// Enviar mensaje al presionar Enter
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Enviar mensaje al hacer clic en el botón
sendBtn.addEventListener('click', sendMessage);

function sendMessage() {
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Añadir mensaje del usuario
    addMessage(message, 'user');
    
    // Limpiar input
    userInput.value = '';
    
    // Mostrar typing indicator
    showTypingIndicator();
    
    // Responder después de un breve delay
    setTimeout(() => {
        removeTypingIndicator();
        const response = generateResponse(message);
        addMessage(response, 'ai');
    }, 1500);
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

function generateResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Buscar coincidencias con palabras clave
    for (const keyword in keywordResponses) {
        if (lowerMessage.includes(keyword)) {
            return keywordResponses[keyword];
        }
    }
    
    // Si no hay coincidencias específicas, usar una respuesta aleatoria
    const randomIndex = Math.floor(Math.random() * aiResponses.length);
    return aiResponses[randomIndex];
}

// Mensaje de bienvenida al cargar la página
window.addEventListener('load', () => {
    // El mensaje de bienvenida ya está en el HTML
    chatBox.scrollTop = chatBox.scrollHeight;
});