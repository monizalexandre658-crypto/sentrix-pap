export interface ExtractedVehicleDocumentData {
  plate: string | null;
  brand: string | null;
  model: string | null;
  color: string | null;
  country: string | null;
}

export class VehicleDocumentExtractorService {
  extract(
    text: string,
  ): ExtractedVehicleDocumentData {
    if (!text || !text.trim()) {
      throw new Error(
        "Texto do documento não fornecido.",
      );
    }

    const normalizedText =
      text
        .replace(/\r/g, " ")
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const plate =
      this.extractPlate(normalizedText);

    const brand =
      this.extractBrand(normalizedText);

    const model =
      this.extractModel(normalizedText);

    const color =
      this.extractColor(normalizedText);

    const country =
      this.extractCountry(normalizedText);

    return {
      plate,
      brand,
      model,
      color,
      country,
    };
  }

  private extractPlate(
    text: string,
  ): string | null {
    const match = text.match(
      /Matrícula\s*:?\s*([A-Z]{2}[-\s]?\d{2}[-\s]?[A-Z]{2})/i,
    );

    if (!match) {
      return null;
    }

    return match[1]
      .toUpperCase()
      .replace(/\s+/g, "-");
  }

  private extractBrand(
    text: string,
  ): string | null {
    const match = text.match(
      /Marca\s*:?\s*([A-Za-zÀ-ÿ0-9-]+)/i,
    );

    if (!match) {
      return null;
    }

    return match[1].trim();
  }

  private extractModel(
    text: string,
  ): string | null {
    const match = text.match(
      /Modelo\s*:?\s*([A-Za-zÀ-ÿ0-9-]+)/i,
    );

    if (!match) {
      return null;
    }

    return match[1].trim();
  }

  private extractColor(
    text: string,
  ): string | null {
    const match = text.match(
      /Cor\s*:?\s*([A-Za-zÀ-ÿ]+)/i,
    );

    if (!match) {
      return null;
    }

    return match[1].trim();
  }

  private extractCountry(
    text: string,
  ): string | null {
    if (
      /REPÚBLICA\s+PORTUGUESA/i.test(
        text,
      )
    ) {
      return "PT";
    }

    if (
      /PORTUGUESA/i.test(text)
    ) {
      return "PT";
    }

    return null;
  }
}