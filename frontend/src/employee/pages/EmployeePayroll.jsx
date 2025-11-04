import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import axiosInstance from "../api/axiosInstance";

const EmployeePayroll = () => {
  const [payroll, setPayroll] = useState({ salary: 0, paid: 0, pending: 0, breakdown: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get("/employee/payroll");
        setPayroll(res.data || payroll);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Payroll</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: 1, maxWidth: 800 }}>
          <Typography variant="h6">Total Salary: ${payroll.salary}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>Paid: ${payroll.paid}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>Pending: ${payroll.pending}</Typography>

          {payroll.breakdown && payroll.breakdown.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 3 }}>Completed Events</Typography>
              <Box sx={{ mt: 1 }}>
                {payroll.breakdown.map((p) => (
                  <Box key={p.id} sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: "1px solid #f1f5f9" }}>
                    <Typography variant="body2">{p.eventName}</Typography>
                    <Typography variant="body2">${p.amount}</Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default EmployeePayroll;
