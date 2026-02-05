// src/components/Dashboard.tsx
import { useMemo } from 'react';
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from '@/components/ui/tabs';           // ShadCN Tabs (Radix wrapper)
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import MenuSalesTable from './MenuSalesTable.tsx';
import VenueSalesTable from './VenueSalesTable.tsx';

import { menuSales, venueSales } from '@/lib/insights';

export default function Dashboard() {
    // If the data is static you don’t even need useMemo,
    // but it protects against accidental re‑re‑rendering.
    const menuData = useMemo(() => Object.values(menuSales), []);
    const venueData = useMemo(() => Object.values(venueSales), []);

    return (
        <Tabs defaultValue="menu" className="w-full">
            <TabsList className="mb-4 justify-center">
                <TabsTrigger value="menu">Menu Sales</TabsTrigger>
                <TabsTrigger value="venue">Venue Sales</TabsTrigger>
            </TabsList>

            {/* ---------- Menu sales view ------------------------------------- */}
            <TabsContent value="menu" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>All‑time Menu Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MenuSalesTable data={menuData} />
                    </CardContent>
                </Card>
            </TabsContent>

            {/* ---------- Venue sales view ------------------------------------- */}
            <TabsContent value="venue" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>All‑time Venue Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <VenueSalesTable data={venueData} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
