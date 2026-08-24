import { prisma } from "../../lib/prisma";
import type { IUpdateCategoryPayload } from "./category.interface";

const createCategory = async (payload: any, userId: string) => {
  const { name } = payload;

  const isCategoryExists = await prisma.category.findUnique({
    where: { name },
  });
  if (isCategoryExists) {
    throw new Error("Category with this name already exists");
  }
  const category = await prisma.category.create({
    data: {
      name,
      createdById: userId,
    },
  });
  return category;
};


const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            _count: {
                select: { products: true },
            },
        },
    })
    return categories
}

const getSingleCategory = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: {
            products: true,
        },
    })
    if (!category) {
        throw new Error('Category not found')
    }
    return category
}

const updateCategory = async (id: string, payload: IUpdateCategoryPayload) => {
    const isCategoryExists = await prisma.category.findUnique({
        where: { id },
    })
    if (!isCategoryExists) {
        throw new Error('Category not found')
    }
    const updatedCategory = await prisma.category.update({
        where: { id },
        data: {
            name: payload.name,
        },
    })
    return updatedCategory
}

const deleteCategory = async (id: string) => {
    const isCategoryExists = await prisma.category.findUnique({
        where: { id },
    })
    if (!isCategoryExists) {
        throw new Error('Category not found')
    }
    const deletedCategory = await prisma.category.delete({
        where: { id },
    })
    return deletedCategory
}

export const CategoryService = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
}