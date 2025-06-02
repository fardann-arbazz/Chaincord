import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ account, owner, onChannelListMobileOpen }) => {
  const location = useLocation();

  return (
    <aside className="w-16 bg-zinc-950 border-r border-zinc-800 flex flex-col items-center py-4 space-y-4">
      <button
        onClick={onChannelListMobileOpen}
        className="bg-zinc-900 hover:bg-zinc-800 w-12 h-12 flex items-center justify-center transition rounded-xl text-white text-lg"
      >
        🔗
      </button>

      {account && (
        <Link to={"/profile"}>
          <div
            className={` ${
              location.pathname === "/profile"
                ? "bg-zinc-800"
                : "bg-zinc-900 hover:bg-zinc-800"
            } w-12 h-12 flex items-center justify-center transition rounded-xl text-white text-lg`}
          >
            👤
          </div>
        </Link>
      )}

      {owner && account && owner.toLowerCase() === account.toLowerCase() && (
        <Link to={"/widthdraw"}>
          <div
            className={` ${
              location.pathname === "/profile"
                ? "bg-zinc-800"
                : "bg-zinc-900 hover:bg-zinc-800"
            } w-12 h-12 flex items-center justify-center transition rounded-xl text-white text-lg`}
          >
            🪙
          </div>
        </Link>
      )}
    </aside>
  );
};

export default Sidebar;
