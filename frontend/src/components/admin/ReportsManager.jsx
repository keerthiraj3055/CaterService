import React, { useEffect, useState } from 'react';
import { Card, Button, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import axios from 'axios';

export default function ReportsManager() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios.get('/api/admin/reports', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setReport(res.data)).finally(() => setLoading(false));
  }, []);
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Monthly Report', 10, 10);
    let y = 30;
    report.forEach((item, idx) => {
      doc.text(`${item.label}: ${item.value}`, 10, y + idx * 10);
    });
    doc.save('monthly_report.pdf');
  };
  return (
    <Box className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="font-bold">Reports & Analytics</Typography>
        <Button variant="contained" color="primary" onClick={handleExportPDF} disabled={loading}>Export PDF</Button>
      </Box>
      <Box className="bg-white rounded shadow p-4">
        <Typography variant="subtitle1" className="mb-2">Monthly Summary</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={report}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
