export default async function handler(req, res) {

    // =========================
    // CORS
    // =========================

    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    // =========================
    // OPTIONS
    // =========================

    if (req.method === "OPTIONS") {

        return res
            .status(200)
            .end();

    }


    // =========================
    // ONLY POST
    // =========================

    if (req.method !== "POST") {

        return res
            .status(405)
            .json({
                error:"Method not allowed"
            });

    }


    try {

        const {
            message,
            history = []
        } = req.body || {};


        // =========================
        // CHECK QUESTION
        // =========================

        if (
            !message ||
            typeof message !== "string" ||
            !message.trim()
        ) {

            return res
                .status(400)
                .json({
                    error:"Question is required"
                });

        }


        // =========================
        // CHECK API KEY
        // =========================

        const apiKey =
            process.env.OPENAI_API_KEY;


        if (!apiKey) {

            return res
                .status(500)
                .json({
                    error:
                    "OPENAI_API_KEY is not configured in Vercel."
                });

        }


        // =========================
        // SAFE HISTORY
        // =========================

        const safeHistory =
            Array.isArray(history)
            ? history
                .filter(item =>
                    item &&
                    (
                        item.role === "user" ||
                        item.role === "assistant"
                    ) &&
                    typeof item.content === "string"
                )
                .slice(-10)
            : [];


        // =========================
        // AI INSTRUCTIONS
        // =========================

        const instructions = `

You are A1 Smart AI Assistant for A1 Computer Shop,
New Bus Stand, Ajaigarh, Madhya Pradesh, India.

Your job is to help users understand online services.

Important services include:

- Government Jobs
- Scholarship
- College and University
- Exam Forms
- Admit Cards
- Results
- Aadhaar assistance
- PAN Card
- Voter Services
- Certificates
- Ayushman
- Samagra
- MP Online
- CSC Services
- Print and Scan
- Ticket assistance

Rules:

1. Answer mainly in simple Hindi/Hinglish.
2. Be short, clear and useful.
3. Do not pretend to be a government department.
4. A1 Computer Shop is a private online service center.
5. Never ask the user for OTP, password, UPI PIN, ATM PIN,
   banking credentials or other secret authentication information.
6. For government forms, fees and deadlines, tell the user
   to verify the latest information on the official portal
   or official notification.
7. If you are not sure about a current deadline, fee,
   recruitment date or government rule, clearly say that
   the user should verify it on the official source.
8. Do not invent official links, dates, fees or eligibility.
9. You can explain general processes and documents.
10. Be polite and helpful.
11. If the user asks something unrelated, answer briefly
    if possible and bring the conversation back to useful help.
12. Never claim that you have personally submitted a form,
    downloaded a document or completed a government process.

`;


        // =========================
        // BUILD INPUT
        // =========================

        const input = [];


        for (
            const item of safeHistory
        ) {

            input.push({

                role:
                    item.role === "assistant"
                    ? "assistant"
                    : "user",

                content:item.content

            });

        }


        input.push({

            role:"user",

            content:message.trim()

        });


        // =========================
        // OPENAI RESPONSES API
        // =========================

        const openaiResponse =
            await fetch(
                "https://api.openai.com/v1/responses",
                {

                    method:"POST",

                    headers:{

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${apiKey}`

                    },

                    body:JSON.stringify({

                        model:
                            "gpt-5.6-luna",

                        instructions:
                            instructions,

                        input:
                            input,

                        max_output_tokens:
                            700

                    })

                }
            );


        const data =
            await openaiResponse.json();


        // =========================
        // OPENAI ERROR
        // =========================

        if (!openaiResponse.ok) {

            console.error(
                "OpenAI API Error:",
                data
            );

            return res
                .status(openaiResponse.status)
                .json({

                    error:
                        data?.error?.message ||
                        "OpenAI API request failed"

                });

        }


        // =========================
        // GET ANSWER
        // =========================

        let answer =
            data.output_text;


        // Fallback parser
        if (
            !answer &&
            Array.isArray(data.output)
        ) {

            answer =
                data.output
                    .flatMap(item =>
                        Array.isArray(item.content)
                        ? item.content
                        : []
                    )
                    .filter(item =>
                        item.type === "output_text"
                    )
                    .map(item =>
                        item.text
                    )
                    .join("\n");

        }


        if (!answer) {

            answer =
                "माफ़ कीजिए, अभी AI जवाब नहीं दे पाया।";

        }


        // =========================
        // RESPONSE
        // =========================

        return res
            .status(200)
            .json({

                answer:answer

            });


    } catch (error) {

        console.error(
            "Server Error:",
            error
        );

        return res
            .status(500)
            .json({

                error:
                    "AI server error. Please try again."

            });

    }

}
