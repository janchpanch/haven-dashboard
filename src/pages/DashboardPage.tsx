// src/pages/Dashboard.tsx
import DashboardLayout from '@/layouts/DashboardLayout';
import DataTables from '@/components/DataTables';

export default function DashboardPage() {
  
  
  return (
    <DashboardLayout>
      {/* Main page content */}
      <DataTables />
    </DashboardLayout>
  );
}
