import Conversation from "../model/conversationModel.js";
import User from "../model/userModel.js";
import Message from "../model/messageModel.js";

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
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate({
        path: "participants",
        select: "_id username profilePic",
      })
      .sort({ updatedAt: -1 });

    // in case of group i would have to delete this part and let client handle this
    const formatted = conversations.map((convo) => {
      const otherParticipant = convo.participants.filter(
        (user) => user._id.toString() !== req.user._id.toString()
      )[0];
      return {
        _id: convo._id,
        otherParticipant,
        lastMessage: convo.lastMessage,
        updatedAt: convo.updatedAt,
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error in getConversations:", error);
    return res.status(500).json({ error: error.message });
  }
};
