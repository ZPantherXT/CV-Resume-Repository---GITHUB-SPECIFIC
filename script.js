const KEY = "AIzaSyDmmJ-zRqsCvY_mfESR8G5hcim7b5I9xrM"; 
let m = ""; 

// 1. Session Start Logic
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

// 2. Transmit Information Logic
function send() { 
    const i = document.getElementById('in'); 
    const chat = document.getElementById('chat');
    
    if (i.value.trim() !== "") { 
        // User text styling
        chat.innerHTML += `<div style="margin-bottom:15px; color:#ccc;"><b>User:</b> ${i.value}</div>`; 
        callAI(i.value); 
        i.value = ''; 
        chat.scrollTop = chat.scrollHeight; 
    } 
}

// 3. AI Communication Logic
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
                        Return ONLY this JSON format: {"reply":"your response", "name":"full name", "role":"job title", "summary":"bio", "experience":"html list"}
                        Rule: Use <li> tags for experience. If you don't have a value yet, keep it as an empty string "".`
                    }]
                }]
            })
        });

        const data = await response.json();
        
        // Error handling for API limits or keys
        if (!data.candidates) {
            throw new Error("API Limit reached or Key Error");
        }

        const rawText = data.candidates[0].content.parts[0].text;
        
        // Robust JSON extraction to prevent crashes
        const startIdx = rawText.indexOf('{');
        const endIdx = rawText.lastIndexOf('}');
        const cleanJson = JSON.parse(rawText.substring(startIdx, endIdx + 1));

        // 4. Update Terminal
        if (cleanJson.reply) {
            document.getElementById('chat').innerHTML += `
                <div class="spec-msg"><b>Specialist:</b> ${cleanJson.reply}</div>`;
        }

        // 5. Update A4 Preview Live
        if (cleanJson.name) document.getElementById('n').innerText = cleanJson.name;
        if (cleanJson.role) document.getElementById('r').innerText = cleanJson.role;
        if (cleanJson.summary) document.getElementById('s').innerText = cleanJson.summary;
        if (cleanJson.experience) document.getElementById('e').innerHTML = `<ul>${cleanJson.experience}</ul>`;

        document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;

    } catch (error) {
        console.error("Connection Error:", error);
        // Displaying the red error message from your screenshot
        document.getElementById('chat').innerHTML += `
            <div style="color:#ff4d00; margin-bottom:15px; font-weight:bold;">
                System Error: Connection to Specialist lost.
            </div>`;
    }
}
