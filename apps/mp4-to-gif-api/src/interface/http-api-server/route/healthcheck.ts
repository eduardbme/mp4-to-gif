import express from 'express';

export function healthcheck() {
  const router = express.Router();

  router.get('/', async (req: express.Request, res: express.Response) => {
    return res.status(200).json({
      code: 0,
      payload: {},
    });
  });

  return router;
}
