import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import api from '../api/axios';

export default function SalesJubelioList() {
  const [isSidebarOpen] = useState(true);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [perPage, setPerPage] = useState(50);
  const [storeId, setStoreId] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [meta, setMeta] = useState({ page: 1, last_page: 1 });
  const [endpoint, setEndpoint] = useState('https://api2.jubelio.com/sales');
  const [overrideToken, setOverrideToken] = useState(() => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('external_token') || '' : '';
  });
  const [createdSince, setCreatedSince] = useState('');
  const buildEndpoint = () => {
    const date = createdSince || '2026-03-09';
    const url = `https://api2.jubelio.com/sales/?createdSince=${date}`;
    return url;
  };
  const sortLatest = (arr) => [...arr].sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
  const formatCurrency = (v) => {
    const n = Number(v || 0);
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
  };
  const formatDate = (s) => {
    if (!s) return '';
    const d = new Date(s);
    return d.toLocaleString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const loadData = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = { per_page: perPage, page, fetch_if_empty: true };
      if (storeId) params.store_id = storeId;
      if (docNumber) params.doc_number = docNumber;
      const url = buildEndpoint();
      params.endpoint = url;
      if (overrideToken) params.token = overrideToken;
      if (createdSince) params.createdSince = createdSince;
      console.log('LIST_REQUEST', { endpoint: params.endpoint, page, per_page: perPage, createdSince });
      const res = await api.get('/external-api/sales', { params });
      const data = res.data;
      console.log('LIST_RESPONSE_SUMMARY', { total: data.total ?? (data.data?.length || 0), page: data.current_page, last_page: data.last_page });
      setItems(sortLatest(data.data || []));
      setMeta({ page: data.current_page || 1, last_page: data.last_page || 1 });
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || 'Gagal memuat data';
      setError(msg);
      console.error('LIST_ERROR', { message: msg, status: e?.response?.status });
    } finally {
      setLoading(false);
    }
  };

  const syncData = async () => {
    setLoading(true);
    setError('');
    try {
      const t = overrideToken || (typeof localStorage !== 'undefined' ? localStorage.getItem('external_token') : '');
      const url = buildEndpoint();
      console.log('SYNC_REQUEST', { endpoint: url, createdSince });
      await api.post('/external-api/sales/sync', { endpoint: url, token: t, createdSince });
      await loadData(meta.page);
    } catch (e) {
      const msg = e?.response?.data?.error || e?.response?.data?.detail?.message || 'Gagal sinkronisasi';
      setError(msg);
      console.error('SYNC_ERROR', { message: msg, status: e?.response?.status });
    } finally {
      setLoading(false);
    }
  };
  const testEndpoint = async () => {
    setLoading(true);
    setError('');
    try {
      const t = overrideToken || (typeof localStorage !== 'undefined' ? localStorage.getItem('external_token') : '');
      const url = buildEndpoint();
      console.log('TEST_REQUEST', { endpoint: url, createdSince });
      const res = await api.get('/external-api/fetch', { params: { endpoint: url, token: t, createdSince } });
      const data = res.data;
      console.log('TEST_RESPONSE_SUMMARY', { ok: data?.ok, count: data?.payload?.data?.length || 0 });
      const hasData = Array.isArray(data?.payload?.data) && data.payload.data.length > 0;
      if (hasData) {
        setItems(sortLatest(data.payload.data));
        setMeta({ page: 1, last_page: 1 });
      } else {
        const msg = data?.payload?.message || data?.error || 'Endpoint tidak mengembalikan data';
        setError(msg);
      }
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || 'Gagal uji endpoint';
      setError(msg);
      console.error('TEST_ERROR', { message: msg, status: e?.response?.status });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center py-6 px-8 bg-white border-b border-gray-200 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">External Sales (Jubelio)</h1>
          <div className="flex gap-2">
            <button onClick={syncData} disabled={loading} className={`px-4 py-2 rounded-lg text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>Sync</button>
            <button onClick={() => loadData(1)} disabled={loading} className={`px-4 py-2 rounded-lg text-white ${loading ? 'bg-slate-400' : 'bg-slate-600 hover:bg-slate-700'}`}>Reload</button>
            <button onClick={testEndpoint} disabled={loading} className={`px-4 py-2 rounded-lg text-white ${loading ? 'bg-amber-400' : 'bg-amber-600 hover:bg-amber-700'}`}>Test</button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-8 py-8">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Sales Endpoint</label>
                  <input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="https://api2.jubelio.com/sales" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Override Token (Bearer)</label>
                  <input value={overrideToken} onChange={(e) => setOverrideToken(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Paste token jika perlu" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Per Page</label>
                  <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created Since</label>
                  <input type="date" value={createdSince} onChange={(e) => setCreatedSince(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Store ID</label>
                  <input value={storeId} onChange={(e) => setStoreId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="77439" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Doc Number</label>
                  <input value={docNumber} onChange={(e) => setDocNumber(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="INV-..." />
                </div>
                <div className="flex items-end">
                  <button onClick={() => loadData(1)} disabled={loading} className={`w-full px-4 py-2 rounded-lg text-white ${loading ? 'bg-slate-400' : 'bg-slate-600 hover:bg-slate-700'}`}>Filter</button>
                </div>
              </div>
              {error && <div className="mt-4 text-red-700 bg-red-100 border border-red-200 rounded-lg px-3 py-2 text-sm">{error}</div>}
            </div>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Doc Number</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Customer</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Store</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Grand Total</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Trans Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {items.map((x) => (
                    <tr key={x.doc_id}>
                      <td className="px-4 py-2 text-sm">{x.doc_number}</td>
                      <td className="px-4 py-2 text-sm">{x.customer_name}</td>
                      <td className="px-4 py-2 text-sm">{x.store_name}</td>
                      <td className="px-4 py-2 text-sm">{formatCurrency(x.grand_total)}</td>
                      <td className="px-4 py-2 text-sm">{formatDate(x.transaction_date)}</td>
                    </tr>
                  ))}
                  {items.length === 0 && !loading && (
                    <tr>
                      <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={5}>Tidak ada data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button disabled={loading || meta.page <= 1} onClick={() => loadData(meta.page - 1)} className={`px-3 py-2 rounded-lg ${meta.page <= 1 ? 'bg-gray-200 text-gray-500' : 'bg-gray-700 text-white hover:bg-gray-800'}`}>Prev</button>
              <div className="text-sm text-gray-700">Page {meta.page} / {meta.last_page}</div>
              <button disabled={loading || meta.page >= meta.last_page} onClick={() => loadData(meta.page + 1)} className={`px-3 py-2 rounded-lg ${meta.page >= meta.last_page ? 'bg-gray-200 text-gray-500' : 'bg-gray-700 text-white hover:bg-gray-800'}`}>Next</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
