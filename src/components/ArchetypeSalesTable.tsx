import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ArchetypeSale } from '@/lib/insights';
import { useState } from 'react';

interface Props {
    data: ArchetypeSale[];
}

export default function MenuSalesTable({ data }: Props) {
    const [openRows, setOpenRows] = useState<Set<string>>(new Set());

    const toggleRow = (id: string) => {
        setOpenRows(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    // helper to render the per‑venue breakdown
    const renderDetail = (arch: ArchetypeSale) => (
        <ul className="pl-4 space-y-1 text-sm">
            {Object.entries(arch.items_sold).map(([item_id, { qty, revenueCents }]) => (
                <li key={item_id}>
                    <strong>{item_id}</strong> – Qty:{qty}, Rev:${(revenueCents / 100).toFixed(2)}
                </li>
            ))}
        </ul>
    );

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className='text-center'>Archetype</TableHead>
                    <TableHead className="text-center">Items Purchased</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {data.map(row => (
                    <>
                        {/* ------------- Data row ------------------- */}
                        <TableRow key={row.archetype_name}>
                            <TableCell
                                onClick={() => toggleRow(row.archetype_name)}
                                className="cursor-pointer hover:underline"
                            >
                                {row.archetype_name}
                            </TableCell>
                            <TableCell className="text-center">{row.qty_sold}</TableCell>
                            <TableCell className="text-right">
                                ${(row.rev_cents / 100).toFixed(2)}
                            </TableCell>
                        </TableRow>

                        {/* ------------- Detail row (conditionally rendered) --------- */}
                        {openRows.has(row.archetype_name) && (
                            <TableRow key={`${row.archetype_id}-detail`}>
                                <TableCell colSpan={4} className="bg-muted/20 p-2">
                                    {renderDetail(row)}
                                </TableCell>
                            </TableRow>
                        )}
                    </>
                ))}
            </TableBody>
        </Table>
    );
}
