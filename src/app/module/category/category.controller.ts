import { Request, Response } from "express";
import httpStatus from "http-status";
import { CategoryService } from "./category.service";
import { IRequestUser } from "../auth/auth.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req?.user as IRequestUser;
  const result = await CategoryService.createCategory(req.body, userId);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});


const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.getAllCategories()
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Categories fetched successfully',
        data: result,
    })
})

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await CategoryService.getSingleCategory(id as string)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category fetched successfully',
        data: result,
    })
})

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await CategoryService.updateCategory(id as string, req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category updated successfully',
        data: result,
    })
})

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await CategoryService.deleteCategory(id as string)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category deleted successfully',
        data: result,
    })
})

export const CategoryController = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
}