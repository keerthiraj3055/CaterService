import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axiosInstance from "../api/axiosInstance"; // adjust path if needed
import EventDetailsDrawer from "./EventDetailsDrawer";

const AssignedBookings = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/employee/events");
      setEvents(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`/employee/events/${id}/status`, { status });
      setEvents((prev) => prev.map((e) => (e._id === id ? { ...e, status } : e)));
    } catch (err) {
      console.error("Status update failed", err);
      // optimistic UI fallback:
      setEvents((prev) => prev.map((e) => (e._id === id ? { ...e, status } : e)));
    }
  };

  const openDetails = (row) => {
    setSelected(row);
    setDrawerOpen(true);
  };

  const columns = [
    { field: "bookingId", headerName: "Booking ID", flex: 0.9 },
    { field: "eventType", headerName: "Event", flex: 1 },
    {
      field: "eventDate",
      headerName: "Date",
      flex: 1,
      valueGetter: (params) => params.row.eventDate || params.row.date,
    },
    { field: "clientName", headerName: "Client", flex: 1 },
    { field: "location", headerName: "Location", flex: 1.2 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.9,
      renderCell: (params) => {
        const s = (params.value || "pending").toLowerCase();
        const map = {
          pending: "🟡 Pending",
          "in-progress": "🟠 In Progress",
          completed: "🟢 Completed",
          cancelled: "🔴 Cancelled",
        };
        return <Typography>{map[s] || params.value}</Typography>;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.4,
      sortable: false,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button size="small" variant="outlined" onClick={() => openDetails(row)}>
              View
            </Button>
            {row.status === "Pending" && (
              <Button size="small" variant="contained" color="warning" onClick={() => updateStatus(row._id, "In Progress")}>
                Start
              </Button>
            )}
            {row.status === "In Progress" && (
              <Button size="small" variant="contained" color="success" onClick={() => updateStatus(row._id, "Completed")}>
                Complete
              </Button>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Assigned Events
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box sx={{ bgcolor: "white", borderRadius: 2, p: 2 }}>
          <DataGrid
            autoHeight
            rows={events}
            columns={columns}
            pageSize={10}
            getRowId={(r) => r._id || r.id}
            rowsPerPageOptions={[5, 10, 25]}
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-row:hover": { backgroundColor: "#f1f5f9" },
              border: "none",
            }}
          />
        </Box>
      )}

      <EventDetailsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} booking={selected} onStatusUpdate={updateStatus} />
    </Box>
  );
};

export default AssignedBookings;
