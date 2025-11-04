import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../../api/axiosInstance';

const BookingFormModal = ({ open, onClose, onSuccess, booking = null }) => {
  const [formData, setFormData] = useState({
    eventType: booking?.eventType || '',
    eventDate: booking?.eventDate || '',
    location: booking?.location || '',
    employees: booking?.employees || '',
    notes: booking?.notes || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (booking) {
        await axiosInstance.patch(`/corporate/bookings/${booking._id}`, formData);
      } else {
        await axiosInstance.post('/corporate/bookings', formData);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Failed to save booking');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#0F172A]">
              {booking ? 'Reschedule Booking' : 'New Booking'}
            </h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type
              </label>
              <input
                type="text"
                required
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                placeholder="e.g., Corporate Lunch, Team Meeting"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                placeholder="Venue address or room name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Employees
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.employees}
                onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                rows="3"
                placeholder="Any special requirements or instructions"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Saving...' : booking ? 'Update Booking' : 'Create Booking'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookingFormModal;

