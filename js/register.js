document.getElementById("register-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const users = getUsers();
    const email = document.getElementById("email").value.trim().toLowerCase();
    if (users.some(u => u.email === email)) { alert("This email is already registered."); return; }
    users.push({
        firstName: document.getElementById("first-name").value.trim(),
        lastName: document.getElementById("last-name").value.trim(),
        email: email,
        password: document.getElementById("password").value
    });
    save("users", users);
    window.location.href = "login.html";
});
