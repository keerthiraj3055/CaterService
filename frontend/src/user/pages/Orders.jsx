import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { formatCurrency } from '../../utils/formatCurrency';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/orders/my');
        setOrders(res.data || []);
      } catch (e) {
        const local = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(local);
      }
    };
    fetchOrders();
  }, []);

  const downloadInvoice = async (id) => {
    try {
      const res = await axiosInstance.get(`/orders/${id}/invoice`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert('INFO: Invoice download is not available in offline mode.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-[#1E293B] mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o._id || o.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#1E293B]">Order #{(o._id || o.id).toString().slice(-6)}</p>
                  <p className="text-sm text-gray-600">Items: {o.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 0}</p>
                </div>
                <div className="text-right">
                  <span className="block font-bold">{formatCurrency(o.total || 0)}</span>
                  <div className="flex items-center gap-2 justify-end mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${String(o.paymentStatus).toLowerCase() === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.paymentStatus || 'pending'}</span>
                    <span className="text-xs text-gray-600">💳 {o.paymentMethod || 'Auto (Simulated)'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button onClick={() => downloadInvoice(o._id || o.id)} className="px-3 py-1.5 border rounded-lg hover:bg-gray-50">Download Invoice</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
