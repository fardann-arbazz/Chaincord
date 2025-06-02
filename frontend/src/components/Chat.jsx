import { useEffect, useRef, useState } from "react";
import { FaHandSparkles } from "react-icons/fa";
import {
  LuMessageCircle,
  LuTrash2,
  LuCheck,
  LuX,
  LuLoader,
} from "react-icons/lu";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { useOutsideClick } from "../hooks/useOutsideClick";
import socket from "../service/socket";
import AlertToast from "./ui/alert";

const Chat = ({
  messages,
  currentChannel,
  account,
  onEditMessage,
  onDeleteMessage,
}) => {
  const messageEndRef = useRef();
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [activeMessageId, setActiveMessageId] = useState(null);
  const dropdownRef = useRef(null);
  const [alert, setAlert] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  useOutsideClick(dropdownRef, () => {
    setActiveMessageId(null);
  });

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredMessages = currentChannel
    ? messages.filter((msg) => msg.channel === currentChannel.id.toString())
    : [];

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  const shortenAddress = (addr) => {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });
  };

  const handleEditSubmit = (msgId, channel) => {
    if (editText.trim() !== "") {
      setEditingId(null);
      setEditText("");
    }
    setIsLoading(true);
    try {
      setEditText("");
      setEditingId(null);
      showAlert("success", "Update messages success!");

      socket.emit("update message", {
        _id: msgId,
        channel: channel,
        text: editText,
      });
    } catch (error) {
      showAlert("error", "Error update messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (messageId, channel) => {
    if (!messageId) {
      showAlert("error", "Error message not found");
      return;
    }

    setIsLoading(true);
    try {
      socket.emit("deleted message", {
        _id: messageId,
        channel: channel,
      });

      showAlert("success", "Deleted message success");
      setActiveMessageId(null);
    } catch (error) {
      showAlert("error", "Failed delete message");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {alert && (
        <div className="fixed top-6 right-6 z-50">
          <AlertToast
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-zinc-950 text-sm text-zinc-200 relative font-mono">
        {!currentChannel ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <FaHandSparkles className="w-12 h-12 text-purple-500 animate-pulse" />
            <h2 className="text-xl font-semibold text-zinc-300">
              Selamat datang di{" "}
              <span className="text-purple-400">Chaincord</span>
            </h2>
            <p className="text-zinc-500 max-w-sm">
              Pilih channel terlebih dahulu dari daftar untuk mulai mengobrol
              dengan komunitas Web3.
            </p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <LuMessageCircle className="w-12 h-12 text-purple-500 animate-pulse" />
            <h3 className="text-lg font-medium text-zinc-400">
              Belum ada pesan
            </h3>
            <p className="text-zinc-500 max-w-sm">
              Jadilah yang pertama memulai percakapan di channel{" "}
              <span className="text-purple-400">#{currentChannel.name}</span>
            </p>
          </div>
        ) : (
          filteredMessages.map((msg, i) => (
            <div key={i} className="space-y-1 group relative">
              <div className="text-zinc-500 text-xs flex items-center gap-2">
                <span className="text-purple-400">
                  {shortenAddress(msg.account)}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-500">
                  {msg.created_at ? formatDate(msg.created_at) : ""}
                </span>
                {msg.edited_at === true && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-500">(updated)</span>
                  </>
                )}
              </div>

              <div
                onClick={() =>
                  setActiveMessageId((prev) =>
                    prev === msg._id.toString() ? null : msg._id.toString()
                  )
                }
                className="bg-zinc-800 hover:bg-zinc-900 cursor-pointer rounded-lg px-4 py-2 text-zinc-100 shadow-sm w-fit max-w-xl relative group"
              >
                {String(editingId) === String(msg._id) ? (
                  <div className="space-y-2">
                    <input
                      className="bg-zinc-700 text-white text-sm px-2 py-1 rounded w-full outline-none"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEditSubmit(msg._id, msg.channel)}
                        className="flex cursor-pointer items-center gap-1 text-green-400 hover:text-green-500 text-xs"
                      >
                        {isLoading ? (
                          <LuLoader className="animate-spin h-4 w-4" />
                        ) : (
                          <>
                            <LuCheck className="w-4 h-4" />
                            Simpan
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex cursor-pointer items-center gap-1 text-red-400 hover:text-red-500 text-xs"
                      >
                        <LuX className="w-4 h-4" />
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>{msg.text}</div>

                    {activeMessageId === String(msg._id) &&
                      msg.account === account && (
                        <div
                          ref={dropdownRef}
                          className="absolute top-full mt-2 right-0 left-10 z-10 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg p-2 space-y-1 w-32 animate-fade-in transition-all"
                        >
                          <button
                            onClick={() => {
                              setEditingId(msg._id.toString());
                              setEditText(msg.text);
                              setActiveMessageId(null);
                            }}
                            className="w-full cursor-pointer text-left text-sm text-zinc-200 hover:bg-zinc-700 px-2 py-1 rounded"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(msg._id, msg.channel)}
                            className="w-full cursor-pointer text-left text-sm text-red-400 hover:bg-red-500 hover:text-white px-2 py-1 rounded"
                          >
                            {isLoading ? (
                              <LuLoader className="h-8 w-8 animate-spin" />
                            ) : (
                              "🗑️ Hapus"
                            )}
                          </button>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>
    </>
  );
};

export default Chat;
