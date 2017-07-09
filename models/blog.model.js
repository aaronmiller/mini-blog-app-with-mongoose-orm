'use-strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Build Blog Schema
const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    firstName: String,
    lastName: String,
  },
  content: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  }
});

blogSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    created: this.created
  };
};

const BlogPost = mongoose.model('posts', blogSchema);

module.exports = { BlogPost };
