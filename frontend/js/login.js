document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const verifyBtn = document.getElementById("verifyBtn");
  const loginStep = document.getElementById("login-step");
  const otpStep = document.getElementById("otp-step");
  const phoneInput = document.getElementById("phoneInput");

  let currentPhone = null; // store phone for OTP verification

  const BOT_USERNAME = "MotionAIOTPBot"; // <-- UPDATE THIS

  // STEP 1: User enters phone → show Telegram deep link
  loginBtn.addEventListener("click", () => {
    const phone = phoneInput.value.trim();
    if (!phone) return alert("Please enter your phone number");

    currentPhone = phone;

    const payload = phone.replace("+", ""); // Remove +
    const deepLink = `https://t.me/${BOT_USERNAME}?start=${payload}`;

    alert("Click this link in Telegram to get your OTP:\n\n" + deepLink);
    console.log(deepLink);
    // Switch UI immediately (user will open Telegram separately)
    loginStep.style.display = "none";
    otpStep.style.display = "block";

    document.querySelector(".otp-box").focus();
  });

  // OTP auto-focus
  const boxes = document.querySelectorAll(".otp-box");
  boxes.forEach((box, index) => {
    box.addEventListener("input", () => {
      if (box.value.length === 1 && index < boxes.length - 1) {
        boxes[index + 1].focus();
      }
    });
  });

  // STEP 2: Verify OTP
  verifyBtn.addEventListener("click", async () => {
    let otp = "";
    boxes.forEach((b) => (otp += b.value));

    if (otp.length !== 6) return alert("Enter all 6 digits");

    const res = await fetch("http://localhost:3000/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: currentPhone, otp }),
    });

    const data = await res.json();

    if (data.success) {
      alert("OTP Verified!");
      console.log("you are in mate.");
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid OTP");
    }
  });
});
