const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../Middleware/authentication');
const Post = require('../../modules/Posts');
const Profile = require('../../modules/Profile');
const User = require('../../modules/User');

//@route  Post api/posts
//@desc    create a post
//@sccess public
router.post(
  '/',
  [auth, [check('text', 'text must be required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avator: user.avator,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      //console.log(error.message);
      res.status(500).json('Server error');
    }
  }
);

//@route   Get api/post
//@desc    Get all posts
//@sccess  public

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    if (!posts) {
      return res.status(400).status({ msg: 'No posts....sry!!' });
    }
    res.json(posts);
  } catch (error) {
    res.status(500).json('Server error');
  }
});

//@route   Get api/post/:id
//@desc    Get post by id
//@sccess  public

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'No posts....sry!!' });
    }
    res.json(post);
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(500).json({ msg: 'Posts not found' });
    }
    res.status(500).json('Server error');
  }
});

//@route   delete api/post/:id
//@desc    delete post by id
//@sccess  public

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(500).json({ msg: 'No post for user id' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Not authorized' });
    }
    post.remove();
    res.json({ msg: 'post removed' });
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(500).json({ msg: 'Posts not found' });
    }
    res.status(500).json('Server error');
  }
});

//@route   Put api/post/likes/:id
//@desc   Like a post
//@sccess  private

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if user alredy likes the post
    // const val = post.likes.filter(
    //   (like) => like.user.toString() === req.user.id
    // ).length;
    // console.log(val);
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(404).json({ msg: 'Posts liked already' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    res.status(500).json('Server error');
  }
});

//@route   Put api/post/unlike/:id
//@desc    Dislike a post
//@sccess  private

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if user alredy likes the post
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(404).json({ msg: 'Posts not yet liked' });
    }
    //get removalindex
    const removeindex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeindex, 1);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    res.status(500).json('Server error');
  }
});

//@route   Post api/posts/comment/:id
//@desc    add a comment
//@sccess  public
router.post(
  '/comments/:id',
  [auth, [check('text', 'text must be required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newcomment = new Post({
        text: req.body.text,
        name: user.name,
        avator: user.avator,
        user: req.user.id,
      });
      post.comments.unshift(newcomment);
      await post.save();
      res.json(post.comments);
    } catch (error) {
      //console.log(error.message);
      res.status(500).json('Server error');
    }
  }
);

//@route   Delete api/posts/comment/:id/:comment_id
//@desc    delete a comment
//@sccess  private

router.delete('/comments/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // pull the comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(401).json({ msg: 'no comments found' });
    }
    //check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const removeindex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeindex, 1);
    await post.save();
    res.json(post.comments);
  } catch (error) {
    res.status(500).json('Server error');
  }
});

module.exports = router;
