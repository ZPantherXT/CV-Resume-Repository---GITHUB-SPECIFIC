const KEY = "AIzaSyDmmJ-zRqsCvY_mfESR8G5hcim7b5I9xrM"; 
let mode = "";

function start(m) {
    mode = m;
    document.getElementById('landing').style.display = 'none';
    document.getElementById('builder').style.display = 'flex'; // Use flex to fix the crash
    // Thinner greeting
    document.getElementById('chat').innerHTML = `<div class="spec-msg"><b>Specialist:</b> Session initiated. State your Name and Job Role.</div>`;
}

async function send() {
    const input = document.getElementById('in');
    const chat = document.getElementById('chat');
    if (!input.value.trim()) return;

    chat.innerHTML += `<div style="color:#888; margin-bottom:15px;"><b>User:</b> ${input.value}</div>`;
    const userVal = input.value;
    input.value = "";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Persona: Specialist. Task: Building a ${mode}. User: "${userVal}". Return ONLY JSON: {"reply":"msg","name":"n"}` }] }] })
        });

        if (!response.ok) throw new Error();
        const data = await response.json();
        const clean = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim());

        chat.innerHTML += `<div class="spec-msg"><b>Specialist:</b> ${clean.reply}</div>`;
        if (clean.name) document.getElementById('n').innerText = clean.name;
    } catch {
        // Red Bold Error
        chat.innerHTML += `<div class="error-msg">CRITICAL: Connection to Specialist server lost.</div>`;
    }
    chat.scrollTop = chat.scrollHeight;
}
