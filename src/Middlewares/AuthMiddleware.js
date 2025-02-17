const jwt = require("jsonwebtoken");

class AuthMiddleware {
	async verifyUserToken(req, res, next) {
		const authHeader = req.headers["authorization"];
		const token = authHeader && authHeader.split(" ")[1];

		if (!token) {
			return res.status(403).json({
				success: false,
				message: "Nenhum token fornecido.",
				data: null,
			});
		}

		try {
			const JWT_SECRET = process.env.JWT_SECRET;
			const decoded = jwt.verify(token, JWT_SECRET);
			req.user = decoded;
			next();
		} catch (error) {
			console.error("Erro ao verificar token:", error.message);
			return res.status(401).json({
				success: false,
				message: "Token inválido ou expirado.",
				error: error.message,
				data: null,
			});
		}
	}
}

module.exports = new AuthMiddleware();
