import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../util/helpers.js";

export const getUserProfile = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in getting users");
  }
};

export const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ error: "User already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPass,
    });
    await newUser.save();

    if (newUser) {
      generateToken(newUser.id, res);

      res.status(201).json({
        _id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        name: newUser.name,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid data" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("error in signupUser");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect)
      return res.status(400).json({ error: "Invalid credentials" });

    generateToken(user.id, res);

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in loginUser");
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "User logged out" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("error in logout User");
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    const modifiedUserId = id.toString();
    const currentUserId = req.user._id.toString();

    const modifiedUser = await User.findById(modifiedUserId);
    const currentUser = await User.findById(currentUserId);

    if (modifiedUser === currentUser)
      return res
        .status(400)
        .json({ error: "You cannot follow or unfollow yourself" });

    if (!modifiedUser || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(modifiedUserId);

    if (isFollowing) {
      await User.findByIdAndUpdate(modifiedUserId, {
        $pull: { followers: currentUserId },
      });
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: modifiedUserId },
      });
    } else {
      await User.findByIdAndUpdate(modifiedUserId, {
        $push: { followers: currentUserId },
      });
      await User.findByIdAndUpdate(currentUserId, {
        $push: { following: modifiedUserId },
      });
    }

    res.status(200).json({
      message: `User ${isFollowing ? "unfollowed" : "followed"} successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("error in follow unfollow user");
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, password, name, profilePic, bio } = req.body;

    const update = {};

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);
      update.password = hashedPass;
    }
    if (email) update.email = email;
    if (name) update.name = name;
    if (bio) update.bio = bio;
    if (profilePic) update.profilePic = profilePic;

    const user = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
    });

    res.status(200).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
