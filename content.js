const SESSION_PROVIDER = "https://session.coolmathblox.ca/";
const sessionToken = localStorage.getItem("session_v1");
let intervalId = null;
let farming = false;

if (!sessionToken) {
    console.error("Coin Farmer Extension: No session token found.");
}

//--- API---

async function getAccountInfo() {
    try {
        const res = await fetch(SESSION_PROVIDER + "accounts/me", {
            method: "POST",
            headers: {
                Authorization: sessionToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({})
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

async function sendRewardedAd() {
    try {
        await fetch(SESSION_PROVIDER + "rewarded_ad", {
            method: "POST",
            headers: {
                Authorization: sessionToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({})
        });
    } catch {}
}

//---UI---

const ui = document.createElement("div");
ui.style = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    width: 260px;
    background: rgba(20, 20, 20, 0.92);
    padding: 15px;
    border-radius: 12px;
    color: white;
    font-family: Arial;
    font-size: 14px;
    z-index: 999999;
    display: none;
    border: 1px solid #00ffcc;
    box-shadow: 0 0 18px #00ffaa;
    text-align: center;
`;

ui.innerHTML = `
    <h3 style="margin:0 0 10px 0; font-size:18px;">Coin Farmer</h3>

    <div id="coinDisplay" style="margin-bottom:12px;">Coins: Loading...</div>

    <button id="startBtn" class="neonBtn">Start Farming</button>
    <button id="stopBtn" class="neonBtn" style="margin-top:8px;">Stop Farming</button>
    <button id="refreshBtn" class="neonBtn" style="margin-top:8px;">Refresh Game</button>

    <p style="margin-top:10px; opacity:0.6; font-size:12px;">Press "\\" to toggle UI</p>
`;

document.body.appendChild(ui);

const style = document.createElement("style");
style.textContent = `
    .neonBtn {
        width: 100%;
        padding: 10px;
        background: #002b26 !important;
        color: white !important;
        border: 2px solid #00ffcc !important;
        border-radius: 8px !important;
        cursor: pointer;
        font-size: 15px;
        font-weight: 600;
        transition: 0.25s;
        display: block;
        text-align: center;
        box-shadow: 0 0 10px #00ffaa;
    }

    .neonBtn:hover {
        background: #004d45 !important;
        box-shadow: 0 0 15px #00ffcc, 0 0 30px #00ffaa;
        transform: scale(1.05);
    }

    .neonBtn:active {
        transform: scale(0.97);
        box-shadow: 0 0 8px #00ffaa;
    }
`;
document.head.appendChild(style);
const coinDisplay = ui.querySelector("#coinDisplay");
const startBtn = ui.querySelector("#startBtn");
const stopBtn = ui.querySelector("#stopBtn");
const refreshBtn = ui.querySelector("#refreshBtn");

//---UI LOGIC---

async function updateCoins() {
    const info = await getAccountInfo();
    if (info && info.coins !== undefined) {
        coinDisplay.textContent = "Coins: " + info.coins;
    } else {
        coinDisplay.textContent = "Coins: Error";
    }
}

function startLoop() {
    if (farming) return;
    farming = true;
    intervalId = setInterval(sendRewardedAd, 5800);
    sendRewardedAd();
    updateCoins();
}

function stopLoop() {
    farming = false;
    clearInterval(intervalId);
}

startBtn.onclick = startLoop;
stopBtn.onclick = stopLoop;
refreshBtn.onclick = () => location.reload();

document.addEventListener("keydown", (e) => {
    if (e.key === "\\") {
        ui.style.display = ui.style.display === "none" ? "block" : "none";
        updateCoins();
    }
});

updateCoins();
setInterval(updateCoins, 1000);