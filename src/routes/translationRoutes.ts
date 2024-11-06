import { Router } from "express";
import {
  translateJsonEndpoint,
  translateFullLanguagesEndpoint,
} from "../controllers/translationController";

const router: Router = Router();

router.post("/translate-json", translateJsonEndpoint);
router.post("/translate-all-languages", translateFullLanguagesEndpoint);

export default router;
