import { Router, RequestHandler } from "express";
import { GetActivities, PostActivities, PutActivity, DeleteActivity, FindByDifficulty } from "../controllers/activities.controller";

const router = Router();

router.get("/", GetActivities as RequestHandler);
router.post("/", PostActivities as RequestHandler);
router.put("/:id", PutActivity as RequestHandler);
router.delete("/:id", DeleteActivity as RequestHandler);
router.get("/search", FindByDifficulty);

export default router;
