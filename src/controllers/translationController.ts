import { Request, Response, NextFunction } from "express";
import { translateJson } from "../services/translationService";
import { languages } from "../utils/language";
import fs from "fs";
import path from "path";

export const translateJsonEndpoint = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { language } = req.query;

  if (typeof language !== "string") {
    res.status(400).json({ error: "Parâmetro 'Language' deve ser uma string" });
    return;
  }

  const jsonToTranslate = req.body;

  try {
    const translatedJson = await translateJson(jsonToTranslate, language);
    const folderPath = path.join(__dirname, "../folders/JsonsTraduzidos");
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

    const fileName = `${language}.json`;
    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(translatedJson, null, 2));

    res.status(200).json({
      message: `JSON traduzido e salvo como ${fileName}; JSON: ${JSON.stringify(
        translatedJson
      )}  `,
    });
  } catch (error) {
    next(error);
  }
};

export const translateFullLanguagesEndpoint = async (
  req: Request,
  res: Response
) => {
  const jsonToTranslate = req.body;
  const folderPath = path.join(
    __dirname,
    "../folders/JsonsTraduzidosAllLanguages"
  );
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

  const translationPromises = languages.map(async (lang) => {
    try {
      const translatedJson = await translateJson(jsonToTranslate, lang);
      const fileName = `${lang}.json`;
      const filePath = path.join(folderPath, fileName);
      fs.writeFileSync(filePath, JSON.stringify(translatedJson, null, 2));
      return { lang, sucess: true };
    } catch (error) {
      if (error instanceof Error) {
        return { lang, success: false, error: error.message };
      } else {
        return { lang, success: false, error: "Erro desconhecido" };
      }
    }
  });

  const results = await Promise.all(translationPromises);
  res
    .status(200)
    .json({ message: "Tradução concluída para vários idiomas", results });
};
