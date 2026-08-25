import express from 'express'
import { ProductController } from './product.controlle'
import { Role } from '../../../generated/prisma/enums'
import { auth } from '../../middleware/checkAuth'

const router = express.Router()

router.get('/low-stock', auth(Role.ADMIN, Role.STAFF), ProductController.getLowStockProducts)

router.post('/', auth(Role.ADMIN), ProductController.createProduct)

router.get('/', auth(Role.ADMIN, Role.STAFF), ProductController.getAllProducts)

router.get('/:id', auth(Role.ADMIN, Role.STAFF), ProductController.getSingleProduct)

router.patch('/:id', auth(Role.ADMIN), ProductController.updateProduct)

router.delete('/:id', auth(Role.ADMIN), ProductController.deleteProduct)

export const ProductRoutes = router