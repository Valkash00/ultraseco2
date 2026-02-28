async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const sendBtn = document.getElementById('send-btn');
    const message = input.value.trim();

    if (!message) return;

    // 1. Mostrar mensaje del usuario en la interfaz
    appendMessage('user-message', message);
    input.value = '';
    
    // Bloquear el botón mientras la IA piensa
    sendBtn.disabled = true;
    input.disabled = true;

    // 2. Mostrar indicador de "Escribiendo..."
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message';
    typingDiv.innerHTML = `<div class="message-content"><p>Asesor UltraSeco está pensando...</p></div>`;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // 3. Llamada a la Netlify Function de forma segura
        const response = await fetch('/.netlify/functions/asesor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        
        // Quitar el "Escribiendo..."
        chatBox.removeChild(typingDiv);

        if (data.success) {
            // 4. Mostrar la respuesta técnica de UltraSeco
            appendMessage('ai-message', data.response);
        } else {
            throw new Error(data.error);
        }

    } catch (error) {
        console.error("Error:", error);
        chatBox.removeChild(typingDiv);
        appendMessage('ai-message', "Lo siento, tuve un problema de conexión. ¿Podrías intentar de nuevo?");
    } finally {
        sendBtn.disabled = false;
        input.disabled = false;
        input.focus();
    }
}

function appendMessage(className, text) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = `<div class="message-content"><p>${text}</p></div>`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Permitir enviar con la tecla Enter
document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});