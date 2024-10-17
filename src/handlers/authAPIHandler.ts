import express from "express";
import { HTTPError } from "../models/HTTPError";
import { AuthAPI } from "../datasources/authAPI/AuthAPI";

const authAPI = new AuthAPI();

const REQUEST_TIMEOUT = 5 * 1000;
const RESPONSE_TIMEOUT = 10 * 1000;

const timeoutMiddleware =
  (responseTimeout = RESPONSE_TIMEOUT, requestTimeout = REQUEST_TIMEOUT) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    req.setTimeout(requestTimeout, () => {
      res.status(408).json({ message: "Request timeout" });
    });

    res.setTimeout(responseTimeout, () => {
      res.status(504).json({ message: "Response timeout" });
    });

    next();
  };

const router = express.Router();

router.post("/sign-in", timeoutMiddleware(), async (req, res) => {
  const body = req.body;
  const { email, password } = body;

  try {
    const response = await authAPI.signInWithCredentials({
      email,
      password,
    });

    res.json(response);
  } catch (error) {
    if (error instanceof HTTPError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error" });
    }
  }
});

router.post("/sign-up", timeoutMiddleware(), async (req, res) => {
  const body = req.body;
  const { email, password, name, nickname } = body;

  try {
    const response = await authAPI.registerUser({
      name,
      email,
      nickname,
      password,
    });

    res.json(response);
  } catch (error) {
    if (error instanceof HTTPError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error" });
    }
  }
});

export default router;
