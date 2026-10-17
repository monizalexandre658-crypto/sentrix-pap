import {
  VehicleDocumentOCRService,
} from "./services/ocr/vehicle-document-ocr.service";

import {
  VehicleDocumentExtractorService,
} from "./services/verification/vehicle-document-extractor.service";

console.log("=================================");
console.log("SentriX OCR + Extractor");
console.log("=================================");

const pdfPath =
  "C:\\Users\\user\\SENTRIX\\backend\\uploads\\vehicles\\vehicle-1790533234464-269438.pdf";

const ocrService =
  new VehicleDocumentOCRService();

const extractor =
  new VehicleDocumentExtractorService();

async function main() {
  try {
    console.log("\n1. A iniciar OCR...");
    console.log("PDF:", pdfPath);

    const ocrText =
      await ocrService.extractTextFromPdf(
        pdfPath,
      );

    console.log("\n=================================");
    console.log("TEXTO RECONHECIDO PELO OCR");
    console.log("=================================");

    console.log(ocrText);

    console.log("\n2. A executar extractor...");

    const extractedData =
      extractor.extract(ocrText);

    console.log("\n=================================");
    console.log("DADOS EXTRAÍDOS");
    console.log("=================================");

    console.log(
      "Matrícula:",
      extractedData.plate,
    );

    console.log(
      "Marca:",
      extractedData.brand,
    );

    console.log(
      "Modelo:",
      extractedData.model,
    );

    console.log(
      "Cor:",
      extractedData.color,
    );

    console.log(
      "País:",
      extractedData.country,
    );

    console.log("\n=================================");
    console.log("PROCESSO CONCLUÍDO");
    console.log("=================================");

    console.log(
      "\nObjeto final:",
      extractedData,
    );
  } catch (error) {
    console.error("\n=================================");
    console.error("ERRO NO PROCESSO");
    console.error("=================================");

    console.error(error);
  }
}

main();
