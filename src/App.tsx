
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Suppliers } from './pages/Suppliers';
import { Dealers } from './pages/Dealers';
import { Billing } from './pages/Billing';
import { Manufacturing } from './pages/Manufacturing';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="dealers" element={<Dealers />} />
          <Route path="billing" element={<Billing />} />
          <Route path="manufacturing" element={<Manufacturing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
