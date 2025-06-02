import { useState } from "react";
import CreateChannel from "./CreateChannel";
import { FaPlus } from "react-icons/fa";

const ChannelList = ({
  provider,
  account,
  chaincord,
  channels,
  currentChannel,
  setCurrentChannel,
  owner,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const [loadingChannelId, setLoadingChannelId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const channelHandler = async (channel) => {
    const hasJoined = await chaincord.hasJoined(channel.id, account);

    if (hasJoined) {
      setCurrentChannel(channel);
    } else {
      setLoadingChannelId(channel.id);
      try {
        const signer = await provider.getSigner();
        const transaction = await chaincord
          .connect(signer)
          .mint(channel.id, { value: channel.cost });
        await transaction.wait();

        console.log("Joined channel", channel.id);

        setCurrentChannel(channel);
      } catch (error) {
        console.error("error", error);
      } finally {
        setLoadingChannelId(null);
      }
    }
  };

  return (
    <>
      <div className="w-72 hidden sm:block bg-zinc-900 border-r border-zinc-800 p-5 font-mono text-sm">
        <h2 className="text-zinc-500 text-xs uppercase mb-4 tracking-[0.2em]">
          🔗 Web3 Channels
        </h2>

        {owner && account && owner.toLowerCase() === account.toLowerCase() && (
          <div className="mb-6">
            <button
              onClick={() => setModalIsOpen(true)}
              className="flex cursor-pointer items-center gap-2 w-full px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-100 hover:border-purple-500 hover:border-2 hover:text-purple-400 hover:shadow-md transition"
            >
              <FaPlus className="w-4 h-4" />
              Create Channel
            </button>
          </div>
        )}

        {modalIsOpen && (
          <CreateChannel
            modalIsOpen={modalIsOpen}
            setModalIsOpen={setModalIsOpen}
            chaincord={chaincord}
            provider={provider}
          />
        )}

        {!account ? (
          <div className="mt-10 text-center text-zinc-400 border border-zinc-800 rounded-xl p-6 bg-zinc-950 shadow-inner shadow-purple-900/10">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-sm text-zinc-500 mb-4">
              To explore Web3 channels and join communities, connect your
              wallet.
            </p>
            <div className="animate-pulse w-10 h-10 mx-auto mb-3">
              <svg
                className="w-full h-full text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6l4 2"
                />
              </svg>
            </div>
            <p className="text-xs text-zinc-600">
              Web3 login required to view channels
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {channels.map((channel, i) => {
              const isActive =
                currentChannel &&
                currentChannel.id.toString() === channel.id.toString();

              return (
                <li
                  key={i}
                  onClick={() => channelHandler(channel)}
                  className={`cursor-pointer px-3 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600/20 to-transparent border border-purple-500 text-purple-400"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {loadingChannelId === channel.id ? (
                    <span className="animate-pulse">Joining...</span>
                  ) : (
                    channel.name
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex sm:hidden transition-all ease-in-out">
          <div className="w-64 h-full bg-zinc-900 p-5 overflow-y-auto font-mono text-sm shadow-xl border-r border-zinc-800 relative">
            <button
              className="absolute text-xl top-4 right-4 text-zinc-500 hover:text-red-400"
              onClick={() => setIsMobileOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-zinc-500 text-xs uppercase mb-4 tracking-[0.2em]">
              🔗 Web3 Channels
            </h2>

            {/* Channel Create + Channel List sama seperti versi desktop */}
            {owner &&
              account &&
              owner.toLowerCase() === account.toLowerCase() && (
                <div className="mb-6">
                  <button
                    onClick={() => setModalIsOpen(true)}
                    className="flex items-center gap-2 w-full px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-100 hover:border-purple-500 hover:border-2 hover:text-purple-400 hover:shadow-md transition"
                  >
                    <FaPlus className="w-4 h-4" />
                    Create Channel
                  </button>
                </div>
              )}

            {/* Isi channel list sama seperti sebelumnya */}
            {!account ? (
              <div className="mt-10 text-center text-zinc-400 border border-zinc-800 rounded-xl p-6 bg-zinc-950 shadow-inner shadow-purple-900/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">
                  Connect Your Wallet
                </h3>
                <p className="text-sm text-zinc-500 mb-4">
                  To explore Web3 channels and join communities, connect your
                  wallet.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {channels.map((channel, i) => {
                  const isActive =
                    currentChannel &&
                    currentChannel.id.toString() === channel.id.toString();
                  return (
                    <li
                      key={i}
                      onClick={() => {
                        channelHandler(channel);
                        setIsMobileOpen(false); // close drawer after selection
                      }}
                      className={`cursor-pointer px-3 py-2 rounded-lg transition ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600/20 to-transparent border border-purple-500 text-purple-400"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {loadingChannelId === channel.id ? (
                        <span className="animate-pulse">Joining...</span>
                      ) : (
                        channel.name
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChannelList;
