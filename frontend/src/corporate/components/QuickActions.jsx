import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'New Booking',
      icon: <AddIcon />,
      color: 'bg-[#3B82F6] hover:bg-[#2563EB]',
      onClick: () => navigate('/corporate/bookings?action=new'),
    },
    {
      label: 'Create Meal Plan',
      icon: <RestaurantMenuIcon />,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => navigate('/corporate/meal-plans?action=new'),
    },
    {
      label: 'Contact Admin',
      icon: <ChatIcon />,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => navigate('/corporate/chat'),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`w-full ${action.color} text-white px-4 py-3 rounded-lg flex items-center gap-3 font-medium transition-all duration-200 shadow-sm hover:shadow-md`}
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;











