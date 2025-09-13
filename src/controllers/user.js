import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ConflictError from "../errors/conflictError.js";
import AuthenticationError from "../errors/authenticationError.js";
import { JWT_SECRET } from '../constants.js';
import db from '../db/connection.js';

const register = async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
        throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [userId] = await db('users').insert({
        name,
        email,
        password: hashedPassword
    });

    const newUser = await db('users')
        .select('id', 'name', 'email', 'created_at')
        .where({ id: userId })
        .first();

    res.status(201).json({
        message: 'User registered successfully',
        user: newUser
    });
};


const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await db('users').where({ email }).first();
    
    if (!user) {
        throw new AuthenticationError('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw new AuthenticationError('Invalid credentials');
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        message: 'Login successful',
        token,
        user: {
        id: user.id,
        name: user.name,
        email: user.email
        }
    });
};

const updateProfile = async (req, res) => {
    const { name, email } = req.body;

    // Check if email is already taken by another user
    if (email) {
        const existingUser = await db('users')
        .where({ email })
        .andWhere('id', '!=', req.user.id)
        .first();

        if (existingUser) {
            throw new ConflictError('Email already in use');
        }
    }

    const updateData = { updated_at: db.fn.now() };
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    await db('users')
        .where({ id: req.user.id })
        .update(updateData);

    const updatedUser = await db('users')
        .select('id', 'name', 'email', 'updated_at')
        .where({ id: req.user.id })
        .first();

    res.json({
        message: 'Profile updated successfully',
        user: updatedUser
    });
};

export {
    register,
    login,
    updateProfile,
};