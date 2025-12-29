
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import type { RecentTransaction } from '../../hooks/dashboard/useDashboardStats';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface RecentTransactionsTableProps {
  transactions: RecentTransaction[];
}

const RecentTransactionsTable: React.FC<RecentTransactionsTableProps> = ({ transactions }) => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="space-y-1">
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription className='text-sm'>Latest art-coin movements</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px] text-muted-foreground">#</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, index) => (
              <TableRow key={tx.id}>
                <TableCell className="font-medium text-muted-foreground text-xs">{index + 1}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted overflow-hidden">
                           {(tx as any).user?.profileImage ? (
                               <img src={(tx as any).user.profileImage} alt={(tx as any).user.name} className="h-full w-full object-cover" />
                           ) : (
                               <div className="flex h-full w-full items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-xs font-bold">
                                   {(tx as any).user?.name?.[0] || 'U'}
                               </div>
                           )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{(tx as any).user?.name || 'Unknown'}</span>
                            <span className="text-xs text-muted-foreground">@{(tx as any).user?.username || 'unknown'}</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                          {tx.type === 'Earned' ? (
                            <ArrowDownLeft className="h-3 w-3 text-green-500" />
                          ) : (
                            <ArrowUpRight className="h-3 w-3 text-red-500" />
                          )}
                          <span className="font-medium text-sm">{tx.type}</span>
                      </div>
                      <span className="text-xs text-muted-foreground truncate max-w-[120px]" title={tx.description}>{tx.description}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={tx.type === 'Earned' ? 'text-green-600 font-bold text-sm' : 'text-red-500 font-bold text-sm'}>
                     {tx.type === 'Earned' ? '+' : '-'} {tx.amount.toFixed(2)} AC
                  </span>
                </TableCell>
                <TableCell className="text-right text-muted-foreground text-xs">{new Date(tx.date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No recent transactions found
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsTable;
