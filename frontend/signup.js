const server = `http://localhost:3000`;
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const mail = document.getElementById("signupMail").value;
  const phoneno = document.getElementById("signupPhoneno").value;
  const password = document.getElementById("signupPassword").value;

  if (!username || !mail || !phoneno || !password) {
    alert("Please fill in all fields.");
    return;
  }
  try {
    let response = await fetch(`${server}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        mail: mail,
        phoneno: phoneno,
        password: password,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || "Signup failed. Please try again.");
      return;
    }
    const data = await response.json();

    localStorage.setItem("userId", data.userId);
    localStorage.setItem("username", data.username);
    localStorage.setItem("token", data.token);
    window.location = "./main.html";
  } catch (error) {
    console.error("Error during signup:", error);
    alert("An error occurred. Please try again later.");
  }
});
