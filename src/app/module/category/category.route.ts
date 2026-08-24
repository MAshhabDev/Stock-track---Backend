import express from 'express'
import { CategoryController } from './category.controller'
import { auth } from '../../middleware/checkAuth'
import { Role } from '../../../generated/prisma/enums'

const router = express.Router()

router.post('/', auth(Role.ADMIN), CategoryController.createCategory)

router.get('/', auth(Role.ADMIN, Role.STAFF), CategoryController.getAllCategories)

router.get('/:id', auth(Role.ADMIN, Role.STAFF), CategoryController.getSingleCategory)

router.patch('/:id', auth(Role.ADMIN), CategoryController.updateCategory)

router.delete('/:id', auth(Role.ADMIN), CategoryController.deleteCategory)

export const CategoryRoutes = router