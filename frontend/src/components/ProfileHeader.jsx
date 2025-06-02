import { useEffect } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { Link } from "react-router-dom";

const ProfileHeader = ({ account }) => {
  useEffect(() => {
    if (!account) {
      window.location.href = "/";
    }
  }, []);

  return (
    <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6">
      <h1 className="text-xl font-bold tracking-tight font-mono text-white">
        Your Profile
      </h1>
      <div className="flex items-end gap-6 justify-end">
        <Link to={"/"}>
          <button className="relative flex items-center gap-2 font-mono cursor-pointer hover:border-2 group px-6 py-2 rounded-full border border-zinc-700 text-white font-medium overflow-hidden transition-all duration-300 ease-in-out hover:bg-zinc-800 hover:border-purple-500">
            <LuArrowLeft className="h-4 w-4" />
            Back To Chat
            <span className="absolute inset-0 w-full h-full bg-purple-500 opacity-10 blur-md scale-105 group-hover:opacity-20 transition-all duration-300" />
          </button>
        </Link>
      </div>
    </header>
  );
};

export default ProfileHeader;
