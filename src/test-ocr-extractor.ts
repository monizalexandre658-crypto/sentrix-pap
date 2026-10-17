import { VehicleDocumentOCRService } from "./services/ocr/vehicle-document-ocr.service";
import { VehicleDocumentExtractorService } from "./services/verification/vehicle-document-extractor.service";

async function main() {
  const filePath =
    "C:\\Users\\user\\SENTRIX\\backend\\uploads\\vehicles\\vehicle-1790533234464-269438.pdf";

  const ocrService =
    new VehicleDocumentOCRService();

  const extractor =
    new VehicleDocumentExtractorService();

  try {
    console.log("=================================");
    console.log("SentriX OCR → Extractor");
    console.log("=================================");
    console.log();

    console.log("1. A executar OCR...");
    console.log();

    const ocrText =
      await ocrService.extractTextFromPdf(
        filePath,
      );

    console.log();
    console.log("2. OCR concluído.");
    console.log();

    console.log("3. A enviar texto para o Extractor...");
    console.log();

    const extractedData =
      extractor.extract(ocrText);

    console.log("4. Dados extraídos:");
    console.log();

    console.log(
      JSON.stringify(
        extractedData,
        null,
        2,
      ),
    );

    console.log();
    console.log("=================================");
    console.log("OCR → EXTRACTOR CONCLUÍDO");
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
