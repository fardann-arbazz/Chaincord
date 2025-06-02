import { ethers } from "ethers";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import AlertToast from "../components/ui/alert";
import { LuLoader } from "react-icons/lu";

const AdminWithdrawPage = ({ balance, account, signer, chaincord }) => {
  const [amount, setAmount] = useState("");
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const handleWithdraw = async () => {
    if (!account) {
      return;
    }

    setIsLoading(true);
    try {
      const parsedAmount = ethers.parseUnits(amount || 0, "ether");

      if (parsedAmount > balance) {
        showAlert("error", "Witdraw amounts exceeds your balance");

        setAmount("");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const chaincordWithSigner = chaincord.connect(signer);

      const transaction = await chaincordWithSigner.withdraw(parsedAmount);
      await transaction.wait();

      setAmount("");
      showAlert("success", "Withdraw successfully");
    } catch (error) {
      console.log("Error code", error);

      showAlert("error", "Withdraw error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-mono bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white px-4 py-6">
      <div className="max-w-2xl mx-auto mb-8 flex items-center justify-between">
        <Link to={"/"}>
          <button className="flex group hover:scale-105 transition ease-in-out duration-300 items-center cursor-pointer text-sm text-zinc-400 hover:text-purple-400 hover:bg-zinc-800/10 rounded px-2 py-1">
            <FaArrowLeft className="w-5 h-5 mr-1 transition-all duration-300 group-hover:mr-2" />
            Back to Dashboard
          </button>
        </Link>
      </div>

      {alert && (
        <div className="fixed top-6 right-6 z-50">
          <AlertToast
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-zinc-900/60 backdrop-blur-lg border border-zinc-800 p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <h1 className="text-2xl font-bold text-purple-400 mb-1">
          Admin Withdraw
        </h1>
        <p className="text-sm text-zinc-500 mb-6">
          Withdraw available earnings securely to the admin wallet.
        </p>

        <div className="mb-6">
          <p className="text-zinc-400 text-sm">Total Balance</p>
          <p className="text-3xl font-semibold text-green-400">
            {ethers.formatUnits(balance || 0, "ether")} ETH
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-zinc-400 mb-2">
            Amount to Withdraw
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 1.5"
            className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <p className="text-xs text-zinc-500 mt-1">
            Enter the amount you wish to withdraw (max{" "}
            {ethers.formatEther(balance || 0, "ether")} ETH)
          </p>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={isLoading}
          className="w-full py-3 cursor-pointer rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition shadow-md hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LuLoader className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            "🚀 Withdraw ETH"
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminWithdrawPage;
