import React, { useState } from "react";
import AlertToast from "./ui/alert";

const CreateChannel = ({ setModalIsOpen, chaincord, provider }) => {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [isLoding, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const signer = await provider.getSigner();
      const tx = await chaincord.connect(signer).createChannel(name, cost);
      await tx.wait();

      setModalIsOpen(false);
      showAlert("success", "Creating channel successfully");
    } catch (err) {
      console.error("Failed to create channel", err);
      showAlert("error", "Error creating channel");
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

      <div className="fixed inset-0 z-50 grid place-content-center bg-black/60 backdrop-blur-sm p-4">
        <div className="w-[90vw] sm:w-[500px] rounded-2xl bg-zinc-900 border border-purple-800/40 p-6 shadow-xl shadow-purple-600/20 transition-all">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white tracking-wide">
              🚀 Create Channel
            </h2>
            <button
              onClick={() => setModalIsOpen(false)}
              className="text-zinc-400 cursor-pointer hover:text-zinc-100 text-xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Channel Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 text-white px-3 py-2 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. crypto-chat"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Cost (in wei)
              </label>
              <input
                type="number"
                required
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 text-white px-3 py-2 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. 1000000000000000"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-md hover:bg-zinc-700 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoding}
                className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-md shadow-md transition disabled:opacity-50"
              >
                {isLoding ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateChannel;
