import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axiosInstance from '../../api/axiosInstance';
import InvoiceDetailsModal from '../components/InvoiceDetailsModal';


const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { filter } : {};
      const response = await axiosInstance.get('/corporate/invoices', { params });
      setInvoices(response.data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      // Mock data
      setInvoices([
        {
          _id: '1',
          invoiceId: 'INV-2024-001',
          date: '2024-01-15',
          amount: 75000,
          status: 'paid',
        },
        {
          _id: '2',
          invoiceId: 'INV-2024-002',
          date: '2024-01-20',
          amount: 45000,
          status: 'pending',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (invoiceId) => {
    try {
      const response = await axiosInstance.get(`/corporate/invoices/${invoiceId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getStatusChip = (status) => {
    const statusMap = {
      paid: { label: 'Paid', color: 'bg-green-100 text-green-700 border-green-300' },
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      overdue: { label: 'Overdue', color: 'bg-red-100 text-red-700 border-red-300' },
    };

    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const columns = [
    {
      field: 'invoiceId',
      headerName: 'Invoice ID',
      flex: 1,
      headerClassName: 'font-semibold',
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      headerClassName: 'font-semibold',
      valueFormatter: (params) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      },
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      headerClassName: 'font-semibold',
      valueFormatter: (params) => formatCurrency(params.value || 0),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      headerClassName: 'font-semibold',
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      headerClassName: 'font-semibold',
      sortable: false,
      renderCell: (params) => {
        const invoice = params.row;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedInvoice(invoice)}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm font-medium"
            >
              <VisibilityIcon fontSize="small" />
              View
            </button>
            <button
              onClick={() => handleDownload(invoice._id || invoice.invoiceId)}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <DownloadIcon fontSize="small" />
              PDF
            </button>
          </div>
        );
      },
    },
  ];

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Invoices & Payments</h1>
            <p className="text-gray-600">Track your billing and payment history</p>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="all">All Invoices</option>
            <option value="this-month">This Month</option>
            <option value="last-3-months">Last 3 Months</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <DataGrid
            rows={invoices}
            columns={columns}
            getRowId={(row) => row._id || row.id}
            loading={loading}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f1f5f9',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8fafc',
                borderBottom: '2px solid #e2e8f0',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f8fafc',
              },
            }}
          />
        </div>

        {selectedInvoice && (
          <InvoiceDetailsModal
            open={!!selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
            invoice={selectedInvoice}
          />
        )}
      </div>
  );
};

export default Invoices;












