const express = require("express");
const router = express.Router();
const MercadoPagoController = require("./Controllers/MercadoPagoController.js");
const UserController = require("./Controllers/UserController.js");
const ImpressorasController = require("./Controllers/ImpressorasController.js");
const AuthMiddleware = require("./Middleware/AuthMiddleware.js");

// Rotas de Login e cadastro de usuários
router.post("/login", UserController.authenticate);
router.post("/register", UserController.create);

// Middleware de autenticação
router.use(AuthMiddleware.verifyUserToken);

// Rotas de pagamento com MercadoPago (requer autenticação)
router.post("/pix", MercadoPagoController.createPixPayment);
router.get("/status/:paymentId", MercadoPagoController.checkPaymentStatus);

// Busca Impressoras (requer autenticação)
router.get("/getPrinters", ImpressorasController.getAllPrinters);

module.exports = router;
