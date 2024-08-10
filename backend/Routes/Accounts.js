import express from "express";
import { createAccount } from "../controllers/createAccountController.js";
import { updateAccount } from "../controllers/updateAccountController.js";
import { deleteAccount } from "../controllers/deleteAccountController.js";
import {
  getAccount,
  getAccounts,
  getUserAccount,
} from "../controllers/getAccountController.js";
import { login } from "../controllers/loginController.js";
import {
  deposit,
  withdraw,
  transfer,
  getTransactionHistory,
} from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { eraseAccount } from "../controllers/EraseAccountController.js";

const router = express.Router();

//Get All
router.get("/", getAccounts);

//Get single
router.get("/:accountNumber", getAccount);

//Put one
router.post("/", createAccount);

//Delete
router.delete("/delete/:accountNumber", deleteAccount);

//update
router.patch("/update", authMiddleware, updateAccount);

// erase account
router.delete("/erase", authMiddleware, eraseAccount);

//Login Routes
router.post("/login", login);

//Transaction Routes
router.post("/deposit", authMiddleware, deposit);
router.post("/withdraw", authMiddleware, withdraw);
router.post("/transfer", authMiddleware, transfer);
router.get("/transactions", authMiddleware, getTransactionHistory);
router.get("/get-user-account/:accountNumber", authMiddleware, getUserAccount);

export default router;
