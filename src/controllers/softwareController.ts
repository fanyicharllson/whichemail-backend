import { Request, Response } from "express";
import prisma from "../prisma/client";

export const getAllSoftware = async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "8",  // Changed from perPage to limit to match frontend
    category,
    platform,
    tags,
    search,  // Changed from 'q' to 'search' to match frontend
    featured,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    order = "desc",
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const per = Math.min(100, Math.max(1, parseInt(limit, 10) || 8));

  const where: any = {};

  if (category) {
    // Filter by category slug to match frontend
    where.category = { slug: category };
  }

  if (featured !== undefined) {
    where.featured = featured === "true" || featured === "1";
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  if (platform) {
    // For String[] fields in Postgres, use has
    where.platform = { has: platform };
  }

  if (tags) {
    where.tags = { has: tags };
  }

  // Changed from 'q' to 'search'
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: any = {};
  orderBy[sortBy] = order === "asc" ? "asc" : "desc";

  try {
    const [total, items] = await Promise.all([
      prisma.software.count({ where }),
      prisma.software.findMany({
        where,
        include: { category: true },
        orderBy,
        skip: (pageNum - 1) * per,
        take: per,
      }),
    ]);

    const totalPages = Math.ceil(total / per);
    
    // Updated response format to match frontend expectations
    return res.json({
      success: true,
      data: items,
      pagination: {
        total,
        page: pageNum,
        limit: per,
        totalPages
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

export const getSoftwareById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const item = await prisma.software.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: "Software not found!" 
      });
    }
    return res.json({
      success: true,
      data: item
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error! Please try again" 
    });
  }
};

// New endpoint to get software by slug (for better URLs)
export const getSoftwareBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const item = await prisma.software.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: "Software not found!" 
      });
    }
    return res.json({
      success: true,
      data: item
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error! Please try again" 
    });
  }
};

// New endpoint to get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    return res.json({
      success: true,
      data: categories
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      success: false,
      message: "Failed to fetch categories" 
    });
  }
};

// New endpoint to get featured software
export const getFeaturedSoftware = async (req: Request, res: Response) => {
  try {
    const featured = await prisma.software.findMany({
      where: { featured: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 6
    });
    return res.json({
      success: true,
      data: featured
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      success: false,
      message: "Failed to fetch featured software" 
    });
  }
};