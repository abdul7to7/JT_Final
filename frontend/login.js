const server = "https://jt-final-1-backend.onrender.com";
// const server = "http://localhost:3000";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitButton = e.target.querySelector("button[type='submit']");
  submitButton.disabled = true;
  const mail = document.getElementById("loginMail").value;
  const password = document.getElementById("loginPassword").value;

  if (!mail || !password) {
    alert("Please enter both mail and password.");
    return;
  }

  try {
    const data = await getAuth(mail, password);
    if (!(data && data.success)) {
      alert(data?.message || "Login failed. Please try again.");
      return;
    }

    localStorage.setItem("userId", data.userId);
    localStorage.setItem("mail", data.username);
    localStorage.setItem("token", data.token);
    submitButton.disabled = false;

    window.location = "./main.html";
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred during login. Please try again later.");
  }
});

async function getAuth(mail, password) {
  try {
    let res = await fetch(`${server}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mail: mail,
        password: password,
      }),
    });
    res = await res.json();
    return res;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
