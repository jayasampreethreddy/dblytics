document.addEventListener("DOMContentLoaded", function () {
    let chatBox = document.getElementById("chat-box");
    let chatIcon = document.getElementById("chat-icon");
    let closeChat = document.getElementById("close-chat");
    let sendBtn = document.getElementById("send-btn");
    let chatInput = document.getElementById("chat-input");
    let chatMessages = document.getElementById("chat-messages");

    if (!chatBox || !chatIcon || !closeChat || !sendBtn || !chatInput || !chatMessages) {
        console.error("Error: Chat elements not found. Check HTML structure.");
        return;
    }

    // Toggle Chatbox when clicking the chat icon
    chatIcon.onclick = function () {
        chatBox.style.display = (chatBox.style.display === "none" || chatBox.style.display === "") ? "flex" : "none";
    };

    // Close Chatbox when clicking ❌ button
    closeChat.onclick = function () {
        chatBox.style.display = "none";
    };

    // Function to send message
    async function sendMessage() {
        let userMessage = chatInput.value.trim();
        if (!userMessage) return;

        // Add User Message
        let userMsgDiv = document.createElement("div");
        userMsgDiv.style.cssText = "background: #ff6961; color: white; padding: 8px; border-radius: 10px; margin: 5px 0; max-width: 75%; align-self: flex-end; text-align: right;";
        userMsgDiv.innerText = userMessage;
        chatMessages.appendChild(userMsgDiv);

        chatInput.value = ""; // Clear input field
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to latest message

        // Send message to n8n
        try {
            let response = await fetch("https://sampreeth1.app.n8n.cloud/webhook/c63f5cba-1f76-4d83-b6bf-4c23c9cb799a/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage })
            });

            let data = await response.json();
            let aiMessage = data.reply || "Error: No valid response.";

            // Add AI Response
            let aiMsgDiv = document.createElement("div");
            aiMsgDiv.style.cssText = "background: #333; color: white; padding: 8px; border-radius: 10px; margin: 5px 0; max-width: 75%; align-self: flex-start; text-align: left;";
            aiMsgDiv.innerText = aiMessage;
            chatMessages.appendChild(aiMsgDiv);
        } catch (error) {
            console.error("Error sending message:", error);
            let errorDiv = document.createElement("div");
            errorDiv.style.cssText = "background: red; color: white; padding: 8px; border-radius: 10px; margin: 5px 0; max-width: 75%; align-self: flex-start; text-align: left;";
            errorDiv.innerText = "Error connecting to chatbot.";
            chatMessages.appendChild(errorDiv);
        }
    }

    // Click Send Button to Send Message
    sendBtn.onclick = sendMessage;

    // Press "Enter" Key to Send Message
    chatInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
            event.preventDefault(); // Prevent newline in input field
        }
    });
});
