import ChannelList from "../components/ChannelList";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Chat from "../components/Chat";
import MessageInput from "../components/MessageInput";
import { useState } from "react";

const MainPageLayouts = ({
  account,
  setAccount,
  owner,
  chaincord,
  provider,
  channels,
  currentChannel,
  setCurrentChannel,
  messages,
}) => {
  const [isMobileChannelOpen, setIsMobileChannelOpen] = useState(false);

  return (
    <div className="flex h-screen font-sans">
      <Sidebar
        onChannelListMobileOpen={() => setIsMobileChannelOpen(true)}
        account={account}
        owner={owner}
      />
      <ChannelList
        owner={owner}
        account={account}
        chaincord={chaincord}
        channels={channels}
        currentChannel={currentChannel}
        provider={provider}
        setCurrentChannel={setCurrentChannel}
        isMobileOpen={isMobileChannelOpen}
        setIsMobileOpen={setIsMobileChannelOpen}
      />
      <div className="flex flex-col flex-1">
        <Header
          account={account}
          setAccount={setAccount}
          currentChannel={currentChannel}
        />
        <Chat
          account={account}
          currentChannel={currentChannel}
          messages={messages}
        />
        <MessageInput account={account} currentChannel={currentChannel} />
      </div>
    </div>
  );
};

export default MainPageLayouts;
