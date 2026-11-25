import { Router, type IRouter } from "express";
import healthRouter from "./health";
import enquiriesRouter from "./enquiries";
import authRouter from "./auth";
import coursesRouter from "./courses";
import assignmentsRouter from "./assignments";
import classesRouter from "./classes";
import forumsRouter from "./forums";
import usersRouter from "./users";

const router: IRouter = Router();

router.use(healthRouter);
router.use(enquiriesRouter);
router.use(authRouter);
router.use(coursesRouter);
router.use(assignmentsRouter);
router.use(classesRouter);
router.use(forumsRouter);
router.use(usersRouter);

export default router;
