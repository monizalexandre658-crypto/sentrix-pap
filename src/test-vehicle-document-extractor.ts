import {
  VehicleDocumentExtractorService,
} from "./services/verification/vehicle-document-extractor.service";

console.log("=================================");
console.log("SentriX Vehicle Document Extractor");
console.log("=================================");

const extractor =
  new VehicleDocumentExtractorService();

const text = `
REPÚBLICA PORTUGUESA

Matrícula: BC-32-BB
Marca: BMW
Modelo: 320d
Cor: Preto
`;

console.log("\nTexto de teste:");
console.log(text);

const result =
  extractor.extract(text);

console.log("\nDados extraídos:");
console.log("---------------------------------");
console.log("Matrícula:", result.plate);
console.log("Marca:", result.brand);
console.log("Modelo:", result.model);
console.log("Cor:", result.color);
console.log("País:", result.country);
console.log("---------------------------------");

console.log("\nResultado final:");
console.log(result);