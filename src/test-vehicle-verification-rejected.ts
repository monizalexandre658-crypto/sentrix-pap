import { VehicleDocumentOCRService } from "./services/ocr/vehicle-document-ocr.service";
import { VehicleDocumentExtractorService } from "./services/verification/vehicle-document-extractor.service";
import {
  VehicleDocumentVerificationService,
} from "./services/verification/vehicle-document-verification.service";

async function main() {
  console.log("=================================");
  console.log("SentriX Vehicle Verification");
  console.log("TESTE REJECTED");
  console.log("=================================");
  console.log();

  const vehicleId = 31;
  const userId = 4;

  const filePath =
    "C:\\Users\\user\\SENTRIX\\backend\\uploads\\vehicles\\vehicle-1790533234464-269438.pdf";

  const ocrService =
    new VehicleDocumentOCRService();

  const extractor =
    new VehicleDocumentExtractorService();

  const verificationService =
    new VehicleDocumentVerificationService();

  try {
    console.log("1. A executar OCR...");
    console.log();

    const ocrText =
      await ocrService.extractTextFromPdf(
        filePath,
      );

    console.log();
    console.log("2. OCR concluído.");
    console.log();

    console.log(
      "3. A extrair dados do documento...",
    );
    console.log();

    const documentData =
      extractor.extract(ocrText);

    console.log(
      "Dados reais extraídos:",
    );

    console.log(
      JSON.stringify(
        documentData,
        null,
        2,
      ),
    );

    console.log();
    console.log(
      "4. A introduzir uma diferença controlada...",
    );
    console.log();

    console.log(
      "Cor original do documento:",
      documentData.color,
    );

    documentData.color = "Azul";

    console.log(
      "Cor enviada para verificação:",
      documentData.color,
    );

    console.log();
    console.log(
      "5. A executar verificação...",
    );
    console.log();

    console.log(`Veículo: ${vehicleId}`);
    console.log(`Utilizador: ${userId}`);

    const result =
      await verificationService.verify(
        vehicleId,
        userId,
        documentData,
      );

    console.log();
    console.log("=================================");
    console.log("RESULTADO DA COMPARAÇÃO");
    console.log("=================================");

    console.log(
      `Matrícula: ${result.matches.plate ? "✓" : "✗"}`,
    );

    console.log(
      `Marca:     ${result.matches.brand ? "✓" : "✗"}`,
    );

    console.log(
      `Modelo:    ${result.matches.model ? "✓" : "✗"}`,
    );

    console.log(
      `Cor:       ${result.matches.color ? "✓" : "✗"}`,
    );

    console.log(
      `País:      ${result.matches.country ? "✓" : "✗"}`,
    );

    console.log();

    if (result.verified) {
      console.log(
        "❌ ERRO: O DOCUMENTO FOI ACEITE.",
      );
    } else {
      console.log(
        "✓ DOCUMENTO REJEITADO CORRETAMENTE.",
      );
    }

    console.log();
    console.log("Objeto completo:");

    console.log(
      JSON.stringify(
        result,
        null,
        2,
      ),
    );

    console.log();
    console.log("=================================");
    console.log("TESTE REJECTED CONCLUÍDO");
    console.log("=================================");
  } catch (error) {
    console.error();
    console.error(
      "Erro durante o teste:",
    );
    console.error(error);

    process.exit(1);
  }
}

main();