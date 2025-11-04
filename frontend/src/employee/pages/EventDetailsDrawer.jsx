import React from "react";
import { Drawer, Box, Typography, Divider, Button } from "@mui/material";

const EventDetailsDrawer = ({ open, onClose, booking, onStatusUpdate }) => {
  if (!booking) return null;

  const { clientName, eventDate, eventTime, location, menu, status } = booking;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 420, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {booking.eventType || "Event"} — Details
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          {clientName}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Date & Time:</strong> {eventDate} {eventTime ? `• ${eventTime}` : ""}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Location:</strong> {location}
        </Typography>

        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Menu Details:
          </Typography>
          {!menu || menu.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No menu provided</Typography>
          ) : (
            menu.map((it, i) => (
              <Box key={i} sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                <Typography>{it.name}</Typography>
                <Typography color="text.secondary">{it.type}</Typography>
              </Box>
            ))
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Status:</strong> {status}
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          {status === "Pending" && (
            <Button variant="contained" color="warning" onClick={() => onStatusUpdate(booking._id, "In Progress")}>
              Mark In Progress
            </Button>
          )}
          {status === "In Progress" && (
            <Button variant="contained" color="success" onClick={() => onStatusUpdate(booking._id, "Completed")}>
              Mark Completed
            </Button>
          )}
          <Button variant="outlined" onClick={onClose}>Close</Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default EventDetailsDrawer;
