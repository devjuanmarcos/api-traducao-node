import translate from "google-translate-api-x";
import { HttpsProxyAgent } from "https-proxy-agent";

const proxyUrl = "http://82.180.132.69";
const agent = new HttpsProxyAgent(proxyUrl);

export const translateJson = async (
  json: Record<string, any>,
  lang: string
): Promise<Record<string, any>> => {
  const valuesToTranslate = extractValues(json);

  // Separa os valores em grupos de até 500 caracteres
  const chunks = chunkTextArray(valuesToTranslate, 500);

  // Traduz cada chunk e acumula os resultados em um array
  const translatedChunks: string[][] = [];
  for (const chunk of chunks) {
    const translatedChunk = await translateBatch(chunk, lang);
    translatedChunks.push(translatedChunk);
  }

  // Unifica todos os valores traduzidos em um único array
  const translatedValues = translatedChunks.flat();

  return buildTranslatedJson(json, translatedValues);
};

// Extrai os valores de um JSON para um array de strings
function extractValues(json: Record<string, any>): string[] {
  const values: string[] = [];

  const traverse = (obj: any) => {
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === "object") {
        traverse(obj[key]);
      } else if (typeof obj[key] === "string") {
        values.push(obj[key]);
      }
    }
  };

  traverse(json);
  return values;
}

// Função para dividir um array de strings em segmentos de até 'maxChars' caracteres
function chunkTextArray(textArray: string[], maxChars: number): string[][] {
  const chunks: string[][] = [];
  let currentChunk: string[] = [];
  let currentSize = 0;

  for (const text of textArray) {
    if (currentSize + text.length > maxChars) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentSize = 0;
    }
    currentChunk.push(text);
    currentSize += text.length;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// Traduz um array de textos em lote com suporte ao agente de proxy
async function translateBatch(
  texts: string[],
  lang: string
): Promise<string[]> {
  try {
    const translated = await translate(texts, {
      to: lang,
      requestOptions: { agent },
      forceTo: true,
    });

    return translated.map((item: any) => (item.text ? item.text : item));
  } catch (error) {
    console.error("Erro ao traduzir em batch:", error);
    return texts;
  }
}

// Constrói o JSON traduzido com base nos valores traduzidos
function buildTranslatedJson(
  json: Record<string, any>,
  translatedValues: string[]
): Record<string, any> {
  let valueIndex = 0;

  const traverse = (obj: any) => {
    const result: any = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
      if (obj[key] && typeof obj[key] === "object") {
        result[key] = traverse(obj[key]);
      } else if (typeof obj[key] === "string") {
        result[key] = translatedValues[valueIndex++];
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  };

  return traverse(json);
}
