import { Router } from "express";
import {
  translateJsonEndpoint,
  translateFullLanguagesEndpoint,
} from "../controllers/translationController";

const router: Router = Router();

router.post("/translate-json", translateJsonEndpoint);
router.post("/translate-all-languages", translateFullLanguagesEndpoint);

export default router;

/**
 * @swagger
 * /translate-json:
 *   post:
 *     summary: "Translate a JSON"
 *     description: "Translate the content of a JSON object into a specified language."
 *     parameters:
 *       - name: "language"
 *         in: query
 *         description: "The language to translate to"
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties:
 *               type: string
 *     responses:
 *       200:
 *         description: "Successfully translated the JSON."
 *       400:
 *         description: "Bad Request. Missing required parameters."
 *       500:
 *         description: "Internal Server Error."
 */

/**
 * @swagger
 * /translate-all-languages:
 *   post:
 *     summary: "Translate JSON content to all supported languages"
 *     description: "Translate the content of a JSON object to all languages supported by the service."
 *     parameters:
 *       - name: "language"
 *         in: query
 *         description: "The language to start the translation process."
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties:
 *               type: string
 *     responses:
 *       200:
 *         description: "Successfully translated the JSON to all languages."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: string
 *       400:
 *         description: "Bad Request. Missing required parameters."
 *       500:
 *         description: "Internal Server Error. An unexpected error occurred during the translation."
 */
