import Post from "../model/postModel.js";
import User from "../model/userModel.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const img = req.file;
    let imgUrl = null;

    if (!text) {
      return res.status(400).json({ error: "Text fields are required" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res.status(400).json({
        error: `Maximum length cannot exceed ${maxLength} characters`,
      });
    }

    if (img) {
      const uploadedImage = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: `${req.user._id}_post`,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(img.buffer);
      });

      imgUrl = uploadedImage.secure_url;
    }

    const post = await Post.create({
      postedBy: req.user._id,
      text,
      img: imgUrl,
    });

    res.status(201).json({
      message: "Post created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in createPost");
  }
};

export const getPostByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate({
      path: "postedBy",
      select: "-password",
    });

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
    const posts = await Post.find({ postedBy: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate({
        path: "postedBy",
        select: "-password",
      });

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

    let isLiked = post.likes.includes(userId);
    let likesLength = post.likes.length;

    if (isLiked) {
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      isLiked = false;
      likesLength--;
    } else {
      await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
      isLiked = true;
      likesLength++;
    }

    return res.status(200).json({
      message: `Post ${isLiked ? "unliked" : "liked"} successfully`,
      likesLength,
      isLiked,
    });
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

    const reply = {
      userId,
      text,
      userProfilePic,
      username,
    };

    const newPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          replies: {
            $each: [reply],
            $position: 0,
          },
        },
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

export const likeUnlikePostReply = async (req, res) => {
  try {
    const { postId, replyId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    const reply = post.replies.find(
      (reply) => reply._id.toString() === replyId
    );
    if (!reply) return res.status(404).json({ error: "Reply not found" });

    const isLiked = reply.likes.includes(userId);

    if (isLiked) {
      reply.likes.pull(userId);
    } else {
      reply.likes.push(userId);
    }

    await post.save();

    return res.status(200).json({
      message: `reply ${isLiked ? "unliked" : "liked"} successfully`,
      likesLength: reply.likes.length,
      liked: !isLiked,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in likeUnlikePost");
  }
};
