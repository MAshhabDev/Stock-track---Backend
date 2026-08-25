export interface ICreateProductPayload {
    name: string
    sku: string
    price: number
    stockQuantity?: number
    lowStockLimit?: number
    categoryId: string
}

export interface IUpdateProductPayload {
    name?: string
    sku?: string
    price?: number
    stockQuantity?: number
    lowStockLimit?: number
    categoryId?: string
}

export interface IProductFilterRequest {
    searchTerm?: string
    category?: string
    page?: number
    limit?: number
}