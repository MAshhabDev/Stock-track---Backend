import { prisma } from '../../lib/prisma'
import { ICreateProductPayload, IProductFilterRequest, IUpdateProductPayload } from './product.interface'


const createProduct = async (payload: ICreateProductPayload, userId: string) => {
    const { name, sku, price, stockQuantity, lowStockLimit, categoryId } = payload
    // SKU অনন্য কিনা চেক
    const isSkuExists = await prisma.product.findUnique({
        where: { sku },
    })
    if (isSkuExists) {
        throw new Error('Product with this SKU already exists')
    }
    const isCategoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
    })
    if (!isCategoryExists) {
        throw new Error('Category not found')
    }
    const product = await prisma.product.create({
        data: {
            name,
            sku,
            price,
            stockQuantity: stockQuantity || 0,
            lowStockLimit: lowStockLimit || 5,
            categoryId,
            createdById: userId,
        },
        include: {
            category: true,
        },
    })
    return product
}


const getAllProducts = async (filters: IProductFilterRequest) => {
    const { searchTerm, category, page = 1, limit = 10 } = filters
    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    const skip = (pageNumber - 1) * limitNumber
    const andConditions: any[] = []
    if (searchTerm) {
        andConditions.push({
            OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { sku: { contains: searchTerm, mode: 'insensitive' } },
            ],
        })
    }
    if (category) {
        andConditions.push({
            categoryId: category,
        })
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {}
    const products = await prisma.product.findMany({
        where: whereConditions,
        skip,
        take: limitNumber,
        orderBy: { createdAt: 'desc' },
        include: {
            category: true,
        },
    })
    const total = await prisma.product.count({ where: whereConditions })
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages: Math.ceil(total / limitNumber),
        },
        data: products,
    }
}


const getSingleProduct = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            stockMovements: {
                orderBy: { createdAt: 'desc' },
                take: 5,
            },
        },
    })
    if (!product) {
        throw new Error('Product not found')
    }
    return product
}

const getLowStockProducts = async () => {
    const allProducts = await prisma.product.findMany({
        include: {
            category: true,
        },
    })
    const lowStockProducts = allProducts.filter(
        (product) => product.stockQuantity <= product.lowStockLimit
    )
    return lowStockProducts
}


const updateProduct = async (id: string, payload: IUpdateProductPayload) => {
    const isProductExists = await prisma.product.findUnique({
        where: { id },
    })
    if (!isProductExists) {
        throw new Error('Product not found')
    }
    const updatedProduct = await prisma.product.update({
        where: { id },
        data: payload,
        include: {
            category: true,
        },
    })
    return updatedProduct
}

const deleteProduct = async (id: string) => {
    const isProductExists = await prisma.product.findUnique({
        where: { id },
    })
    if (!isProductExists) {
        throw new Error('Product not found')
    }
    const deletedProduct = await prisma.product.delete({
        where: { id },
    })
    return deletedProduct
}


export const ProductService = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    getLowStockProducts,
    updateProduct,
    deleteProduct,
}