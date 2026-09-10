export default async function handler(req, res) {

    // केवल POST request allow करें
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    try {

        const { password } = req.body || {};

        // Password Vercel Environment Variable से आएगा
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            return res.status(500).json({
                success: false,
                message: "ADMIN_PASSWORD is not configured"
            });
        }

        // Password check
        if (
            typeof password !== "string" ||
            password !== adminPassword
        ) {
            return res.status(401).json({
                success: false,
                message: "Wrong password"
            });
        }

        // Login successful
        return res.status(200).json({
            success: true
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
}
