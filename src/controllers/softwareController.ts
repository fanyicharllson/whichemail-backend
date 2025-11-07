import { Request, Response } from 'express'
import prisma from '../prisma/client'

export const getAllSoftware = async (_req: Request, res: Response) => {
  try {
    const items = await prisma.software.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    })
    console.log("Softwares found: ", items)
    return res.json(items)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getSoftwareById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const item = await prisma.software.findUnique({ where: { id }, include: { category: true } })
    if (!item) return res.status(404).json({ message: 'Software Not found!' })
    return res.json(item)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Internal server error! please try again' })
  }
}
