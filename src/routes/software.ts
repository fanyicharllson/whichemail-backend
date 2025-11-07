import { Router } from 'express'
import { getAllSoftware, getSoftwareById } from '../controllers/softwareController'

const router = Router()

router.get('/', getAllSoftware)
router.get('/:id', getSoftwareById)

export default router
