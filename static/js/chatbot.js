document.addEventListener('DOMContentLoaded', function () {
    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatbot = document.getElementById('close-chatbot');
    const sendMessageButton = document.getElementById('send-message');
    const userInput = document.getElementById('user-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    
    let chatbotResponses = {};
    let typoCorrections = {};

    // Cargar archivos JSON
    fetch('/server/chatbotResponses.json')
        .then(response => response.json())
        .then(data => chatbotResponses = data)
        .catch(error => console.error('Error al cargar chatbotResponses.json:', error));

    fetch('/server/typoCorrections.json')
        .then(response => response.json())
        .then(data => typoCorrections = data)
        .catch(error => console.error('Error al cargar typoCorrections.json:', error));

    // Mostrar/ocultar el chatbot sin desplazarse hacia arriba
    chatbotIcon.addEventListener('click', function (event) {
        event.preventDefault(); // Evita el desplazamiento hacia arriba
        chatbotWindow.style.display = chatbotWindow.style.display === 'none' ? 'block' : 'none';
    });

    closeChatbot.addEventListener('click', function () {
        chatbotWindow.style.display = 'none';
    });

    sendMessageButton.addEventListener('click', function () {
        const userMessage = userInput.value.trim().toLowerCase();
        if (userMessage) {
            appendMessage('Tú', userMessage);
            processUserMessage(userMessage);
            userInput.value = '';
        }
    });

    userInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            sendMessageButton.click();
        }
    });

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function processUserMessage(message) {
        let response = '';

        // Corrección de errores ortográficos
        const correctedMessage = message.split(' ').map(word => {
            return typoCorrections[word] || word;
        }).join(' ');

        // Buscar respuesta en el diccionario
        Object.keys(chatbotResponses).forEach(function (key) {
            if (correctedMessage.includes(key)) {
                response = chatbotResponses[key];
            }
        });

        // Respuesta genérica si no se encuentra una específica
        if (!response) {
            response = 'Lo siento, no entiendo esa pregunta. ¿Podrías intentarlo de nuevo o preguntar sobre "fertilizantes", "insecticidas" o "comprar"?';
        }

        // Mostrar respuesta del chatbot con un pequeño retraso
        setTimeout(() => appendMessage('Asistente', response), 500);
    }
});