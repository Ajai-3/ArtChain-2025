
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import type { TopArt } from '../../hooks/dashboard/useDashboardStats';
import { Gem } from 'lucide-react';

interface TopArtsTableProps {
  arts: TopArt[];
}

const TopArtsTable: React.FC<TopArtsTableProps> = ({ arts }) => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="space-y-1">
            <CardTitle>Top 5 Artworks</CardTitle>
            <CardDescription>Most popular pieces by likes</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px] text-muted-foreground">#</TableHead>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {arts.map((art, index) => (
              <TableRow key={art.id}>
                <TableCell className="font-medium text-muted-foreground text-xs">{index + 1}</TableCell>
                <TableCell>
                  <img src={art.image} alt={art.title} className="h-10 w-10 rounded-md object-cover" />
                </TableCell>
                <TableCell className="font-medium">{art.title}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                           {(art as any).artist?.profileImage ? (
                               <img src={(art as any).artist.profileImage} alt={(art as any).artist.username} className="h-full w-full object-cover" />
                           ) : (
                               <span className="text-xs font-bold text-muted-foreground">{(art as any).artist?.name?.[0] || 'U'}</span>
                           )}
                        </div>
                        <span className="text-sm">{(art as any).artist?.name || 'Unknown'}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-1 font-medium text-blue-500">
                        <Gem className="h-3 w-3 fill-blue-500" />
                        {art.likes?.toLocaleString() || 0}
                    </div>
                </TableCell>
                <TableCell className="text-right font-mono text-xs">{art.price > 0 ? `${art.price} AC` : 'Free'}</TableCell>
              </TableRow>
            ))}
             {arts.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No artworks found
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopArtsTable;
