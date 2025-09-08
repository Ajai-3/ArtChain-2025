import React from "react";

const ProfileSkeleton: React.FC = () => {
  const base = "animate-pulse";
  const bg = "bg-zinc-200 dark:bg-zinc-900";

  return (
    <div className="w-full flex flex-col h-[calc(100vh-62px)]">
      {/* Banner with avatar + info inside */}
      <div className="relative">
        {/* Banner */}
        <div
          className={`h-56 sm:h-[17rem] w-full bg-zinc-100 dark:bg-zinc-950 ${base}`}
        />

        {/* Profile image + info absolute over banner */}
        <div className="absolute left-6 bottom-14 sm:bottom-20 flex items-center gap-6 z-10">
          {/* Profile image */}
          <div
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-secondary-color ${bg} ${base}`}
          />

          {/* Info */}
          <div className="flex flex-col gap-3">
            <div className={`h-6 w-44 rounded-full ${bg} ${base}`} />
            <div className={`h-4 w-28 rounded-full ${bg} ${base}`} />

            <div className="flex gap-6 mt-1">
              <div className={`h-4 w-24 rounded-full ${bg} ${base}`} />
              <div className={`h-4 w-24 rounded-full ${bg} ${base}`} />
            </div>

            {/* <div className="flex gap-4 mt-3">
              <div className={`h-10 w-28 rounded-xl ${bg} ${base}`} />
              <div className={`h-10 w-28 rounded-xl ${bg} ${base}`} />
            </div> */}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-b px-6 flex gap-6 overflow-hidden border-zinc-200 dark:border-zinc-800">
        {["Gallery", "Favorites", "Posts", "Shop"].map((tab) => (
          <div key={tab} className="flex items-center justify-center h-12 w-20">
            <div className={`h-4 w-16 rounded-full ${bg} ${base}`} />
          </div>
        ))}
      </div>

      {/* Content area */}
      <div className="flex flex-wrap sm:flex-nowrap justify-between px-8 sm:px-10 mt-4 sm:mt-10">
        <div className={`h-52 mb-1 sm:mb-0 sm:h-64 w-96 ${bg} ${base}`} />
        <div className={`h-64 w-60 hidden sm:block ${bg} ${base}`} />
        <div className={`h-64 w-40 hidden sm:block ${bg} ${base}`} />
        <div className={`h-52 sm:h-64 w-96 ${bg} ${base}`} />
        <div className={`h-64 w-40 hidden sm:block ${bg} ${base}`} />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
