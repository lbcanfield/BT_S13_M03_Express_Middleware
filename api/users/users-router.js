const express = require('express');

//model imports
const USERS = require('./users-model.js');
const POSTS = require('../posts/posts-model.js');

//middleware imports
const {
     validateUserId,
     validateUser,
     validatePost
} = require('../middleware/middleware.js')

const router = express.Router();

router.get('/', async (request, response, next) => {
     try {
          response.status(200).json(await USERS.get());
     }
     catch (error) {
          next(error);
     }
});

router.get('/:id', validateUserId, (request, response) => {
     response.json(request.user);
});

router.post('/', validateUser, async (request, response, next) => {
     try {
          const newUser = await USERS.insert({ name: request.name });
          response.status(201).json(newUser);
     }
     catch (error) {
          next(error);
     }
});

router.put('/:id', validateUserId, validateUser, async (request, response, next) => {
     const { id } = request.params
     try {
          const updatedUser = await USERS.update(id, { name: request.name })
          response.status(200).json(updatedUser)
     }
     catch (error) {
          next(error);
     }
});

router.delete('/:id', validateUserId, async (request, response, next) => {
     const { id } = request.params
     try {
          await USERS.remove(id)
          response.json(request.user);
     }
     catch (error) {
          next(error)
     }
});

router.get('/:id/posts', validateUserId, async (request, response, next) => {
     const { id } = request.params;
     try {
          response.status(200).json(await USERS.getUserPosts(id));
     }
     catch (error) {
          next(error)
     }
});

router.post('/:id/posts', validateUserId, validatePost, async (request, response, next) => {
     const { id } = request.params;
     try {
          const newPost = await POSTS.insert({ user_id: id, text: request.text })
          response.status(201).json(newPost)
     }
     catch (error) {
          next(error)
     }
});

router.use((error, request, response, next) => {
     response.status(error.status || 500).json({
          ErrorMessage: error.message
     })
     console.log(error)
})

module.exports = router;
