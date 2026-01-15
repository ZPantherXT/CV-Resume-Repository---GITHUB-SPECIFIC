const KEY = "AIzaSyChjCLR-3_8_09_pl71TVByRJFtVJwhYdU"; 
let m = "";

async function start(mode){ 
    m = mode; 
    document.getElementById('landing').style.display = 'none'; 
    document.getElementById('builder').style.display = 'grid'; 
    
    // Exact greeting from your screenshot
    document.getElementById('chat').innerHTML = `
        <div class="spec-msg">
            <b>Specialist:</b> Session initiated. State your Full Name and the specific Job Role you are targeting.
        </div>`;
}

async function call(t){
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`, {
            method: "POST", 
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Persona: Professional Career Specialist. Mode: ${m}. User Input: ${t}. 
                        Task: Help the user build a document. 
                        Return ONLY JSON: {"reply":"msg","name":"","role":"","summary":"","experience":""}`
                    }]
                }]
            })
        });
        
        const d = await res.json();
        const j = JSON.parse(d.candidates[0].content.parts[0].text.match(/\{[\s\S]*\}/)[0]);
        
        // AI reply styled as the Specialist
        if(j.reply) {
            document.getElementById('chat').innerHTML += `
                <div class="spec-msg"><b>Specialist:</b> ${j.reply}</div>`;
        }
        
        // Update the A4 Preview sections
        if(j.name) document.getElementById('n').innerText = j.name;
        if(j.role) document.getElementById('r').innerText = j.role;
        if(j.summary) document.getElementById('s').innerText = j.summary;
        if(j.experience) document.getElementById('e').innerHTML = j.experience;
        
        document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
    } catch (e) {
        console.error("Connection lost.");
    }
}

function send(){ 
    const i = document.getElementById('in'); 
    if(i.value.trim()){ 
        // User text color kept neutral as seen in terminal
        document.getElementById('chat').innerHTML += `
            <div style="margin-bottom:15px; color:#ccc;"><b>User:</b> ${i.value}</div>`; 
        call(i.value); 
        i.value = ''; 
    } 
}
