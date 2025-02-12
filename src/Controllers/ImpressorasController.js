const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

class ImpressorasController {
    static async getAllPrinters(req, res) {
        const command = `powershell.exe "Get-Printer | Select-Object Name | Format-Table -HideTableHeaders"`;

        try {
            const { stdout, stderr } = await execAsync(command);

            if (stderr) {
                console.error("Erro ao listar impressoras:", stderr);
                return res.status(500).json({
                    success: false,
                    message: "Erro ao listar impressoras",
                    error: stderr,
                    data: null,
                });
            }

            const printers = ImpressorasController.parsePrinters(stdout);

            return res.status(200).json({
                success: true,
                message: "Lista de impressoras obtida com sucesso",
                data: printers,
            });
        } catch (error) {
            console.error("Erro ao executar comando:", error);
            return res.status(500).json({
                success: false,
                message: "Erro ao executar comando",
                error: error.message,
                data: null,
            });
        }
    }

    static parsePrinters(output) {
        try {
            return output
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0)
                .map((name) => ({
                    name: name,
                    displayName: name,
                }));
        } catch (parseError) {
            console.error(
                "Erro ao processar lista de impressoras:",
                parseError
            );
            throw new Error("Erro ao processar lista de impressoras");
        }
    }
}

module.exports = ImpressorasController;
