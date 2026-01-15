const KEY = "AIzaSyDmmJ-zRqsCvY_mfESR8G5hcim7b5I9xrM"; 
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
                        Return ONLY this JSON: {"reply":"msg", "name":"full name", "role":"job title", "summary":"bio", "experience":"html list"}
                        Important: Do not include any text, markdown, or backticks before or after the JSON.`
                    }]
                }]
            })
        });

        const data = await response.json();
        
        // If the AI doesn't respond or key is blocked
        if (!data.candidates || !data.candidates[0].content) {
            throw new Error("Invalid API Response");
        }

        let rawText = data.candidates[0].content.parts[0].text;
        
        // CLEANING THE DATA: Removes any accidental ```json tags the AI might add
        const cleanJson = JSON.parse(rawText.replace(/```json/g, "").replace(/```/g, "").trim());

        // Update Terminal
        if (cleanJson.reply) {
            document.getElementById('chat').innerHTML += `
                <div class="spec-msg"><b>Specialist:</b> ${cleanJson.reply}</div>`;
        }

        // Live Update Preview
        if (cleanJson.name) document.getElementById('n').innerText = cleanJson.name;
        if (cleanJson.role) document.getElementById('r').innerText = cleanJson.role;
        if (cleanJson.summary) document.getElementById('s').innerText = cleanJson.summary;
        if (cleanJson.experience) document.getElementById('e').innerHTML = `<ul>${cleanJson.experience}</ul>`;

        document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;

    } catch (error) {
        console.error("CRITICAL ERROR:", error);
        // FIXED: Error message is now RED as requested
        document.getElementById('chat').innerHTML += `
            <div style="color:red; margin-bottom:15px; font-weight:bold;">
                System Error: Connection to Specialist lost.
            </div>`;
    }
}
