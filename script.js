const KEY = "AIzaSyChjCLR-3_8_09_pl71TVByRJFtVJwhYdU"; 
let m = "";
async function start(mode){ 
    m=mode; 
    document.getElementById('landing').style.display='none'; 
    document.getElementById('builder').style.display='grid'; 
    await call("Hi"); 
}
async function call(t){
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`, {
            method: "POST", headers:{"Content-Type":"application/json"},
            body: JSON.stringify({contents:[{parts:[{text:`Persona: Expert. Mode: ${m}. User: ${t}. Return ONLY JSON: {"reply":"msg","name":"","role":"","summary":"","experience":""}`}]}]})
        });
        const d = await res.json();
        const j = JSON.parse(d.candidates[0].content.parts[0].text.match(/\{[\s\S]*\}/)[0]);
        if(j.reply) document.getElementById('chat').innerHTML += `<div class="spec"><b>AI:</b> ${j.reply}</div>`;
        if(j.name) document.getElementById('n').innerText = j.name;
        if(j.role) document.getElementById('r').innerText = j.role;
        if(j.summary) document.getElementById('s').innerText = j.summary;
        if(j.experience) document.getElementById('e').innerHTML = j.experience;
        document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
    } catch (e) {}
}
function send(){ const i=document.getElementById('in'); if(i.value){ document.getElementById('chat').innerHTML += `<div><b>You:</b> ${i.value}</div>`; call(i.value); i.value=''; } }
