

import express from "express"
import * as AdminControllers from "../controllers/admin.controller.js"

import {generatetoken} from "../middleware/jwt.js"
import { RegisterValidator } from "../utils/expressvalidator.js"


const router = express.Router()

router.post("/adminregister",RegisterValidator,AdminControllers.addAdmin)
router.post("/adminlogin",RegisterValidator,AdminControllers.adminLogin,generatetoken)
















export default router;