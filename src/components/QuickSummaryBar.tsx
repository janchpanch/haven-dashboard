// src/components/ThreeCardsHorizontal.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export interface CardProps {
    /** Unique identifier for the card – useful for keying and styling */
    id: string;
    /** Human‑readable title of the menu item */
    title: string;
    /** Optional description or subtitle */
    subtitle?: string;
}

/**
 * ThreeCardsHorizontal
 *
 * Renders three identical ShadCN Card components in a horizontal row.
 * Each card receives its own `id`, `title`, optional `subtitle` and optional `imgSrc`.
 *
 * @param props.data - array of objects that contain at least `id`, `title`, and optionally `subtitle`/`imgSrc`
 */
export default function QuickSummaryBar({ data }: { data: CardProps[] }) {
    return (
        <div className="flex flex-col md:flex-row gap-6">
            {data.map((item) => (
                <Card key={item.id} className="w-full md:w-1/3 shadow-md hover:shadow-lg transition-shadow duration-200">

                    {/* Card header – title & optional subtitle */}
                    <CardHeader>
                        <CardTitle>{item.title}</CardTitle>
                        {item.subtitle && (
                            <p className="text-sm text-gray-400 mt-1">{item.subtitle}</p>
                        )}
                    </CardHeader>

                    {/* Body – price or other info */}
                    <CardContent className="p-4">
                        {/* Replace with your actual content (price, description, etc.) */}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
