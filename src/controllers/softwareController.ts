import { Request, Response } from "express";
import prisma from "../prisma/client";

export const getAllSoftware = async (req: Request, res: Response) => {
  const {
    page = "1",
    perPage = "20",
    category,
    platform,
    tags,
    q,
    featured,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    order = "desc",
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const per = Math.min(100, Math.max(1, parseInt(perPage, 10) || 20));

  const where: any = {};

  if (category) {
    // allow filtering by category slug or id
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
    // for String[] fields in Postgres, use has
    where.platform = { has: platform };
  }

  if (tags) {
    where.tags = { has: tags };
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
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
    return res.json({
      data: items,
      meta: { total, page: pageNum, perPage: per, totalPages },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSoftwareById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const item = await prisma.software.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!item) return res.status(404).json({ message: "Software Not found!" });
    return res.json(item);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Internal server error! please try again" });
  }
};
