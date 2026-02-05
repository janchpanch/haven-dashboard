import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ItemSale } from '@/lib/insights';

interface Props {
    data: ItemSale[];
}

export default function MenuSalesTable({ data }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Qty Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {data.map((row) => (
                    <TableRow key={row.itemId}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell className="text-right">{row.totalQty}</TableCell>
                        <TableCell className="text-right">
                            ${(row.totalRevenue / 100).toFixed(2)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
