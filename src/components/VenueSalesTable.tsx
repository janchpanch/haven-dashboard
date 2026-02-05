import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { VenueSale } from '@/lib/insights';

interface Props {
    data: VenueSale[];
}

export default function VenueSalesTable({ data }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Quantity Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {data.map((row) => (
                    <TableRow key={row.venueId}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell className="text-right">{row.qty_items_sold}</TableCell>
                        <TableCell className="text-right">
                            ${(row.total_rev_cents / 100).toFixed(2)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}