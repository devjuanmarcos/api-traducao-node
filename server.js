const express = require("express");
const fs = require("fs");
const path = require("path");
const translate = require("google-translate-api-x"); // Use google-translate-api-x para tradução
const app = express();

// Middleware para processar JSON no corpo da requisição
app.use(express.json());

// Lista de idiomas predefinidos para o endpoint 'translate-full-languages'
const languages = [
  "zh-Hant",
  "zh-Hans",
  "en",
  "pt",
  "es",
  "ja",
  "de",
  "fr",
  "it",
  "bn",
  "hi",
  "ru",
  "ko",
  "vi",
  "te",
  "yue",
  "mr",
  "ta",
  "tr",
  "ur",
  "gu",
  "pl",
  "uk",
  "ms",
  "kn",
  "or",
  "pa",
  "ro",
  "az",
  "fa",
  "my",
  "th",
  "nl",
  "yo",
  "sd",
];

// Função para traduzir os valores do JSON
const translateJson = async (json, lang) => {
  const translatedJson = {};

  for (let key in json) {
    if (json.hasOwnProperty(key)) {
      if (typeof json[key] === "object") {
        // Se o valor for um objeto, chamamos recursivamente a função
        translatedJson[key] = await translateJson(json[key], lang);
      } else {
        try {
          const translatedText = await translate(json[key], { to: lang });
          translatedJson[key] = translatedText.text;
        } catch (error) {
          translatedJson[key] = json[key]; // Caso haja erro na tradução, mantém o valor original
        }
      }
    }
  }

  return translatedJson;
};

// Endpoint para traduzir o JSON (traduz para um único idioma)
app.post("/translate-json", async (req, res) => {
  const { language } = req.query; // Pega o parâmetro 'language' da query
  const jsonToTranslate = req.body; // O JSON a ser traduzido é enviado no corpo da requisição

  // Verifica se o parâmetro 'language' foi enviado
  if (!language) {
    return res.status(400).json({ error: "Language parameter is required" });
  }

  try {
    const translatedJson = await translateJson(jsonToTranslate, language);

    // Cria a pasta 'JsonsTraduzidos' se não existir
    const folderPath = path.join(__dirname, "JsonsTraduzidos");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Cria o arquivo com o nome do idioma
    const fileName = `${language}.json`;
    const filePath = path.join(folderPath, fileName);

    // Salva o JSON traduzido no arquivo
    fs.writeFileSync(filePath, JSON.stringify(translatedJson, null, 2));

    res.status(200).json({
      message: `JSON traduzido com sucesso! O arquivo foi salvo como ${fileName}`,
      translatedJson,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao traduzir o JSON" });
  }
});

// Endpoint para traduzir e gerar diversos JSONs (traduz para vários idiomas predefinidos)
app.post("/translate-full-languages", async (req, res) => {
  const jsonToTranslate = req.body; // O JSON a ser traduzido é enviado no corpo da requisição

  // Cria a pasta 'JsonsTraduzidosAllLanguages' se não existir
  const folderPath = path.join(__dirname, "JsonsTraduzidosAllLanguages");
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  // Array para armazenar as promessas de tradução
  const translationPromises = languages.map(async (lang) => {
    try {
      const translatedJson = await translateJson(jsonToTranslate, lang);

      // Cria o arquivo com o nome do idioma
      const fileName = `${lang}.json`;
      const filePath = path.join(folderPath, fileName);

      // Salva o JSON traduzido no arquivo
      fs.writeFileSync(filePath, JSON.stringify(translatedJson, null, 2));
      return { lang, success: true };
    } catch (error) {
      return { lang, success: false, error: error.message };
    }
  });

  // Espera todas as traduções serem concluídas
  const results = await Promise.all(translationPromises);

  // Retorna a resposta com os resultados
  res.status(200).json({
    message: "JSON traduzido com sucesso para diversos idiomas!",
    results,
  });
});

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
