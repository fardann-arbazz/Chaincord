import "./App.css";

import config from "../config/config.json";
import { ethers, id } from "ethers";
import Chaincord from "./abis/Chaincord.json";

import { useEffect, useState } from "react";
import socket from "./service/socket";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPageLayouts from "./layouts/MainPageLayouts";
import ProfilePage from "./pages/ProfilePages";
import AdminWithdrawPage from "./pages/AdminWidthdraw";

function App() {
  const [message, setMessage] = useState([]);
  const [account, setAccount] = useState(null);
  const [currentChannel, setCurrentChannel] = useState(null);

  const [provider, setProvider] = useState(null);
  const [chaincord, setChaincord] = useState(null);
  const [channels, setChannels] = useState([]);

  const [totalChannels, setTotalChannels] = useState(null);
  const [owner, setOwner] = useState(null);
  const [signer, setSigner] = useState(null);

  const [joinedChannel, setJoinedChannel] = useState([]);
  const [balance, setBalance] = useState(null);

  const loadBlockchainData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    const chaincord = new ethers.Contract(
      config[network.chainId].Chaincord.address,
      Chaincord,
      provider
    );

    const signer = await provider.getSigner();
    const chainCordWithSigner = chaincord.connect(signer);

    setSigner(chainCordWithSigner);

    setChaincord(chaincord);

    const owner = await chaincord.owner();
    setOwner(owner);

    const totalChannels = await chaincord.totalChannels();
    setTotalChannels(totalChannels);

    const channels = [];
    for (let i = 1; i <= totalChannels; i++) {
      const channel = await chaincord.getChannel(i);
      channels.push(channel);
    }

    setChannels(channels);

    window.ethereum.on("accountsChanged", async () => {
      window.location.reload();
    });
  };

  useEffect(() => {
    if (currentChannel) {
      socket.emit("get messages", currentChannel.id.toString());
    }
  }, [currentChannel]);

  useEffect(() => {
    loadBlockchainData();

    socket.on("new message", (messages) => {
      setMessage(messages);
    });

    socket.on("get messages", (messages) => {
      setMessage(messages);
    });

    socket.on("update message", (messages) => {
      setMessage(messages);
    });

    socket.on("deleted message", (deletedMsg) => {
      setMessage((prev) => prev.filter((msg) => msg._id !== deletedMsg._id));
    });

    return () => {
      socket.off("new message");
      socket.off("get messages");
      socket.off("update message");
      socket.off("deleted message");
    };
  }, []);

  useEffect(() => {
    if (!account || !chaincord) return;

    const fetchJoinedChannels = async () => {
      try {
        const joined = await chaincord.getJoinedChannel(account);
        setJoinedChannel(joined);
      } catch (error) {
        console.error("Error fetching joined channels:", error);
      }
    };

    fetchJoinedChannels();

    const interval = setInterval(fetchJoinedChannels, 5000);

    return () => clearInterval(interval);
  }, [account, chaincord]);

  useEffect(() => {
    if (!chaincord) return;

    const onChannelCreated = (id, name, cost) => {
      setChannels((prev) => {
        const exists = prev.some((ch) => ch.id.toString() === id.toString());
        if (exists) return prev;
        return [...prev, { id, name, cost: cost.toString() }];
      });
    };

    chaincord.on("ChannelCreated", onChannelCreated);

    return () => {
      chaincord.off("ChannelCreated", onChannelCreated);
    };
  }, [chaincord]);

  useEffect(() => {
    if (!chaincord) return;

    const updateBalance = async () => {
      try {
        const newBalance = await chaincord.getContractBalance();
        setBalance(newBalance);
      } catch (error) {
        console.error("Failed to fetch contract balance", error);
      }
    };

    updateBalance();

    const onChannelJoined = async () => {
      await updateBalance();
    };

    const onWithdraw = async () => {
      await updateBalance();
    };

    chaincord.on("ChannelJoined", onChannelJoined);
    chaincord.on("Withdraw", onWithdraw);

    return () => {
      chaincord.off("ChannelJoined", onChannelJoined);
      chaincord.off("Withdraw", onWithdraw);
    };
  }, [chaincord]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainPageLayouts
              account={account}
              setAccount={setAccount}
              owner={owner}
              chaincord={chaincord}
              provider={provider}
              channels={channels}
              currentChannel={currentChannel}
              setCurrentChannel={setCurrentChannel}
              messages={message}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProfilePage account={account} joinedChannels={joinedChannel} />
          }
        />
        <Route
          path="/widthdraw"
          element={
            <AdminWithdrawPage
              chaincord={chaincord}
              balance={balance}
              account={account}
              signer={signer}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
