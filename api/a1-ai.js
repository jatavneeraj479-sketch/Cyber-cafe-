export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      answer: "Method not allowed"
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      answer: "AI service अभी configure नहीं है।"
    });
  }

  try {

    const message =
      typeof req.body?.message === "string"
        ? req.body.message.trim()
        : "";

    if (!message) {
      return res.status(400).json({
        success: false,
        answer: "कृपया अपना सवाल लिखें।"
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },

        body: JSON.stringify({

          model: "gpt-5.6-luna",

          instructions: `
आप A1 Computer Shop के Smart AI Assistant हैं।

ग्राहकों की मदद इन सेवाओं में करें:

MP Online, Government Jobs, Scholarship,
College & University Forms, Exam Forms,
Admit Card, Results, Ayushman, Samagra,
PAN Card, Voter Services, Certificates,
Aadhaar सामान्य सहायता, Print & Scan,
Ticket Assistance और CSC Services।

जवाब सरल Hindi/Hinglish में दें।

महत्वपूर्ण नियम:

- गलत जानकारी अनुमान से न दें।
- सरकारी शुल्क और अंतिम तारीख के लिए official
  portal verify करने को कहें।
- A1 Computer Shop को सरकारी विभाग न बताएं।
- OTP, Password, UPI PIN, ATM PIN या Banking
  credentials कभी न मांगें।
- जवाब छोटा, साफ और उपयोगी रखें।
- अगर पूछा जाए "आप कौन हैं?" तो कहें:
  "मैं A1 Computer Shop का Smart AI Assistant हूँ।"
`,

          input: message,

          max_output_tokens: 500
        })
      }
    );

    if (!response.ok) {

      const error = await response.text();

      console.error(error);

      return res.status(500).json({
        success: false,
        answer: "AI जवाब देने में समस्या हुई। थोड़ी देर बाद फिर कोशिश करें।"
      });
    }

    const data = await response.json();

    let answer = data.output_text || "";

    if (!answer && Array.isArray(data.output)) {

      for (const item of data.output) {

        if (!Array.isArray(item.content)) continue;

        for (const content of item.content) {

          if (
            content.type === "output_text" &&
            typeof content.text === "string"
          ) {
            answer += content.text;
          }

        }
      }
    }

    return res.status(200).json({
      success: true,
      answer: answer.trim() ||
        "माफ कीजिए, अभी जवाब नहीं मिल पाया।"
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      answer: "AI Assistant में technical समस्या आ गई।"
    });
  }
}
