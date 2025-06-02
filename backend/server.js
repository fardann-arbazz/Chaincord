require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const CyrptoJs = require("crypto-js");

const app = express();
const PORT = process.env.PORT || 3030;
const SECRET_KEY = process.env.SECRET_KEY || "CIHUY";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connect"))
  .catch((err) => console.log("MongoDB not connect", err));

const messageSchema = new mongoose.Schema({
  channel: String,
  account: String,
  text: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  edited_at: {
    type: Boolean,
    default: false,
  },
});

const Message = mongoose.model("Message", messageSchema);

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("get messages", async (channelId) => {
    try {
      socket.join(channelId);
      const messages = await Message.find({ channel: channelId });

      const decryptedMessages = messages.map((message) => {
        const bytes = CyrptoJs.AES.decrypt(message.text, SECRET_KEY);
        const originalText = bytes.toString(CyrptoJs.enc.Utf8);

        return {
          _id: message._id,
          channel: message.channel,
          account: message.account,
          text: originalText,
          created_at: message.created_at,
          edited_at: message.edited_at,
        };
      });

      socket.emit("get messages", decryptedMessages);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("new message", async (msg) => {
    try {
      const encryptedText = CyrptoJs.AES.encrypt(
        msg.text,
        SECRET_KEY
      ).toString();

      await Message.create({
        channel: msg.channel,
        account: msg.account,
        text: encryptedText,
      });

      const messages = await Message.find({ channel: msg.channel });

      const decryptedMessages = messages.map((message) => {
        const bytes = CyrptoJs.AES.decrypt(message.text, SECRET_KEY);
        const originalText = bytes.toString(CyrptoJs.enc.Utf8);

        return {
          _id: message._id,
          channel: message.channel,
          account: message.account,
          text: originalText,
          created_at: message.created_at,
          edited_at: message.edited_at,
        };
      });

      io.to(msg.channel).emit("new message", decryptedMessages);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("update message", async (msg) => {
    try {
      const encryptedText = CyrptoJs.AES.encrypt(
        msg.text,
        SECRET_KEY
      ).toString();

      await Message.updateOne(
        { _id: msg._id },
        { $set: { text: encryptedText, edited_at: true } }
      );

      const messages = await Message.find({ channel: msg.channel });

      const decryptedMessages = messages.map((message) => {
        const bytes = CyrptoJs.AES.decrypt(message.text, SECRET_KEY);
        const originalText = bytes.toString(CyrptoJs.enc.Utf8);

        return {
          _id: message._id,
          channel: message.channel,
          account: message.account,
          text: originalText,
          created_at: message.created_at,
          edited_at: message.edited_at,
        };
      });

      io.to(msg.channel).emit("new message", decryptedMessages);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("deleted message", async (msg) => {
    try {
      await Message.deleteOne({ _id: msg._id });

      io.to(msg.channel).emit("deleted message", { _id: msg._id });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconected");
  });
});
