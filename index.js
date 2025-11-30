window.onload = function() {

    const button = document.getElementById('myButton');
    button.addEventListener('click', async () => {
        try {
            const routine = await getRoutine();
            console.log('Generated Routine:', routine);
            // You can add code here to display the routine on the webpage
        } catch (error) {
            console.error('Error generating routine:', error);
        }
    });
    const themeToggle = document.getElementById("themeToggle");
    themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark")
    ? "☀️"
    : "🌙";
});

// Chat history toggle
const toggleHistory = document.getElementById("toggleHistory");
const historyList = document.getElementById("historyList");

toggleHistory.addEventListener("click", () => {
  historyList.classList.toggle("hidden");
});

// Convert to PDF (simple version)
document.querySelector(".pdf-btn").addEventListener("click", () => {
  const chatBox = document.getElementById("chatBox").innerText;
  const blob = new Blob([chatBox], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "motionai-chat.pdf";
  link.click();
}
);
};