import express from 'express'
import { StockController } from './stock.controller'
import { auth } from '../../middleware/checkAuth'
import { Role } from '../../../generated/prisma/enums'

const router = express.Router()

router.post('/products/:id/stock', auth(Role.ADMIN, Role.STAFF), StockController.createStockMovement)

router.get('/products/:id/movements', auth(Role.ADMIN, Role.STAFF), StockController.getProductStockMovements)

export const StockRoutes = router