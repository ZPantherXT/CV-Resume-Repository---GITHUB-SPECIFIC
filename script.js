const KEY = "AIzaSyChjCLR-3_8_09_pl71TVByRJFtVJwhYdU"; 
let m = ""; // Stores 'Curriculum Vitae' or 'Resume'

// 1. Initialize the Session
async function start(mode) { 
    m = mode; 
    document.getElementById('landing').style.display = 'none'; 
    document.getElementById('builder').style.display = 'grid'; 
    
    // Initial greeting from the Specialist
    const chat = document.getElementById('chat');
    chat.innerHTML = `
        <div class="spec-msg">
            <b>Specialist:</b> Session initiated. State your Full Name and the specific Job Role you are targeting.
        </div>`;
}

// 2. Handle User Input
function send() { 
    const i = document.getElementById('in'); 
    const chat = document.getElementById('chat');
    
    if (i.value.trim() !== "") { 
        // Display user message in the terminal
        chat.innerHTML += `<div style="margin-bottom:15px; color:#ccc;"><b>User:</b> ${i.value}</div>`; 
        callAI(i.value); 
        i.value = ''; 
        chat.scrollTop = chat.scrollHeight; // Auto-scroll
    } 
}

// 3. Talk to Gemini API
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
                        Goal: Interview the user to fill out their document. 
                        Response Rules: 
                        1. Be professional and brief. 
                        2. If information is missing, ask for it. 
                        3. Return ONLY a JSON object. No other text.
                        JSON Format: {"reply":"Specialist's message", "name":"Updated Name", "role":"Updated Role", "summary":"3-sentence bio", "experience":"HTML list of skills/history"}`
                    }]
                }]
            })
        });

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        
        // Extract JSON from the AI response (strips markdown if AI includes it)
        const cleanJson = JSON.parse(rawText.match(/\{[\s\S]*\}/)[0]);

        // 4. Update the Terminal
        if (cleanJson.reply) {
            document.getElementById('chat').innerHTML += `
                <div class="spec-msg"><b>Specialist:</b> ${cleanJson.reply}</div>`;
        }

        // 5. Update the A4 Preview
        if (cleanJson.name && cleanJson.name !== "Full Name") {
            document.getElementById('n').innerText = cleanJson.name;
        }
        if (cleanJson.role && cleanJson.role !== "Target Position") {
            document.getElementById('r').innerText = cleanJson.role;
        }
        if (cleanJson.summary) {
            document.getElementById('s').innerText = cleanJson.summary;
        }
        if (cleanJson.experience) {
            document.getElementById('e').innerHTML = cleanJson.experience;
        }

        document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;

    } catch (error) {
        console.error("API Connection Error:", error);
        document.getElementById('chat').innerHTML += `
            <div style="color:red; margin-bottom:15px;">System Error: Connection to Specialist lost.</div>`;
    }
}
