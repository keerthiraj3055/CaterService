import React from 'react';

const StatCard = ({ title, value, subtitle, icon, gradient = false, color = 'blue' }) => {
  const gradientClasses = gradient
    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
    : 'bg-white text-[#0F172A]';

  const iconColor = gradient ? 'text-white' : `text-${color}-600`;

  return (
    <div
      className={`${gradientClasses} rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-6`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${gradient ? 'text-blue-100' : 'text-gray-600'} mb-1`}>
            {title}
          </p>
          <p className={`text-3xl font-bold ${gradient ? 'text-white' : 'text-[#0F172A]'} mb-1`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-xs ${gradient ? 'text-blue-100' : 'text-gray-500'}`}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${gradient ? 'bg-white/20' : `bg-${color}-100`}`}>
            <div className={iconColor}>{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;











