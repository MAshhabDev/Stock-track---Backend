import { Router } from 'express'
import { Role } from '../../../generated/prisma/enums'
import { AuthController } from './auth.controller'
import { auth } from '../../middleware/checkAuth'

const router = Router()

router.post('/register', AuthController.registerUser)
router.post('/login', AuthController.loginUser)

router.get(
    '/me',
    auth(Role.ADMIN,Role.STAFF),
    AuthController.getMe,
)

router.post('/refresh-token', AuthController.refreshToken)
export const AuthRoutes = router
