// PASTE YOUR NEW KEY FROM GOOGLE AI STUDIO HERE
const KEY = "YOUR_NEW_API_KEY_HERE"; 
let m = ""; 

async function start(mode) { 
    m = mode; 
    document.getElementById('landing').style.display = 'none'; 
    document.getElementById('builder').style.display = 'grid'; 
    
    const chat = document.getElementById('chat');
    chat.innerHTML = `
        <div class="spec-msg">
            <b>Specialist:</b> Session initiated. State your Full Name and the specific Job Role you are targeting.
        </div>`;
}

function send() { 
    const i = document.getElementById('in'); 
    const chat = document.getElementById('chat');
    
    if (i.value.trim() !== "") { 
        chat.innerHTML += `<div style="margin-bottom:15px; color:#ccc;"><b>User:</b> ${i.value}</div>`; 
        callAI(i.value); 
        i.value = ''; 
        chat.scrollTop = chat.scrollHeight; 
    } 
}

async function callAI(userInput) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`, {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Persona: Expert Career Specialist. Task: Building a ${m}. 
                        User Input: "${userInput}". 
                        Return ONLY this JSON format: {"reply":"your response", "name":"full name if known", "role":"job title if known", "summary":"bio", "experience":"html list"}
                        Rule: Do not add any text outside the JSON brackets.`
                    }]
                }]
            })
        });

        if (!response.ok) throw new Error('API Key Invalid or Limit Hit');

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        
        // Clean JSON extraction
        const cleanJson = JSON.parse(rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1));

        if (cleanJson.reply) {
            document.getElementById('chat').innerHTML += `
                <div class="spec-msg"><b>Specialist:</b> ${cleanJson.reply}</div>`;
        }

        // Live Update Preview
        if (cleanJson.name) document.getElementById('n').innerText = cleanJson.name;
        if (cleanJson.role) document.getElementById('r').innerText = cleanJson.role;
        if (cleanJson.summary) document.getElementById('s').innerText = cleanJson.summary;
        if (cleanJson.experience) document.getElementById('e').innerHTML = cleanJson.experience;

        document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;

    } catch (error) {
        console.error("DEBUG ERROR:", error); // Look at F12 console to see the real error
        document.getElementById('chat').innerHTML += `
            <div style="color:#ff4d00; margin-bottom:15px; font-weight:bold;">
                SYSTEM ERROR: Connection failed. Check if your API Key is valid in script.js.
            </div>`;
    }
}
