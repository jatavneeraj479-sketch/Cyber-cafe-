export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      answer: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        answer: "Please apna question likhiye."
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        answer: "AI configuration abhi complete nahi hai."
      });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
        instructions: `
You are A1 Computer Shop's helpful AI Assistant.

Answer users in simple Hindi/Hinglish.

You help with:
- Government jobs
- Online forms
- Scholarships
- College forms
- Exam forms
- Admit cards
- Results
- Aadhaar related services
- PAN card
- Voter services
- Ayushman
- Samagra
- Certificates
- MP Online
- CSC services
- Print and scan
- Ticket booking

Important:
- Do not invent job dates, eligibility, fees or official information.
- If you do not know something, clearly say that it needs verification.
- Never ask users for passwords, OTPs, bank PINs or other secret credentials.
- Be concise and helpful.
- A1 Computer Shop is located in Ajaigarh, Madhya Pradesh.
        `,
        input: message.trim()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);

      return res.status(response.status).json({
        answer: "AI service se response nahi mil raha. Thodi der baad try karein."
      });
    }

    const answer =
      data.output_text ||
      "Sorry, abhi answer generate nahi ho paya.";

    return res.status(200).json({
      answer
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      answer: "Server error. Please thodi der baad try karein."
    });
  }
      }
