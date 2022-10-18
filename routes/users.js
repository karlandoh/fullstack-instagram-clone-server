import express from "express";

import { signin } from "../controllers/users.js";
import { signup } from "../controllers/users.js";
import { getUsers } from "../controllers/users.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/signin", signin);
router.post("/signup", signup);

export default router;
