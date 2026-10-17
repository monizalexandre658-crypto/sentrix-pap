import fs from "fs/promises";

import { createCanvas } from "@napi-rs/canvas";
import { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export class VehicleDocumentOCRService {
  async extractTextFromPdf(
    filePath: string,
  ): Promise<string> {
    if (!filePath) {
      throw new Error(
        "Localização do ficheiro não fornecida.",
      );
    }

    try {
      await fs.access(filePath);
    } catch {
      throw new Error(
        "O ficheiro PDF não foi encontrado.",
      );
    }

    console.log("=================================");
    console.log("SentriX OCR");
    console.log("=================================");
    console.log("PDF:", filePath);

    const pdfBytes = await fs.readFile(
      filePath,
    );

    const loadingTask =
      pdfjsLib.getDocument({
        data: new Uint8Array(pdfBytes),
      });

    const pdf =
      await loadingTask.promise;

    console.log(
      "Número de páginas:",
      pdf.numPages,
    );

    let completeText = "";

    const worker =
      await createWorker("por");

    try {
      for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
      ) {
        console.log(
          `A processar página ${pageNumber}/${pdf.numPages}...`,
        );

        const page =
          await pdf.getPage(
            pageNumber,
          );

        const scale = 2;

        const viewport =
          page.getViewport({
            scale,
          });

        const width =
          Math.ceil(viewport.width);

        const height =
          Math.ceil(viewport.height);

        const canvas =
          createCanvas(
            width,
            height,
          );

        const context =
          canvas.getContext("2d");

        context.fillStyle =
          "#FFFFFF";

        context.fillRect(
          0,
          0,
          width,
          height,
        );

        await page.render({
          canvas: canvas as any,
          canvasContext:
            context as any,
          viewport,
        }).promise;

        const imageBuffer =
          canvas.toBuffer("image/png");

        console.log(
          "Imagem da página criada.",
        );

        const result =
          await worker.recognize(
            imageBuffer,
          );

        const pageText =
          result.data.text.trim();

        completeText +=
          `\n--- PÁGINA ${pageNumber} ---\n\n`;

        completeText += pageText;

        console.log(
          `Texto encontrado na página ${pageNumber}:`,
        );

        console.log(
          pageText || "(nenhum texto reconhecido)",
        );
      }
    } finally {
      await worker.terminate();
    }

    console.log("=================================");
    console.log("OCR concluído.");
    console.log("=================================");

    return completeText.trim();
  }
}