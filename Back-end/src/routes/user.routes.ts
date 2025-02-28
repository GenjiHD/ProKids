import { Router, RequestHandler } from "express";
import { GetUsers, PostUser, PutUser, DeleteUser, GetUserByEmail } from "../controllers/user.controller";

const router = Router();

router.get("/", GetUsers as RequestHandler);
router.post("/", PostUser as RequestHandler);
router.put("/:id", PutUser as RequestHandler);
router.delete("/:id", DeleteUser as RequestHandler);
router.get("/search", GetUserByEmail as RequestHandler);

export default router;

