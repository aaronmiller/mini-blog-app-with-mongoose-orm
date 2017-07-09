'use-strict';

const express = require('express');
const bodyParser = require('body-parser');
const { BlogPost } = require('../models/blog.model');

const router = express.Router();
const jsonParser = bodyParser.json();

// Get full collection of blog posts.
router.get('/', (req, res) => {
  BlogPost
    .find()
    .exec()
    .then(posts => {
      res.json(posts.map(post => post.apiRepr()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Something went wrong...'
      });
    });
});

// Get specific blog post.
router.get('/:id', (req, res) => {
  BlogPost
    .findById(req.params.id)
    .exec()
    .then(post => res.json(post.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong...'});
    });
});

router.post('/', jsonParser, (req, res) => {
  const requiredParams = ['title', 'content', 'author'];

  for (let i = 0; i < requiredParams.length; i += 1) {
    const field = requiredParams[i];

    if (!(field in req.body)) {
      const message = `Missing ${field} in body.`;
      console.log(message);
      return res.status(400).send(message);
    }
  }

  BlogPost
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    })
    .then(blogPost => res.status(201).json(blogPost.apiRepr()))
    .catch(err => {
      console.error(err)
      res.json({error: 'Something went wrong...'});
    });
});

router.put('/:id', jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updatedPost = {};
  const updateableFields = ['title', 'content', 'author'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updatedPost[field] = req.body[field];
    }
  });

  BlogPost
    .findByIdAndUpdate(req.params.id, {$set: updatedPost}, {new: true})
    .exec()
    .then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

router.delete('/:id', jsonParser, (req, res) => {
  BlogPost
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      console.log(`Deleted blog post with id \`${req.params.id}\``);
      res.status(204).end();
    });
});

module.exports = router;
