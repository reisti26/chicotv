import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD2R4znYhhF32Ae_AUmKnvCvElrYL_Wxk0",
    authDomain: "chico-tv-plus.firebaseapp.com",
    projectId: "chico-tv-plus",
    storageBucket: "chico-tv-plus.firebasestorage.app",
    messagingSenderId: "715193629363",
    appId: "1:715193629363:web:e3560a01b18b5c6b89cec6",
    measurementId: "G-RLDFB73T5N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DOM Elements
const loginForm = document.getElementById('loginForm');
const tvCodeInput = document.getElementById('tvCode');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const loader = document.getElementById('loader');
const statusMessage = document.getElementById('statusMessage');

// 1. Auto-fill code from URL if present (?code=347554)
const urlParams = new URLSearchParams(window.location.search);
const codeParam = urlParams.get('code');
if (codeParam) {
    tvCodeInput.value = codeParam;
}

// 2. Handle Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const code = tvCodeInput.value.trim();
    const user = usernameInput.value.trim();
    const pass = passwordInput.value;

    if (code.length !== 6) {
        showStatus('O código deve ter 6 dígitos.', 'error');
        return;
    }

    setLoading(true);

    try {
        // 3. Write credentials to Firebase Realtime Database
        // Path: auth_codes/SECRET_CODE
        const authRef = ref(database, 'auth_codes/' + code);
        
        await set(authRef, {
            username: user,
            password: pass,
            timestamp: Date.now(),
            status: 'sent'
        });

        showStatus('Conectado! Verifique sua TV agora.', 'success');
        loginForm.reset();
        
    } catch (error) {
        console.error("Erro ao enviar dados:", error);
        showStatus('Falha ao conectar. Verifique sua conexão.', 'error');
    } finally {
        setLoading(false);
    }
});

// UI Helpers
function setLoading(loading) {
    if (loading) {
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').style.display = 'none';
        loader.style.display = 'block';
    } else {
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').style.display = 'block';
        loader.style.display = 'none';
    }
}

function showStatus(msg, type) {
    statusMessage.textContent = msg;
    statusMessage.className = 'status-message ' + (type === 'success' ? 'status-success' : 'status-error');
    statusMessage.style.display = 'block';
    
    if (type === 'success') {
        // Optional: play haptic feedback or sound
    }
}
