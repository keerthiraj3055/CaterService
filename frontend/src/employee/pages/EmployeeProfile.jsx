import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, TextField, Button, Avatar } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";

const EmployeeProfile = () => {
  const { user, login } = useContext(AuthContext);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", avatar: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setProfile({ name: user.name || "", email: user.email || "", phone: user.phone || "", avatar: user.avatar || "" });
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.patch("/employee/profile", profile);
      // update auth context if needed
      if (login) {
        const token = localStorage.getItem("token");
        login({ token, user: res.data });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Profile</Typography>
      <Box sx={{ display: "flex", gap: 3, bgcolor: "white", p: 3, borderRadius: 2 }}>
        <Box sx={{ width: 200, textAlign: "center" }}>
          <Avatar sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}>{profile.name?.charAt(0)?.toUpperCase() || "E"}</Avatar>
          {/* upload avatar control can be added here */}
        </Box>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Full name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} fullWidth />
          <TextField label="Email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} fullWidth />
          <TextField label="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} fullWidth />
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Button variant="contained" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeProfile;
