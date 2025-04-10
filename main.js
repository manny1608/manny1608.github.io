const loginContainer = document.getElementById('loginContainer');
let user_credentials = {}

async function handleLogin(e) {

    e.preventDefault();
    const username = document.getElementById('username').value.toLowerCase();
    const password = document.getElementById('password').value;

    if (!(username in user_credentials)) {
        alert("Invalid Username/Password");
        document.getElementById('loginForm').reset();
        return;
    }

    const hashed_password = await generateHash(password);

    if (user_credentials[username].password !== hashed_password) {
        alert("Invalid Username/Password");
        document.getElementById('loginForm').reset();
        return;
    }

    const authData = {
        username,
        hashed_password,
        timestamp: new Date().getTime()
    };
    localStorage.setItem('authData', JSON.stringify(authData));

    loginContainer.style.display = 'none';

}

async function generateHash(input) {
    try {
        return CryptoJS.SHA256(input).toString();
    } catch (error) {
        return null;
    }
}

setInterval(() => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    if (!authData) {
        loginContainer.style.display = 'flex';
        document.getElementById('loginForm').reset();
        return;
    }

    const currentTime = new Date().getTime();
    const thirtyMinutes = 30 * 60 * 1000;

    if (currentTime - authData.timestamp > thirtyMinutes) {
        localStorage.removeItem('authData');
        loginContainer.style.display = 'flex';
        document.getElementById('loginForm').reset();
    }
}, 30000); // 30 seconds

function logout() {
    localStorage.removeItem('authData');
    loginContainer.style.display = 'flex';
    document.getElementById('loginForm').reset();
}

const initialAuthData = localStorage.getItem('authData');
if (!initialAuthData) {
    loginContainer.style.display = 'flex';
} else {
    loginContainer.style.display = 'none';
}

async function loadUserData() {
    const response = await fetch('./authData.json');
    const data = await response.json();
    return data;
}

document.addEventListener('DOMContentLoaded', async () => {
    const data = await loadUserData();
    user_credentials = data;
});
