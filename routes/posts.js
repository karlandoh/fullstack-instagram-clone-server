import express from 'express';

import { getPosts } from '../controllers/posts.js';
import { createPost } from '../controllers/posts.js';
import { updatePost } from '../controllers/posts.js';
import { deletePost } from '../controllers/posts.js';
import { likePost } from '../controllers/posts.js';

import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);

export default router;