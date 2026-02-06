import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header />

      {/* Main area with sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* <SidebarMenu /> */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
