import express, { Request, Response } from 'express'
import { requireAuth } from '@sanguinee06-justix/common'

const router = express.Router()

router.post('/api/tickets', requireAuth, (req: Request, res: Response) => {
  res.sendStatus(200)
})

router.get('/api/tickets/test', requireAuth, (req: Request, res: Response) => {
  res.sendStatus(200)
})

export { router as createTicketRouter }
