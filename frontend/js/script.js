//For toggling sidebar on and off
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleSidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

//For logging the user's prompt
document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.querySelector(".input-bar");

  const sendBtn = document.querySelector(".send-btn");

  const landingDiv = document.querySelector(".landingDiv");
  const chatView = document.querySelector("#chatView");

  // Auto-expand textarea height
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto"; // reset
    textarea.style.height = textarea.scrollHeight + "px";
  });

  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendBtn.click(); // trigger send
    }
    // Shift+Enter = allow newline
  });

  // Auto-scroll
  function scrollToBottom() {
    chatView.scrollTop = chatView.scrollHeight;
  }

  // AI typing effect
  function typeAIResponse(text, aiBubble) {
    let index = 0;
    const interval = setInterval(() => {
      aiBubble.textContent += text[index];
      index++;
      scrollToBottom();
      if (index === text.length) clearInterval(interval);
    }, 30);
  }

  sendBtn.addEventListener("click", () => {
    const prompt = textarea.value.trim();
    if (!prompt) return;

    // Hide landing, show chat
    landingDiv.style.display = "none";
    chatView.classList.remove("hidden");

    // USER BUBBLE
    const userBubble = document.createElement("div");
    userBubble.classList.add("chat-message", "user");
    userBubble.textContent = prompt;
    chatView.appendChild(userBubble);

    scrollToBottom();

    // AI “typing…” bubble
    const typingBubble = document.createElement("div");
    typingBubble.classList.add("chat-message", "ai");
    typingBubble.innerHTML = `
      <div class="typing">
        <span></span><span></span><span></span>
      </div>
    `;
    chatView.appendChild(typingBubble);

    scrollToBottom();

    textarea.value = "";
    textarea.style.height = "auto"; // Reset height after sending

    // --- REAL API CALL TO YOUR BACKEND ---
    async function fetchAIResponse(prompt) {
      try {
        const res = await fetch("http://localhost:3000/generate-routine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        const data = await res.json();

        if (data.status === "success" && data.data) {
          return JSON.stringify(data.data, null, 2); // pretty JSON string
        } else {
          return "Sorry, I could not generate a workout routine.";
        }
      } catch (e) {
        console.error("API error:", e);
        return "Server error. Please try again later.";
      }
    }

    // Fake AI delay
    setTimeout(async () => {
      typingBubble.remove(); // remove typing dots

      const aiWrapper = document.createElement("div");
      aiWrapper.classList.add("message-wrapper", "ai");

      // Get real AI response
      const aiReply = await fetchAIResponse(prompt);

      // --- AI BUBBLE ---
      const aiBubble = document.createElement("div");
      aiBubble.classList.add("chat-message", "ai");

      // --- Copy button ---
      const copyBtn = document.createElement("button");
      copyBtn.classList.add("copy-btn");
      copyBtn.innerHTML = copySVG;

      copyBtn.onclick = () => {
        navigator.clipboard.writeText(aiReply);
        copyBtn.innerHTML = checkSVG;
        setTimeout(() => (copyBtn.innerHTML = copySVG), 1500);
      };

      // --- Timestamp ---
      const timestamp = document.createElement("div");
      timestamp.classList.add("timestamp");
      timestamp.textContent = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // --- Row containing bubble + copy button ---
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "6px";

      row.appendChild(aiBubble);
      row.appendChild(copyBtn);

      aiWrapper.appendChild(row);
      aiWrapper.appendChild(timestamp);

      // Append to chat
      chatView.appendChild(aiWrapper);
      scrollToBottom();

      // TYPE ANIMATION
      typeAIResponse(aiReply, aiBubble);
    }, 1200);
  });
});

function addAIMessage(text) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("message-wrapper", "ai");

  // --- Bubble ---
  const bubble = document.createElement("div");
  bubble.classList.add("chat-message", "ai");
  bubble.textContent = text;

  // --- Copy button ---
  const copyBtn = document.createElement("button");
  copyBtn.classList.add("copy-btn");
  copyBtn.innerHTML = copySVG; // defined below

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(text);
    copyBtn.innerHTML = checkSVG;
    setTimeout(() => (copyBtn.innerHTML = copySVG), 1500);
  };

  // --- Timestamp ---
  const timestamp = document.createElement("div");
  timestamp.classList.add("timestamp");
  timestamp.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Put everything together
  const row = document.createElement("div");
  row.style.display = "flex";
  row.style.alignItems = "center";
  row.style.gap = "2px";

  row.appendChild(bubble);
  row.appendChild(copyBtn);

  wrapper.appendChild(row);
  wrapper.appendChild(timestamp);

  chatView.appendChild(wrapper);
  scrollToBottom();
}

//Copy button
const copySVG = `
<svg class="copy-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
  <path d="M8 7V5C8 3.895 8.895 3 10 3H19C20.105 3 21 3.895 21 5V14C21 15.105 20.105 16 19 16H17" 
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="3" y="7" width="14" height="14" rx="2" 
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

//Checkmark button
const checkSVG = `
<svg class="copy-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
  <path d="M5 13l4 4L19 7" 
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
