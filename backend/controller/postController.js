import Post from "../model/postModel.js";
import User from "../model/userModel.js";

export const createPost = async (req, res) => {
  try {
    const { text, img } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text fields are required" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res.status(400).json({
        error: `Maximum length cannot exceed ${maxLength} characters`,
      });
    }

    const post = await Post.create({ postedBy: req.user._id, text, img });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in createPost");
  }
};

export const getPostByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getPostByPostId");
  }
};

export const getPostByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ postedBy: userId });

    if (!posts) return res.status(404).json({ error: "Posts not found" });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getPostByUserId");
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Unauthorized to delete post" });

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in deletePost");
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, img } = req.body;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Unauthorized to update post" });

    let update = {};

    if (text) update.text = text;
    if (img) update.img = img;

    const updatedPost = await Post.findByIdAndUpdate(postId, update, {
      new: true,
    });

    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in updatePost");
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
    } else {
      await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
    }

    return res
      .status(200)
      .json({ message: `Post ${isLiked ? "unliked" : "liked"} successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in likeUnlikePost");
  }
};

export const replyToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is mandatory" });

    const reply = { userId, text, userProfilePic, username };

    const newPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { replies: reply },
      },
      { new: true }
    );

    res.status(200).json({ message: "Reply added successfully", newPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in replyToPost");
  }
};

export const getUserFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const following = user.following;

    const feedPosts = await Post.find({ postedBy: { $in: following } })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "postedBy",
        select: "-password",
      });

    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getUserFeed");
  }
};
