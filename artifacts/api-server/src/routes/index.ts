import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminAuthRouter from "./admin/auth";
import adminUsersRouter from "./admin/users";
import adminRbacRouter from "./admin/rbac";
import settingsRouter from "./admin/settings";
import contentRouter from "./admin/content";
import leadsRouter from "./admin/leads";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminAuthRouter);
router.use(adminUsersRouter);
router.use(adminRbacRouter);
router.use(settingsRouter);
router.use(contentRouter);
router.use(leadsRouter);

export default router;
