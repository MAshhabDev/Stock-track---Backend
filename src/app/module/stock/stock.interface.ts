import type { MovementType } from "../../../generated/prisma/enums"

export interface ICreateStockMovementPayload {
    type: MovementType // 'IN' | 'OUT'
    quantity: number
    note?: string
}