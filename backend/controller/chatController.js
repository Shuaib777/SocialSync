import Conversation from "../model/conversationModel.js";
import User from "../model/userModel.js";
import Message from "../model/messageModel.js";
import { io, onlineUsers } from "../socket/Socket.js";

export const createMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { recipientId, text } = req.body;

    if (!recipientId || !text) {
      return res
        .status(400)
        .json({ error: "Recipient ID and text are required" });
    }

    const recipientExists = await User.findById(recipientId);
    if (!recipientExists) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
      "participants.2": { $exists: false }, // ensures only 1to1
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recipientId],
        lastMessage: {
          text,
          sender: senderId,
          createdAt: new Date(),
        },
      });
    }

    let newMessage = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      text,
    });

    newMessage = await newMessage.populate({
      path: "sender",
      select: "_id username profilePic",
    });

    conversation.lastMessage = {
      text,
      sender: senderId,
      createdAt: newMessage.createdAt,
    };
    await conversation.save();

    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId)
      io.to(recipientSocketId).emit("newMessage", newMessage);

    return res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error in createMessage:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { recipientId } = req.params;

    if (!recipientId) {
      return res.status(400).json({ error: "Recipient ID is required" });
    }

    const recipientExists = await User.findById(recipientId);
    if (!recipientExists) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
      "participants.2": { $exists: false },
    });

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    })
      .populate({
        path: "sender",
        select: "_id username profilePic",
      })
      .sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user._id;
    let results = [];

    if (!query) {
      // Mode 1: Only previous conversations
      const conversations = await Conversation.find({
        participants: currentUserId,
      })
        .populate({
          path: "participants",
          select: "_id username profilePic",
        })
        .sort({ updatedAt: -1 });

      results = conversations.map((convo) => {
        const otherParticipant = convo.participants.find(
          (user) => user._id.toString() !== currentUserId.toString()
        );
        return {
          _id: convo._id,
          otherParticipant,
          lastMessage: convo.lastMessage,
          updatedAt: convo.updatedAt,
        };
      });
    } else {
      const regex = new RegExp("^" + query, "i");

      const matchedUsers = await User.find({
        username: { $regex: regex },
        _id: { $ne: currentUserId },
      }).select("_id username profilePic");

      const matchedUserIds = matchedUsers.map((u) => u._id);

      // only conversations between current user and matched users
      const conversations = await Conversation.find({
        participants: { $all: [currentUserId], $in: matchedUserIds },
        "participants.2": { $exists: false },
      }).populate({
        path: "participants",
        select: "_id username profilePic",
      });

      const convoMap = new Map();
      for (const c of conversations) {
        const other = c.participants.find(
          (p) => p._id.toString() !== currentUserId.toString()
        );
        if (other) {
          convoMap.set(other._id.toString(), c);
        }
      }

      // Merge matched users with conversations one
      results = matchedUsers.map((user) => {
        const convo = convoMap.get(user._id.toString());
        return convo
          ? {
              _id: convo._id,
              otherParticipant: user,
              lastMessage: convo.lastMessage,
              updatedAt: convo.updatedAt,
            }
          : {
              _id: null,
              otherParticipant: user,
              lastMessage: null,
              updatedAt: null,
            };
      });

      // Sort conversations first (by recent), then new users alphabetically
      results.sort((a, b) => {
        if (a.updatedAt && b.updatedAt) {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        }
        if (a.updatedAt) return -1;
        if (b.updatedAt) return 1;
        return a.otherParticipant.username.localeCompare(
          b.otherParticipant.username
        );
      });
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error("Error in getConversations:", error);
    return res.status(500).json({ error: error.message });
  }
};
