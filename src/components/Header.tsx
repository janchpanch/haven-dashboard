// src/components/HeaderBar.tsx
import { CardHeader, CardTitle } from '@/components/ui/card';
import { MenuIcon } from 'lucide-react';

export default function HeaderBar() {
    return (
        <header className="bg-white shadow p-4 flex justify-between items-center">
            {/* Logo / Title */}
            <CardHeader>
                <CardTitle>Haven Analytics</CardTitle>
            </CardHeader>

            {/* Right‑hand nav (user avatar, settings) */}
            <nav aria-label="Main navigation" className="flex space-x-3 text-gray-600">
                <MenuIcon size={20} className="cursor-pointer hover:underline" />
                {/* Add more icons or a dropdown here if needed */}
            </nav>
        </header>
    );
}
