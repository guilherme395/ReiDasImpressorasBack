const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/UserModel.js");

class UserController {
    async create(req, res) {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Os campos 'name', 'email' e 'password' são obrigatórios.",
                data: null,
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await UserModel.create({ name, email, password: hashedPassword });

            return res.json({
                success: true,
                message: "Usuário criado com sucesso.",
            });
        } catch (error) {
            console.error("Erro ao criar usuário:", error.message);
            return res.status(500).json({
                success: false,
                message: "Erro ao criar usuário.",
                error: error.message,
                data: null,
            });
        }
    }

    async authenticate(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Os campos 'email' e 'password' são obrigatórios.",
                data: null,
            });
        }

        try {
            const user = await UserModel.findByEmail(email);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuário não encontrado.",
                    data: null,
                });
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Senha inválida.",
                    data: null,
                });
            }

            const JWT_SECRET = process.env.JWT_SECRET;

            const token = jwt.sign(
                { id: user.id, name: user.name, email: user.email },
                JWT_SECRET,
                { expiresIn: "1h" }
            );
            return res.json({
                success: true,
                message: "Autenticação bem-sucedida.",
                data: { token },
            });
        } catch (error) {
            console.error("Erro ao autenticar usuário:", error.message);
            return res.status(500).json({
                success: false,
                message: "Erro ao autenticar usuário.",
                error: error.message,
                data: null,
            });
        }
    }
}

module.exports = new UserController();
