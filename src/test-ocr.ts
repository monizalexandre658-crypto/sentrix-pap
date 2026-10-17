import { VehicleDocumentOCRService } from "./services/ocr/vehicle-document-ocr.service";

async function main() {
  const ocrService =
    new VehicleDocumentOCRService();

  const filePath =
    "C:\\Users\\user\\SENTRIX\\backend\\uploads\\vehicles\\vehicle-1790533234464-269438.pdf";

  try {
    const text =
      await ocrService.extractTextFromPdf(
        filePath,
      );

    console.log("");
    console.log("=================================");
    console.log("TEXTO FINAL EXTRAÍDO");
    console.log("=================================");
    console.log(text);
  } catch (error) {
    console.error("");
    console.error(
      "Erro durante o OCR:",
    );
    console.error(error);

    process.exit(1);
  }
}

main();