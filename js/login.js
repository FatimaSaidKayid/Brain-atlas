document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const user = getUsers().find(u => u.email === email && u.password === password);
    if (!user) { alert("Invalid email or password."); return; }
    save("currentUser", user);
    window.location.href = "index.html";
});
