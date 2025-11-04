import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import axiosInstance from '../../api/axiosInstance';

const InvoiceDetailsModal = ({ open, onClose, invoice }) => {
  if (!invoice || !open) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(`/corporate/invoices/${invoice._id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoice.invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#0F172A]">Invoice Details</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <DownloadIcon />
                Download PDF
              </button>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <CloseIcon />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Invoice ID</p>
                <p className="text-lg font-semibold">{invoice.invoiceId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Date</p>
                <p className="text-lg font-semibold">
                  {new Date(invoice.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    invoice.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {invoice.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-[#0F172A]">
                  {formatCurrency(invoice.amount)}
                </p>
              </div>
            </div>

            {invoice.items && invoice.items.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Items</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Description
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                          Price
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {invoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">{item.description}</td>
                          <td className="px-4 py-3 text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                          <td className="px-4 py-3 text-right font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceDetailsModal;











