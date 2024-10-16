import { Router } from "express";

const router = Router();

router.all("*", (_, res) => {
  res.status(200).json({ message: "There is nothing 👀 " });
});

export default router;
