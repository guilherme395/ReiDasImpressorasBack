const axios = require("axios");
const MercadoPagoModel = require("../Models/MercadoPagoModel.js");

class MercadoPagoController {
	async createPixPayment(req, res) {
		const amount = parseFloat(process.env.PRICE_PER_PAGE);

		if (isNaN(amount)) {
			return res.status(400).json({
				success: false,
				message: "O valor de PRICE_PER_PAGE deve ser numérico.",
				data: null,
			});
		}

		try {
			const idempotencyKey = `key-${Date.now()}`;
			const response = await axios.post(
				"https://api.mercadopago.com/v1/payments",
				{
					transaction_amount: amount,
					payment_method_id: "pix",
					payer: { email: "developerguilhermy@gmail.com" },
					description: "PAGAMEMTO PIX NO SERVIDOR DE IMPRESSAO",
				},
				{
					headers: {
						Authorization: `Bearer ${process.env.MERCADOPAGO_TOKEN}`,
						"Content-Type": "application/json",
						"X-Idempotency-Key": idempotencyKey,
					},
				}
			);

			const paymentData = response.data;
			if (
				!paymentData.point_of_interaction ||
				!paymentData.point_of_interaction.transaction_data.qr_code
			) {
				return res.status(400).json({
					success: false,
					message: "QR Code inválido ou não gerado.",
					data: null,
				});
			}

			return res.json({
				success: true,
				message: "Pagamento Pix criado com sucesso.",
				data: {
					id: paymentData.id,
					qr_code:
						paymentData.point_of_interaction.transaction_data
							.qr_code,
					qr_code_base64:
						paymentData.point_of_interaction.transaction_data
							.qr_code_base64,
					status: paymentData.status,
				},
			});
		} catch (error) {
			console.error(
				"Erro ao criar pagamento Pix:",
				error.response?.data || error.message
			);
			return res.status(500).json({
				success: false,
				message: "Erro ao criar pagamento Pix.",
				error: error.response?.data || error.message,
				data: null,
			});
		}
	}

	async checkPaymentStatus(paymentId) {
		if (!process.env.MERCADOPAGO_TOKEN) {
			throw new Error("Token do Mercado Pago não configurado.");
		}

		try {
			const response = await axios.get(
				`https://api.mercadopago.com/v1/payments/${paymentId}`,
				{
					headers: {
						Authorization: `Bearer ${process.env.MERCADOPAGO_TOKEN}`,
					},
				}
			);
			return {
				success: true,
				message: "Status do pagamento verificado com sucesso.",
				status: response.data.status,
			};
		} catch (error) {
			console.error(
				"Erro ao verificar pagamento:",
				error.response?.data || error.message
			);
			throw new Error(error.response?.data || error.message);
		}
	}
}

module.exports = new MercadoPagoController();
