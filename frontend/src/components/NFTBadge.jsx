import { ethers } from "ethers";

const NFTBadge = ({ channel }) => {
  return (
    <div className="group cursor-pointer bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl p-4 hover:border-2 hover:border-purple-500 hover:shadow-purple-500/20 transition duration-300 ease-in-out">
      <h3 className="text-lg font-mono font-medium text-zinc-100 group-hover:text-purple-400 transition">
        #{channel.name}
      </h3>
      <p className="text-sm font-mono text-zinc-400 mt-1">
        Cost:{" "}
        <span className="text-purple-400">
          {ethers.formatUnits(channel.cost.toString(), "ether")} ETH
        </span>
      </p>
    </div>
  );
};

export default NFTBadge;
