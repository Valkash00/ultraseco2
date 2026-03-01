// Función para comunicarse con el Cloudflare Worker
async function preguntarAlAsesor(mensajeUsuario) {
  try {
    const response = await fetch('https://asesor-ultraseco.workthingstesting.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: mensajeUsuario })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error('Error al comunicarse con el asesor:', error);
    throw error;
  }
}

// Función para agregar un mensaje al chat
function agregarMensaje(texto, esUsuario = false) {
  const chatBox = document.getElementById('chat-box');
  const mensajeDiv = document.createElement('div');
  mensajeDiv.className = esUsuario ? 'message user-message' : 'message ai-message';
  
  const contenidoDiv = document.createElement('div');
  contenidoDiv.className = 'message-content';
  
  const parrafo = document.createElement('p');
  
  contenidoDiv.appendChild(parrafo);
  mensajeDiv.appendChild(contenidoDiv);
  chatBox.appendChild(mensajeDiv);
  
  // Auto-scroll hacia abajo
  chatBox.scrollTop = chatBox.scrollHeight;
  
  // Efecto de máquina de escribir para mensajes de IA
  if (!esUsuario) {
    escribirTexto(parrafo, texto);
  } else {
    parrafo.textContent = texto;
  }
}

// Función para el efecto de máquina de escribir
function escribirTexto(elemento, texto) {
  let i = 0;
  const timer = setInterval(() => {
    if (i < texto.length) {
      elemento.textContent += texto.charAt(i);
      i++;
      // Auto-scroll mientras se escribe
      const chatBox = document.getElementById('chat-box');
      chatBox.scrollTop = chatBox.scrollHeight;
    } else {
      clearInterval(timer);
    }
  }, 20); // Velocidad de escritura: 20ms por carácter
}

// Función para mostrar el estado de carga
function mostrarCargando() {
  const chatBox = document.getElementById('chat-box');
  const cargandoDiv = document.createElement('div');
  cargandoDiv.className = 'message ai-message loading';
  cargandoDiv.id = 'loading-message';
  
  const contenidoDiv = document.createElement('div');
  contenidoDiv.className = 'message-content';
  
  const parrafo = document.createElement('p');
  parrafo.textContent = 'Escribiendo...';
  
  contenidoDiv.appendChild(parrafo);
  cargandoDiv.appendChild(contenidoDiv);
  chatBox.appendChild(cargandoDiv);
  
  // Auto-scroll hacia abajo
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Función para eliminar el estado de carga
function eliminarCargando() {
  const cargandoDiv = document.getElementById('loading-message');
  if (cargandoDiv) {
    cargandoDiv.remove();
  }
}

// Función para enviar un mensaje
async function sendMessage() {
  const input = document.getElementById('user-input');
  const mensaje = input.value.trim();
  
  if (!mensaje) return;
  
  // Limpiar el input
  input.value = '';
  
  // Mostrar el mensaje del usuario
  agregarMensaje(mensaje, true);
  
  // Mostrar estado de carga
  mostrarCargando();
  
  try {
    // Enviar el mensaje al asesor IA
    const respuesta = await preguntarAlAsesor(mensaje);
    
    // Eliminar el estado de carga
    eliminarCargando();
    
    // Mostrar la respuesta del asesor IA
    agregarMensaje(respuesta, false);
  } catch (error) {
    // Eliminar el estado de carga en caso de error
    eliminarCargando();
    
    // Mostrar un mensaje de error
    agregarMensaje('Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.', false);
  }
}

// Evento para detectar cuando se presiona Enter en el input
document.getElementById('user-input').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
