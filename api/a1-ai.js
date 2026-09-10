<!DOCTYPE html>
<html lang="hi">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>A1 Smart AI Assistant</title>

<style>

*{
    box-sizing:border-box;
    margin:0;
    padding:0;
    font-family:Arial,Helvetica,sans-serif;
}

body{
    background:#f4f7fb;
    color:#172033;
}

.header{
    background:linear-gradient(135deg,#0757a6,#062f5d);
    color:white;
    padding:20px;
    text-align:center;
}

.robot{
    font-size:50px;
}

.header h1{
    margin-top:8px;
}

.online{
    display:inline-block;
    margin-top:8px;
    background:#16a34a;
    padding:5px 12px;
    border-radius:20px;
    font-size:13px;
}

.container{
    max-width:850px;
    margin:auto;
    padding:20px;
}

.chat{
    background:white;
    min-height:60vh;
    border-radius:18px;
    padding:18px;
    box-shadow:0 5px 25px rgba(0,0,0,.10);
}

.message{
    padding:13px 15px;
    border-radius:15px;
    margin-bottom:12px;
    max-width:85%;
    line-height:1.6;
    white-space:pre-wrap;
}

.bot{
    background:#eaf2fb;
    color:#172033;
}

.user{
    background:#0757a6;
    color:white;
    margin-left:auto;
}

.input-area{
    display:flex;
    gap:10px;
    margin-top:15px;
}

input{
    flex:1;
    padding:15px;
    border:1px solid #ccd5df;
    border-radius:12px;
    font-size:16px;
    outline:none;
}

button{
    border:0;
    background:#f5a623;
    color:#111;
    padding:0 20px;
    border-radius:12px;
    font-weight:bold;
    font-size:16px;
    cursor:pointer;
}

button:disabled{
    opacity:.6;
}

.back{
    display:block;
    text-align:center;
    margin-top:18px;
    color:#0757a6;
    text-decoration:none;
    font-weight:bold;
}

.typing{
    color:#64748b;
    font-size:14px;
    margin-bottom:10px;
}

@media(max-width:600px){

    .container{
        padding:12px;
    }

    .chat{
        min-height:65vh;
        padding:12px;
    }

    .input-area{
        position:sticky;
        bottom:5px;
    }

    button{
        padding:0 16px;
    }

}

</style>

</head>

<body>

<div class="header">

<div class="robot">🤖</div>

<h1>A1 Smart AI Assistant</h1>

<div class="online">
● ONLINE
</div>

</div>


<div class="container">

<div class="chat" id="chat">

<div class="message bot">

नमस्ते! 👋

मैं A1 Computer Shop का Smart AI Assistant हूँ।

आप Government Job, Scholarship, College Form,
Exam Form, Admit Card, Result, Aadhaar, PAN,
Voter, Certificate या किसी Online Service के बारे
में सवाल पूछ सकते हैं।

</div>

</div>


<div class="input-area">

<input
type="text"
id="message"
placeholder="अपना सवाल लिखें..."
autocomplete="off"
>

<button id="send">
Send
</button>

</div>


<a href="index.html" class="back">
← A1 Computer Shop पर वापस जाएँ
</a>

</div>


<script>

const input = document.getElementById("message");
const send = document.getElementById("send");
const chat = document.getElementById("chat");


function addMessage(text,type){

    const div = document.createElement("div");

    div.className = "message " + type;

    div.textContent = text;

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;

}


async function askAI(){

    const message = input.value.trim();

    if(!message) return;

    addMessage(message,"user");

    input.value = "";

    send.disabled = true;
    send.textContent = "⌛";

    const typing = document.createElement("div");

    typing.className = "typing";

    typing.textContent = "🤖 AI जवाब तैयार कर रहा है...";

    chat.appendChild(typing);

    chat.scrollTop = chat.scrollHeight;


    try{

        const response = await fetch("/api/a1-ai",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                message:message
            })

        });


        const data = await response.json();

        typing.remove();

        if(data.answer){

            addMessage(data.answer,"bot");

        }else{

            addMessage(
                "AI से जवाब नहीं मिला। कृपया फिर कोशिश करें।",
                "bot"
            );

        }

    }

    catch(error){

        typing.remove();

        addMessage(
            "Internet या server connection में समस्या है।",
            "bot"
        );

    }


    send.disabled = false;
    send.textContent = "Send";

    input.focus();

}


send.addEventListener("click",askAI);


input.addEventListener("keydown",function(e){

    if(e.key === "Enter"){

        askAI();

    }

});

</script>

</body>

</html>
