import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header />
      <Outlet />
    </div>
  );
};
