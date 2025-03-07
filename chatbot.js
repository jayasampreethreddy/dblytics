let chatBox = document.getElementById("chat-box");
let chatIcon = document.getElementById("chat-icon");

// Toggle Chatbox when clicking the chat icon
chatIcon.onclick = function() {
    if (chatBox.style.display === "none" || chatBox.style.display === "") {
        chatBox.style.display = "flex";  // Open chat
    } else {
        chatBox.style.display = "none";  // Collapse chat
    }
};

// Close Chatbox when clicking ❌ button
document.getElementById("close-chat").onclick = function() {
    chatBox.style.display = "none";
};

// Function to send message
async function sendMessage() {
    let inputField = document.getElementById("chat-input");
    let userMessage = inputField.value.trim();
    if (!userMessage) return;

    let chatMessages = document.getElementById("chat-messages");
    
    // Add User Message (Right-Aligned)
    let userMsgDiv = document.createElement("div");
    userMsgDiv.style.cssText = "background: #ff6961; color: white; padding: 8px; border-radius: 10px; margin: 5px 0; max-width: 75%; align-self: flex-end; text-align: right;";
    userMsgDiv.innerText = userMessage;
    chatMessages.appendChild(userMsgDiv);

    // Send message to n8n
    try {
        let response = await fetch("https://sampreeth1.app.n8n.cloud/webhook/c63f5cba-1f76-4d83-b6bf-4c23c9cb799a/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });

        let data = await response.json();
        let aiMessage = data.reply || "Error: No valid response.";

        // Add AI Response (Left-Aligned)
        let aiMsgDiv = document.createElement("div");
        aiMsgDiv.style.cssText = "background: #333; color: white; padding: 8px; border-radius: 10px; margin: 5px 0; max-width: 75%; align-self: flex-start; text-align: left;";
        aiMsgDiv.innerText = aiMessage;
        chatMessages.appendChild(aiMsgDiv);

    } catch (error) {
        let errorDiv = document.createElement("div");
        errorDiv.style.cssText = "background: red; color: white; padding: 8px; border-radius: 10px; margin: 5px 0; max-width: 75%; align-self: flex-start; text-align: left;";
        errorDiv.innerText = "Error connecting to chatbot.";
        chatMessages.appendChild(errorDiv);
    }

    inputField.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to latest message
}

// Click Send Button to Send Message
document.getElementById("send-btn").onclick = sendMessage;

// Press "Enter" Key to Send Message
document.getElementById("chat-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
        event.preventDefault(); // Prevent newline in input field
    }
});
