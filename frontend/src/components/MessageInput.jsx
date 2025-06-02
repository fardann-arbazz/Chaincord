import React, { useState } from "react";
import socket from "../service/socket";

const MessageInput = ({ account, currentChannel }) => {
  const [message, setMessage] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();

    const messageObj = {
      channel: currentChannel.id.toString(),
      account: account,
      text: message,
    };

    if (message !== "") {
      socket.emit("new message", messageObj);
    }

    setMessage("");
  };

  return (
    <div className="h-16 border-t border-zinc-800 bg-zinc-950 px-6 flex items-center w-full">
      <form onSubmit={sendMessage} className="flex items-center w-full gap-3">
        {currentChannel && account ? (
          <input
            placeholder={`Message #${currentChannel.name}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-zinc-900 rounded-md px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          />
        ) : (
          <input
            placeholder={`Please Connect Wallet / Join The Channel`}
            disabled
            className="w-full bg-zinc-900 rounded-md px-4 py-2 text-sm text-white placeholder-zinc-500 opacity-50 cursor-not-allowed"
          />
        )}

        <button
          type="submit"
          className="px-4  cursor-pointer rounded-full font-mono py-2 text-sm font-medium border border-zinc-700 text-white bg-zinc-900 hover:bg-white hover:text-black transition duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!account || !currentChannel || message.trim() === ""}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
