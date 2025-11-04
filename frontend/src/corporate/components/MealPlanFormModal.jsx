import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../../api/axiosInstance';

const MealPlanFormModal = ({ open, onClose, onSuccess, plan = null, frequency = 'daily' }) => {
  const [formData, setFormData] = useState({
    planName: '',
    frequency: frequency,
    time: '',
    people: '',
    costPerDay: '',
    startDate: '',
    endDate: '',
    menu: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plan) {
      setFormData({
        planName: plan.planName || '',
        frequency: plan.frequency || frequency,
        time: plan.time || '',
        people: plan.people || '',
        costPerDay: plan.costPerDay || '',
        startDate: plan.startDate || '',
        endDate: plan.endDate || '',
        menu: plan.menu || [],
      });
    } else {
      setFormData({
        planName: '',
        frequency: frequency,
        time: '',
        people: '',
        costPerDay: '',
        startDate: '',
        endDate: '',
        menu: [],
      });
    }
  }, [plan, frequency, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (plan) {
        await axiosInstance.patch(`/corporate/meal-plans/${plan._id}`, formData);
      } else {
        await axiosInstance.post('/corporate/meal-plans', formData);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving meal plan:', error);
      alert('Failed to save meal plan');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#0F172A]">
              {plan ? 'Edit Meal Plan' : 'Create Meal Plan'}
            </h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Name
              </label>
              <input
                type="text"
                required
                value={formData.planName}
                onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                placeholder="e.g., Monday - North Indian Combo"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  required
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of People
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.people}
                  onChange={(e) => setFormData({ ...formData, people: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost per Day (₹)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.costPerDay}
                  onChange={(e) => setFormData({ ...formData, costPerDay: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Saving...' : plan ? 'Update Plan' : 'Create Plan'}
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

export default MealPlanFormModal;











