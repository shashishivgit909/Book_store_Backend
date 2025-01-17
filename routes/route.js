import { Router } from "express";
import * as Controller from "../controllers/controler.js";
const router=Router();

router.post("/postBook",Controller.postABook);

export default router;