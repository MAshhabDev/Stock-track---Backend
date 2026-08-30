import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, Request, Response } from 'express'
import httpStatus from "http-status"
import config from './app/config'
import { globalErrorHandler } from './app/middleware/globalErrorHandler'
import { notFound } from './app/middleware/notFound'

import { AuthRoutes } from './app/module/auth/auth.route'
import { CategoryRoutes } from './app/module/category/category.route'
import { ProductRoutes } from './app/module/product/product.route'
import { StockRoutes } from './app/module/stock/stock.route'

const app: Application = express()

app.use(
    cors({
        origin: config.frontend_url,
        credentials: true,
    }),
)

app.use(express.urlencoded({ extended: true }))

app.use(express.json())
app.use(cookieParser())

// 🚀 Register All API Routes
app.use('/api/v1/auth', AuthRoutes)
app.use('/api/v1/categories', CategoryRoutes)
app.use('/api/v1/products', ProductRoutes)
app.use('/api/v1', StockRoutes) // Stock IN/OUT (/products/:id/stock) & Movements (/products/:id/movements)

// Basic Welcome Route
app.get('/', async (req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Welcome to StockTrack Inventory Management API',
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app