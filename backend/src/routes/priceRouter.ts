import express, { Request, Response } from "express";
import { fetchPriceData } from "../controllers/priceController";

const cryptoPriceRouter = express.Router();

cryptoPriceRouter.get("/get-price-for-symbol/:symbol", fetchPriceData);

export default cryptoPriceRouter;
