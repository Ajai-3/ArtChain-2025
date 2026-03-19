import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import type { RootState } from '../../../../../redux/store';
import { useSelector } from 'react-redux';

interface TableProps {
    sales: any[];
    isTableLoading: boolean;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    limit: number;
}

const SalesHistoryTable: React.FC<TableProps> = ({ sales, isTableLoading, page, setPage, limit }) => {
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.user.user);

    return (
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
            <Table className="min-w-full">
                <TableHeader>
                    <TableRow className="bg-white/5 border-white/5 hover:bg-white/5">
                        <TableHead className="p-4 text-zinc-500 ">Artwork</TableHead>
                        <TableHead className="p-4 text-zinc-500">Buyer</TableHead>
                        <TableHead className="p-4 text-zinc-500 ">Date</TableHead>
                        <TableHead className="p-4 text-right text-zinc-500 ">Revenue</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isTableLoading ? (
                        [...Array(5)].map((_, i) => (
                            <TableRow key={i} className="animate-pulse border-white/5">
                                <TableCell colSpan={4} className="h-20 bg-white/[0.01]" />
                            </TableRow>
                        ))
                    ) : sales.length > 0 ? (
                        sales.map((sale: any) => (
                            <TableRow key={sale.transactionId} className="group border-white/5 hover:bg-white/[0.03] transition-all">
                                <TableCell className="p-5">
                                    <div 
                                        className="flex items-center gap-4 cursor-pointer" 
                                        onClick={() => navigate(`/${currentUser?.username}/art/${sale.art?.artName}`)}
                                    >
                                        <div className="relative w-14 h-14 rounded-sm overflow-hidden border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                                            <img src={sale.art?.imageUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black group-hover:text-emerald-400 transition-colors">{sale.art?.title}</p>
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase">{sale.art?.artName}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="p-5">
                                    <div 
                                        className="flex items-center gap-2 cursor-pointer group/buyer"
                                        onClick={() => navigate(`/${sale.buyer?.username}`)}
                                    >
                                        <img src={sale.buyer?.profileImage || '/default-avatar.png'} alt="" className="w-10 h-10 rounded-full border border-white/10" />
                                        <div className="flex flex-col">
                                            <span className="text-md text-zinc-300 group-hover/buyer:text-emerald-400 transition-colors">@{sale.buyer?.username}</span>
                                            <span className="text-[10px] text-zinc-500 font-bold uppercase">({sale.buyer?.name})</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="p-5 text-md text-zinc-600 uppercase">
                                    <div className="flex flex-col">
                                        <span className="text-zinc-400">
                                            {new Date(sale.purchaseDate).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <span className="text-md text-emerald-500/90 mt-0.5">
                                            {new Date(sale.purchaseDate).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="p-5 text-right">
                                    <span className="text-xl font-bold text-emerald-500">+{sale.amount}</span>
                                    <span className="text-sm ml-1 text-emerald-900 font-bold uppercase">AC</span>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-40 text-center text-zinc-500">No sales records found</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="p-4 border-t border-white/5 flex justify-between items-center bg-zinc-500/10 dark:bg-zinc-900">
                <button
                    disabled={page === 1 || isTableLoading}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-emerald-600 disabled:opacity-10 rounded-2xl font-black transition-all border border-white/5 active:scale-95"
                >
                    Previous
                </button>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest underline underline-offset-8">Page {page}</span>
                </div>
                <button
                    disabled={sales.length < limit || isTableLoading}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-emerald-600 disabled:opacity-10 rounded-2xl font-black transition-all border border-white/5 active:scale-95"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default SalesHistoryTable;