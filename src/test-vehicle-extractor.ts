import {
  VehicleDocumentExtractorService,
} from "./services/verification/vehicle-document-extractor.service";

const extractor =
  new VehicleDocumentExtractorService();

const ocrText = `
REPÚBLICA PORTUGUESA
CERTIFICADO DE MATRÍCULA
VEÍCULO AUTOMÓVEL

N.º 1234567890

IDENTIFICAÇÃO DO VEÍCULO

Matrícula BC-32-BB
Cor Preto
Marca BMW
Ano de Fabrico 2019
Modelo 320d
Cilindrada 1.995 cm3
Potência 140 kW
Categoria Ligeiro
Combustível Gasóleo
Tipo de Veículo Passageiros
N.º de Lugares 5

IDENTIFICAÇÃO DO PROPRIETÁRIO

Nome Alexandre Moniz
Data da Matrícula 15/03/2019
Morada Rua das Flores, 123
1000-123 Lisboa
NIF 123 456 789
N.º do Quadro WBA8A910X0K123456

OBSERVAÇÕES

Documento válido para circulação na via pública.
Emitido nos termos da legislação em vigor.
`;

console.log("=================================");
console.log("SentriX Vehicle Extractor");
console.log("=================================");
console.log();

try {
  const result =
    extractor.extract(ocrText);

  console.log(
    "Dados extraídos do documento:",
  );

  console.log();

  console.log(
    `Matrícula: ${result.plate ?? "Não encontrada"}`,
  );

  console.log(
    `Marca: ${result.brand ?? "Não encontrada"}`,
  );

  console.log(
    `Modelo: ${result.model ?? "Não encontrado"}`,
  );

  console.log(
    `Cor: ${result.color ?? "Não encontrada"}`,
  );

  console.log(
    `País: ${result.country ?? "Não encontrado"}`,
  );

  console.log();

  console.log("Objeto final:");

  console.log(
    JSON.stringify(
      result,
      null,
      2,
    ),
  );

  console.log();
  console.log("=================================");
  console.log("Extração concluída.");
  console.log("=================================");
} catch (error) {
  console.error();
  console.error(
    "Erro durante a extração:",
  );

  console.error(error);
}
