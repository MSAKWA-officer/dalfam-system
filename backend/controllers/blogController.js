const fs = require('fs');
const path = require('path');
const { BlogPost, User } = require('../models');

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const buildUniqueSlug = async (title, ignoreId = null) => {
  const base = slugify(title) || 'post';
  let slug = base;
  let counter = 1;

  // Keep trying until we find a slug that isn't taken by a *different* post
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const existing = await BlogPost.findOne({ where: { slug } });
    if (!existing || existing.id === ignoreId) break;
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
};

const removeFileIfExists = (imageUrl) => {
  if (!imageUrl) return;
  const filePath = path.join(__dirname, '..', imageUrl.replace(/^\//, ''));
  fs.unlink(filePath, () => {}); // ignore errors (file may already be gone)
};

// Public: only published posts (used by the public /blog page, no auth)
exports.getPublished = async (req, res) => {
  const { category } = req.query;
  const where = { status: 'published' };
  if (category) where.category = category;
  const posts = await BlogPost.findAll({
    where,
    order: [['publishedAt', 'DESC']],
    include: [{ model: User, as: 'author', attributes: ['id', 'name'] }],
  });
  res.json(posts);
};

// Public: single published post by slug (for a future "read more" detail page)
exports.getPublishedBySlug = async (req, res) => {
  const post = await BlogPost.findOne({
    where: { slug: req.params.slug, status: 'published' },
    include: [{ model: User, as: 'author', attributes: ['id', 'name'] }],
  });
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
};

// Admin/staff: all posts (draft + published) for the dashboard list
exports.getAll = async (req, res) => {
  const { status, category } = req.query;
  const where = {};
  if (status) where.status = status;
  if (category) where.category = category;
  const posts = await BlogPost.findAll({
    where,
    order: [['createdAt', 'DESC']],
    include: [{ model: User, as: 'author', attributes: ['id', 'name'] }],
  });
  res.json(posts);
};

exports.getOne = async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
};

exports.create = async (req, res) => {
  try {
    const { title, category, excerpt, content, status } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const slug = await buildUniqueSlug(title);
    const imageUrl = req.file ? `/uploads/blog/${req.file.filename}` : null;
    const finalStatus = status === 'published' ? 'published' : 'draft';

    const post = await BlogPost.create({
      title,
      slug,
      category: category || 'General',
      excerpt: excerpt || null,
      content,
      imageUrl,
      status: finalStatus,
      publishedAt: finalStatus === 'published' ? new Date() : null,
      authorId: req.user?.id || null,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create post', error: err.message });
  }
};

exports.update = async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  try {
    const { title, category, excerpt, content, status } = req.body;
    const updates = {};

    if (title && title !== post.title) {
      updates.title = title;
      updates.slug = await buildUniqueSlug(title, post.id);
    }
    if (category !== undefined) updates.category = category;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (content !== undefined) updates.content = content;

    if (status && status !== post.status) {
      updates.status = status;
      updates.publishedAt = status === 'published' ? new Date() : null;
    }

    // If a new image was uploaded, replace the old one
    if (req.file) {
      removeFileIfExists(post.imageUrl);
      updates.imageUrl = `/uploads/blog/${req.file.filename}`;
    }

    await post.update(updates);
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update post', error: err.message });
  }
};

exports.remove = async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  removeFileIfExists(post.imageUrl);
  await post.destroy();
  res.json({ message: 'Post deleted' });
};
