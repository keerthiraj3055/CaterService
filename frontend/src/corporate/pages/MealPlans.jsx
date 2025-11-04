import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../api/axiosInstance';
import MealPlanFormModal from '../components/MealPlanFormModal';


const MealPlans = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchMealPlans();
  }, [activeTab]);

  const fetchMealPlans = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/corporate/meal-plans?frequency=${activeTab}`);
      setMealPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      // Mock data
      setMealPlans([
        {
          _id: '1',
          planName: 'Monday - North Indian Combo',
          frequency: 'daily',
          time: '12:30 PM',
          people: 150,
          costPerDay: 7500,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: 'active',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (planId, currentStatus) => {
    try {
      await axiosInstance.patch(`/corporate/meal-plans/${planId}/status`, {
        status: currentStatus === 'active' ? 'paused' : 'active',
      });
      fetchMealPlans();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this meal plan?')) {
      try {
        await axiosInstance.delete(`/corporate/meal-plans/${planId}`);
        fetchMealPlans();
      } catch (error) {
        console.error('Error deleting meal plan:', error);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Meal Plans</h1>
            <p className="text-gray-600">Manage your recurring catering plans</p>
          </div>
          <button
            onClick={() => {
              setSelectedPlan(null);
              setFormModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors font-medium shadow-sm"
          >
            <AddIcon />
            Create Plan
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-1 inline-flex">
        {['daily', 'weekly', 'monthly'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors capitalize ${
              activeTab === tab
                ? 'bg-[#3B82F6] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Meal Plans Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading meal plans...</div>
      ) : mealPlans.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500 mb-4">No meal plans found</p>
          <button
            onClick={() => setFormModalOpen(true)}
            className="px-6 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
          >
            Create Your First Meal Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mealPlans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-1">
                    {plan.planName}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      plan.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : plan.status === 'paused'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(plan._id, plan.status)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg"
                    title={plan.status === 'active' ? 'Pause' : 'Resume'}
                  >
                    {plan.status === 'active' ? (
                      <PauseIcon fontSize="small" />
                    ) : (
                      <PlayArrowIcon fontSize="small" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlan(plan);
                      setFormModalOpen(true);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-lg"
                    title="Edit"
                  >
                    <EditIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg"
                    title="Delete"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{plan.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">People:</span>
                  <span className="font-medium">{plan.people}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-medium">{formatCurrency(plan.costPerDay)} / day</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    {new Date(plan.startDate).toLocaleDateString()} - {' '}
                    {new Date(plan.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <MealPlanFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setSelectedPlan(null);
        }}
        onSuccess={() => {
          setFormModalOpen(false);
          setSelectedPlan(null);
          fetchMealPlans();
        }}
        plan={selectedPlan}
        frequency={activeTab}
      />
      </div>
  );
};

export default MealPlans;












