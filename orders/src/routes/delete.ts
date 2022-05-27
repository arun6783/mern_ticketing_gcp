import express, { Request, Response } from 'express'

const router = express.Router()

router.delete('/api/orders/:id', async (req: Request, res: Response) => {
  res.send('delete orders response')
})

export { router as deleteOrderRouter }
