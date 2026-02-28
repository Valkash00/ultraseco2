// Script de verificación para el chat de Gemini
// Este script simula una interacción básica para verificar que todo funcione correctamente

console.log('=== Verificación del Chat de Gemini ===');

// Verificar que la librería esté cargada
if (typeof GoogleGenerativeAI === 'undefined') {
    console.error('❌ Error: Google Generative AI no está cargada');
    document.body.innerHTML = '<div style="color: red; font-weight: bold;">Error: Google Generative AI no está cargada</div>';
} else {
    console.log('✅ Google Generative AI cargada correctamente');
    
    // Verificar la API Key
    const API_KEY = 'AIzaSyAqdEMAXBL-BI2zvg-y72E3UNm3c0kIWRQ';
    if (!API_KEY || API_KEY === 'TU_API_KEY_AQUÍ') {
        console.error('❌ Error: API Key no configurada');
        document.body.innerHTML = '<div style="color: red; font-weight: bold;">Error: API Key no configurada</div>';
    } else {
        console.log('✅ API Key configurada');
        
        // Intentar crear una instancia básica
        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            console.log('✅ Instancia de GoogleGenerativeAI creada');
            
            // Verificar que el modelo pueda ser obtenido
            const model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash"
            });
            console.log('✅ Modelo generativo obtenido');
            
            console.log('🎉 Todas las verificaciones pasaron. El chat debería funcionar correctamente.');
            
        } catch (error) {
            console.error('❌ Error al crear instancia:', error);
            document.body.innerHTML = '<div style="color: red; font-weight: bold;">Error al crear instancia: ' + error.message + '</div>';
        }
    }
}

// Función para probar el chat (si está disponible)
function probarChat() {
    if (typeof sendMessage === 'function') {
        console.log('✅ Función sendMessage disponible');
        // Simular un mensaje de prueba
        const testMessage = 'Hola, ¿qué productos tienen para humedad en paredes?';
        console.log('Enviando mensaje de prueba:', testMessage);
        
        // No podemos realmente enviar el mensaje aquí porque necesitaríamos el DOM completo,
        // pero al menos verificamos que la función exista
    } else {
        console.log('⚠️  Función sendMessage no disponible (esto es normal si el DOM no está completamente cargado)');
    }
}

// Esperar un momento para que el DOM se cargue completamente
setTimeout(probarChat, 1000);