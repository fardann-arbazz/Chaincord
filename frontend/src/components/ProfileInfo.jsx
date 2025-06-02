import { useMemo } from "react";
import toDataUrl from "ethereum-blockies-base64";

const ProfileInfo = ({ account }) => {
  const avatar = useMemo(() => {
    if (!account) return null;
    return toDataUrl(account);
  }, [account]);

  return (
    <div className="flex font-mono items-center gap-6 bg-zinc-900/60 backdrop-blur-sm p-6 rounded-xl border border-zinc-800 shadow-sm">
      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500">
        {avatar ? (
          <img src={avatar} alt="Wallet Avatar" className="w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-zinc-400">
            ?
          </div>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold text-zinc-100">
          {account
            ? account.slice(0, 6) + "..." + account.slice(-4)
            : "Anonymous"}
        </h2>
        <p className="text-sm text-zinc-400">Connected Wallet</p>
        <p className="text-sm text-zinc-500 mt-1">
          Joined: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ProfileInfo;
