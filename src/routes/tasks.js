import express from "express";
import { destroy, getAll, getById, store, update } from "../controllers/tasks.js";
import validate from "../middlewares/validate.js";
import taskSchema from "../validations/taskSchema.js";
import getAllTaskSchema from "../validations/getAllTaskSchema.js";
import updateTaskSchema from "../validations/updateTaskSchema.js";
import { asyncHandler } from "../helper.js";


const router = express.Router();

// Create Task
router.post('/', validate(taskSchema), asyncHandler(store));

// Get All Tasks (with pagination and optional filtering)
router.get('/', validate(getAllTaskSchema, true), asyncHandler(getAll));

// Get Task by ID
router.get('/:id', asyncHandler(getById));

// Update Task
router.put('/:id', validate(updateTaskSchema), asyncHandler(update));

// Delete Task
router.delete('/:id', asyncHandler(destroy));

export default router;
