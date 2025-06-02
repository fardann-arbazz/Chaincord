import NFTBadge from "../components/NFTBadge";
import ProfileHeader from "../components/ProfileHeader";
import ProfileInfo from "../components/ProfileInfo";

const ProfilePage = ({ account, joinedChannels }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
      <ProfileHeader account={account} />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <ProfileInfo account={account} />

        <section className="mt-12">
          <h2 className="text-2xl font-mono font-bold text-purple-400 mb-6 border-b border-zinc-800 pb-2">
            🛡️ Joined Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {joinedChannels.length > 0 ? (
              joinedChannels.map((channel, index) => (
                <NFTBadge key={index} channel={channel} />
              ))
            ) : (
              <p className="text-zinc-400 text-sm col-span-full text-center">
                You haven’t joined any channels yet.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
