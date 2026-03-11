import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SalesForm from './components/SalesForm';
import Settings from './components/Settings';
import SettingsApi from './components/SettingsApi';
import SettingsAccount from './components/SettingsAccount';
import SettingsUsers from './components/SettingsUsers';
import SettingsProducts from './components/SettingsProducts';
import SettingsChannels from './components/SettingsChannels';
import SettingsPricing from './components/SettingsPricing';
import SettingsAttributes from './components/SettingsAttributes';
import SalesJubelioList from './components/SalesJubelioList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Dashboard route di-nonaktifkan sesuai permintaan, gunakan Overview All Channel sebagai landing */}
          <Route path="/sales" element={<SalesForm />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/api" element={<SettingsApi />} />
          <Route path="/settings/account" element={<SettingsAccount />} />
          <Route path="/settings/users" element={<SettingsUsers />} />
          <Route path="/settings/products" element={<SettingsProducts />} />
          <Route path="/settings/channels" element={<SettingsChannels />} />
          <Route path="/settings/pricing" element={<SettingsPricing />} />
          <Route path="/settings/attributes" element={<SettingsAttributes />} />
          <Route path="/external-sales" element={<SalesJubelioList />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
