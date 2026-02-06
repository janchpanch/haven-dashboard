// src/components/Footer.tsx
export default function Footer() {
    return (
        <footer className="bg-white shadow p-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Haven. All rights reserved.
        </footer>
    );
}
