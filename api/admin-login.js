import crypto from "crypto";

function createToken(secret) {
    return crypto
        .createHmac("sha256", secret)
        .update("A1_ADMIN_SESSION")
        .digest("hex");
}

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    try {

        const { password } = req.body || {};

        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminSecret = process.env.ADMIN_SECRET;

        if (!adminPassword || !adminSecret) {
            return res.status(500).json({
                success: false,
                message: "Admin environment variables are not configured"
            });
        }

        if (
            typeof password !== "string" ||
            password !== adminPassword
        ) {
            return res.status(401).json({
                success: false,
                message: "Wrong password"
            });
        }

        const token = createToken(adminSecret);

        res.setHeader(
            "Set-Cookie",
            `admin_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`
        );

        return res.status(200).json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
}
