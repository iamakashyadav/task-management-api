import ValidationError from "../errors/validation.js";
import ConflictError from "../errors/conflictError.js";
import db from '../db/connection.js';

const store = async (req, res) => {
    const { title, description, status } = req.body;
  
    // Check for duplicate title for this user
    const existingTask = await db('tasks')
      .where({ user_id: req.user.id, title: title.trim() })
      .first();
  
    if (existingTask) {
      throw new ConflictError('Task title must be unique. You already have a task with this title.');
    }
  
    const [taskId] = await db('tasks').insert({
      user_id: req.user.id,
      title: title.trim(),
      description: description || null,
      status: status || 'pending'
    });
  
    const newTask = await db('tasks').where({ id: taskId }).first();
  
    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
};

const getAll = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const status = req.query.status;
  const search = req.query.search;

  let query = db('tasks').where({ user_id: req.user.id });

  // Apply filters
  if (status) {
    query = query.where({ status });
  }

  if (search) {
    query = query.where(function() {
      this.where('title', 'like', `%${search}%`)
          .orWhere('description', 'like', `%${search}%`);
    });
  }

  // Get total count for pagination
  const totalQuery = query.clone();
  const [{ count: total }] = await totalQuery.count('id as count');

  // Get paginated results
  const tasks = await query
    .select('*')
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset((page - 1) * limit);

  const totalPages = Math.ceil(total / limit);

  res.json({
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
};

const getById = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    throw new ValidationError('Invalid task ID');
  }

  const task = await db('tasks')
    .where({ id: parseInt(id), user_id: req.user.id })
    .first();

  if (!task) {
    throw new NotFoundError('Task not found');
  }

  res.json({ task });
};

const update = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  if (isNaN(id)) {
    throw new ValidationError('Invalid task ID');
  }

  const task = await db('tasks')
    .where({ id: parseInt(id), user_id: req.user.id })
    .first();

  if (!task) {
    throw new NotFoundError('Task not found');
  }

  // Check for duplicate title if title is being updated
  if (title && title.trim() !== task.title) {
    const existingTask = await db('tasks')
      .where({ user_id: req.user.id, title: title.trim() })
      .whereNot('id', parseInt(id))
      .first();

    if (existingTask) {
      throw new ConflictError('Task title must be unique. You already have a task with this title.');
    }
  }

  const updateData = {
    updated_at: db.fn.now()
  };

  if (title !== undefined) updateData.title = title.trim();
  if (description !== undefined) updateData.description = description;
  if (status !== undefined) updateData.status = status;

  await db('tasks')
    .where({ id: parseInt(id) })
    .update(updateData);

  const updatedTask = await db('tasks').where({ id: parseInt(id) }).first();

  res.json({
    message: 'Task updated successfully',
    task: updatedTask
  });
};

const destroy = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    throw new ValidationError('Invalid task ID');
  }

  const deletedCount = await db('tasks')
    .where({ id: parseInt(id), user_id: req.user.id })
    .del();

  if (deletedCount === 0) {
    throw new NotFoundError('Task not found');
  }

  res.status(204).send();
};

export {
  store,
  getAll,
  getById,
  update,
  destroy,
};

