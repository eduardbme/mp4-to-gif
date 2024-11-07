import express from 'express';
import { documents } from './documents';

export function v1() {
  const version = 'v1';

  const router = express.Router();

  router.use(`/${version}/documents`, documents());

  return router;
}
