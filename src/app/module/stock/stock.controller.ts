import { Request, Response } from "express";
import httpStatus from "http-status";
import { StockService } from "./stock.service";
import { IRequestUser } from "../auth/auth.interface";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

const createStockMovement = catchAsync(async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  const { userId } = req?.user!;

  const result = await StockService.createStockMovement(
    productId as string,
    req.body,
    userId,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `Stock ${req.body.type === "IN" ? "added" : "reduced"} successfully`,
    data: result,
  });
});

const getProductStockMovements = catchAsync(
  async (req: Request, res: Response) => {
    const { id: productId } = req.params;
    const result = await StockService.getProductStockMovements(
      productId as string,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Stock movement history fetched successfully",
      data: result,
    });
  },
);

export const StockController = {
  createStockMovement,
  getProductStockMovements,
};
