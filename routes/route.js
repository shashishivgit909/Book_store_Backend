import { Router } from "express";
import * as Controller from "../controllers/controler.js";
const router=Router();

router.post("/postBook",Controller.postABook);
router.get("/getBooks",Controller.getAllBooks);
router.get("/getBook/:id",Controller.getSingleBook);
router.patch("/updateBook/:id",Controller.UpdateBook);
router.delete("/deleteABook/:id",Controller.deleteABook);

export default router;