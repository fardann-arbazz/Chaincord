import { ethers } from "ethers";
import { FaWallet } from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";
import { Link } from "react-router-dom";

const Header = ({ account, setAccount, currentChannel }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const account = ethers.getAddress(accounts[0]);
    setAccount(account);
  };

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2 text-purple-400">
        <LuSparkles className="w-5 h-5 animate-pulse" />
        <span className="font-mono text-base md:text-lg tracking-wide text-zinc-100">
          {currentChannel ? `${currentChannel.name}` : "Chaincord"}
        </span>
      </div>

      {account ? (
        <Link to="/profile">
          <button className="flex cursor-pointer items-center gap-2 px-2 sm:px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-purple-500 hover:text-purple-400 transition-all duration-200 font-mono text-sm">
            <FaWallet className="w-4 h-4" />
            {account.slice(0, 4) + "..." + account.slice(-4)}
          </button>
        </Link>
      ) : (
        <button
          onClick={connectHandler}
          className="flex items-center text-xs sm:text-sm cursor-pointer gap-2 px-2 sm:px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-purple-500 hover:text-purple-400 transition-all duration-200 font-mono"
        >
          <FaWallet className="sm:w-4 w-3 h-3 sm:h-4" />
          Connect Wallet
        </button>
      )}
    </header>
  );
};

export default Header;
