import { ReactNode } from 'react';
import DashboardLayoutClient from '../DashboardLayoutClient';

export default function MainDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
