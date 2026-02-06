// src/components/DataTables.tsx
import { useMemo } from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs"; // ShadCN Tabs (Radix wrapper)
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MenuSalesTable from "./MenuSalesTable";
import VenueSalesTable from "./VenueSalesTable";

import { getMenuSales, getSalesByArchetype, getVenueSales } from "@/lib/insights";
import ArchetypeSalesTable from "./ArchetypeSalesTable";

export default function DataTables() {
    // If the data is static you don’t even need useMemo,
    // but it protects against accidental re‑re‑rendering.
    const menuData = useMemo(() => Object.values(getMenuSales()), []);
    const venueData = useMemo(() => Object.values(getVenueSales()), []);
    const archetypeData = useMemo(() => Object.values(getSalesByArchetype()), [])

    return (
        <Tabs defaultValue="menu" className="w-auto">
            <TabsList className="mb-4 justify-center">
                <TabsTrigger value="menu">Menu Item</TabsTrigger>
                <TabsTrigger value="venue">Venue</TabsTrigger>
                <TabsTrigger value="archetype">Archetype</TabsTrigger>
            </TabsList>

            {/* Menu View */}
            <TabsContent value="menu" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Sales by Menu Item</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MenuSalesTable data={menuData} />
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Venue View */}
            <TabsContent value="venue" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Sales by Venue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <VenueSalesTable data={venueData} />
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Archetype View */}
            <TabsContent value="archetype" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Sales by Archetype</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ArchetypeSalesTable data={archetypeData} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
