import { MovementType } from '../../../generated/prisma/enums'
import { prisma } from '../../lib/prisma'
import { ICreateStockMovementPayload } from './stock.interface'

const createStockMovement = async (
    productId: string,
    payload: ICreateStockMovementPayload,
    userId: string
) => {
    const { type, quantity, note } = payload

    if (quantity <= 0) {
        throw new Error('Quantity must be greater than zero')
    }

    const product = await prisma.product.findUnique({
        where: { id: productId },
    })

    if (!product) {
        throw new Error('Product not found')
    }

    if (type === MovementType.OUT && quantity > product.stockQuantity) {
        throw new Error(`Insufficient stock. Available stock is ${product.stockQuantity}`)
    }

    const newStockQuantity =
        type === MovementType.IN
            ? product.stockQuantity + quantity
            : product.stockQuantity - quantity

    const result = await prisma.$transaction(async (tx) => {
        const movement = await tx.stockMovement.create({
            data: {
                productId,
                userId,
                type,
                quantity,
                note,
            },
            include: {
                product: {
                    select: { id: true, name: true, sku: true, stockQuantity: true },
                },
                user: {
                    select: { id: true, name: true, email: true, role: true },
                },
            },
        })

        await tx.product.update({
            where: { id: productId },
            data: {
                stockQuantity: newStockQuantity,
            },
        })

        return movement
    })

    return result
}

const getProductStockMovements = async (productId: string) => {
    const isProductExists = await prisma.product.findUnique({
        where: { id: productId },
    })

    if (!isProductExists) {
        throw new Error('Product not found')
    }

    const movements = await prisma.stockMovement.findMany({
        where: { productId },
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: { id: true, name: true, email: true, role: true },
            },
        },
    })

    return movements
}

export const StockService = {
    createStockMovement,
    getProductStockMovements,
}