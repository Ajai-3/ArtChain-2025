import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  artworks: any[];
  isLoading: boolean;
  page: number;
  setPage: (p: any) => void;
  limit: number;
}

const PurchasedArtGrid: React.FC<Props> = ({ artworks, isLoading, page, setPage, limit }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-80 rounded-[2rem] bg-zinc-900 animate-pulse" />
          ))
        ) : (
          artworks.map((item: any) => (
            <div 
              key={item.transactionId}
              className="group relative bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2"
            >
              {/* IMAGE AREA */}
              <div 
                className="h-56 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/${item.seller.username}/art/${item.art?.artName}`)}
              >
                <img 
                  src={item.art?.imageUrl} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt="" 
                />
              </div>

              {/* CONTENT AREA */}
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm text-white group-hover:text-emerald-400 transition-colors uppercase truncate w-32">
                      {item.art?.title}
                    </h4>
                    <p className="text-sm text-zinc-500 font-bold">Bought on {new Date(item.purchaseDate).toLocaleDateString()}</p>
                  </div>
                  <div className="px-2 py-1 bg-white/5 rounded-lg text-md text-emerald-500">{item.amount} AC</div>
                </div>

                <div 
                  className="flex items-center gap-2 pt-3 border-t border-white/5 cursor-pointer"
                  onClick={() => navigate(`/${item.seller?.username}`)}
                >
                  <img src={item.seller?.profileImage} className="w-12 h-12 rounded-full border border-white/10" alt="" />
                 <div className="flex flex-col items-start">
                     <span className="text-md font-bold dark:text-zinc-300 hover:text-white transition-colors">@{item.seller?.username}</span>
                  <span className="text-sm font-bold dark:text-zinc-500">({item.seller?.name})</span>
                 </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 pt-6">
        <button 
          disabled={page === 1}
          onClick={() => setPage((p: number) => p - 1)}
          className="p-4 bg-zinc-900 rounded-full border border-white/5 disabled:opacity-20 hover:bg-blue-600 transition-all active:scale-90"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-4">Page {page}</span>
        <button 
          disabled={artworks.length < limit}
          onClick={() => setPage((p: number) => p + 1)}
          className="p-4 bg-zinc-900 rounded-full border border-white/5 disabled:opacity-20 hover:bg-blue-600 transition-all active:scale-90"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

export default PurchasedArtGrid;