import { Request, Response } from 'express';
import { CommunityPost } from '../models/community.model';
import { logger } from '../utils/logger';

// @route   GET /api/v1/community
// @desc    Get all community posts
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await CommunityPost.find()
      .populate('author', 'name role avatar')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    logger.error('Error fetching community posts', error);
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
};

// @route   POST /api/v1/community
// @desc    Create a new post
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body;
    
    // User is attached by protect middleware
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const newPost = new CommunityPost({
      title,
      content,
      tags: tags || [],
      author: userId,
      // For demo purposes, we will treat the user as an expert if role is not just 'Farmer'
      isExpert: req.user?.role !== 'Farmer'
    });

    await newPost.save();
    
    // Populate author before returning so frontend gets the full object
    const populatedPost = await CommunityPost.findById(newPost._id).populate('author', 'name role avatar');

    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    logger.error('Error creating community post', error);
    res.status(500).json({ success: false, message: 'Failed to create post' });
  }
};

// @route   POST /api/v1/community/:id/like
// @desc    Toggle like on a post
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authorized' });

    if (!post.likedBy) post.likedBy = [];
    const isLiked = post.likedBy.some(id => id.toString() === userId.toString());
    
    if (isLiked) {
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId.toString());
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userId as any);
      post.likes += 1;
    }
    
    await post.save();
    res.status(200).json({ success: true, data: { likes: post.likes, likedBy: post.likedBy } });
  } catch (error) {
    logger.error('Error toggling like', error);
    res.status(500).json({ success: false, message: 'Failed to toggle like' });
  }
};

// @route   POST /api/v1/community/:id/comment
// @desc    Add a comment to a post
export const addComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ success: false, message: 'Content is required' });

    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authorized' });

    const newComment = {
      author: userId,
      content
    };
    
    if (!post.comments) post.comments = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post.comments.push(newComment as any);
    post.replies = (post.replies || 0) + 1;
    await post.save();
    
    const populatedPost = await CommunityPost.findById(post._id)
      .populate('comments.author', 'name role avatar');
      
    const addedComment = populatedPost?.comments[populatedPost.comments.length - 1];
    res.status(201).json({ success: true, data: addedComment, replies: post.replies });
  } catch (error) {
    logger.error('Error adding comment', error);
    res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
};
