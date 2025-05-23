document.getElementById('speak-btn').addEventListener('click', () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'bn-BD';

    recognition.onstart = () => {
        appendMessage("🤖 শুনছি...", "bot");
    };

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        appendMessage("🧑‍🦰 " + transcript, "user");

        const response = await fetch('http://localhost:5000/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: transcript })
        });
        const data = await response.json();
        appendMessage("🤖 " + data.reply, "bot");

        const tts = new SpeechSynthesisUtterance(data.reply);
        tts.lang = 'bn-BD';
        window.speechSynthesis.speak(tts);
    };

    recognition.start();
});

function appendMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const msgElem = document.createElement('div');
    msgElem.className = sender;
    msgElem.textContent = message;
    chatBox.appendChild(msgElem);
    chatBox.scrollTop = chatBox.scrollHeight;
}