import translate from "google-translate-api-x";
import { TranslationResponse } from "../@types/translationsTypes";

export const translateJson = async (
  json: Record<string, any>,
  lang: string
): Promise<Record<string, any>> => {
  const translatedJson: Record<string, any> = {};

  for (const key in json) {
    if (!Object.prototype.hasOwnProperty.call(json, key)) continue;
    translatedJson[key] = await translateValue(json[key], lang);
  }

  return translatedJson;
};

async function translateValue(value: any, lang: string): Promise<any> {
  if (typeof value === "object") {
    return await translateJson(value, lang);
  }
  return await translateText(value, lang);
}

async function translateText(text: string, lang: string): Promise<string> {
  try {
    const translatedText = await translate(text, { to: lang });
    return isTranslationResponse(translatedText) ? translatedText.text : text;
  } catch {
    return text;
  }
}

function isTranslationResponse(response: any): response is TranslationResponse {
  return response && typeof response.text === "string";
}
