import { Router } from 'express'
import { Role } from '../../../generated/prisma/enums'
import { AuthController } from './auth.controller'

const router = Router()

router.post('/register', AuthController.registerPatient)
router.post('/login', AuthController.loginUser)

router.post('/refresh-token', AuthController.refreshToken)
export const AuthRoutes = router
