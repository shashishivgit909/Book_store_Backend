import { Router } from "express";
import * as Controller from "../controllers/controler.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyRole } from "../middleware/verifyRole.js";
const router = Router();

router.post("/postBook", verifyToken, verifyRole("admin"), Controller.postABook);
router.get("/getBooks", Controller.getAllBooks);
router.get("/getBook/:id", Controller.getSingleBook);
router.patch("/updateBook/:id", verifyToken, verifyRole("admin"), Controller.UpdateBook);
router.delete("/deleteABook/:id", verifyToken, verifyRole("admin"), Controller.deleteABook);
router.post("/createOrder", Controller.createAOrder);
router.get("/email/:email", Controller.getOrderByEmail);
router.post("/createuser", Controller.createuser);
router.post("/loginAdmin", Controller.loginAdmin);
router.get("/getstatistics",verifyToken,Controller.adminstatistics);
export default router; 
