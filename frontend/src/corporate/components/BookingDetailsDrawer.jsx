import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ChatIcon from '@mui/icons-material/Chat';

const BookingDetailsDrawer = ({ open, onClose, booking, onRequestCustomization }) => {
  if (!booking) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusChip = (status) => {
    const statusMap = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
      completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
    };

    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-[#0F172A]">Booking Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            {getStatusChip(booking.status)}
            {booking.status !== 'completed' && booking.status !== 'cancelled' && (
              <button
                onClick={() => {
                  onRequestCustomization?.(booking);
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <ChatIcon fontSize="small" />
                Request Customization
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Booking ID</p>
              <p className="text-lg font-semibold text-[#0F172A]">
                {booking.bookingId || booking._id}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Event Type</p>
              <p className="text-lg font-semibold text-[#0F172A]">
                {booking.eventType || 'N/A'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
              <CalendarTodayIcon className="text-[#3B82F6] mt-1" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Event Date</p>
                <p className="text-lg font-semibold text-[#0F172A]">
                  {formatDate(booking.eventDate)}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
              <LocationOnIcon className="text-[#3B82F6] mt-1" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="text-lg font-semibold text-[#0F172A]">
                  {booking.location || 'Location TBD'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
              <PeopleIcon className="text-[#3B82F6] mt-1" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Employees</p>
                <p className="text-lg font-semibold text-[#0F172A]">
                  {booking.employees || 'N/A'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
              <CurrencyRupeeIcon className="text-[#3B82F6] mt-1" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                <p className="text-lg font-semibold text-[#0F172A]">
                  {formatCurrency(booking.totalCost)}
                </p>
              </div>
            </div>
          </div>

          {booking.menu && booking.menu.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3 font-medium">Menu Items</p>
              <div className="space-y-2">
                {booking.menu.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                    <span className="text-[#0F172A]">{item.name || item}</span>
                    {item.quantity && (
                      <span className="text-gray-600">x{item.quantity}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {booking.notes && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2 font-medium">Special Notes</p>
              <p className="text-[#0F172A] whitespace-pre-wrap">{booking.notes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingDetailsDrawer;











