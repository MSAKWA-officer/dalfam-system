const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlogPost = sequelize.define('BlogPost', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'General',
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  // Relative path served statically by the backend, e.g. /uploads/blog/169..-cover.jpg
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft',
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'blog_posts',
});

module.exports = BlogPost;
