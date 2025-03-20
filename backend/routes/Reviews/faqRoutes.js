import express from "express";
import {
  addFaq,
  getAllFaqs,
  getServiceFaqs,
  updateFaq,
  deleteFaq,
} from "../../controller/Reviews_and_Ratings/faqController.js";

import { protect } from "../../middleware/authMiddleware.js";

const faqRouter = express.Router();

faqRouter.post("/create", protect, addFaq); 
faqRouter.get("/all", getAllFaqs); 
faqRouter.get("/service/:serviceId", getServiceFaqs);
faqRouter.put("/update/:faqId", protect, updateFaq); 
faqRouter.delete("/delete/:faqId", deleteFaq); 

export default faqRouter;
