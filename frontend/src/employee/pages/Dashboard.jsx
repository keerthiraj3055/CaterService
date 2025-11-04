import React, { useState, useEffect, useContext } from 'react';
import StatCard from '../components/StatCard';
import EventIcon from '@mui/icons-material/Event';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import CalendarView from '../components/CalendarView';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    assigned: 0,
    ongoing: 0,
    completed: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employee bookings
        const response = await axiosInstance.get('/employee/bookings');
        const bookings = response.data || [];
        
        setStats({
          assigned: bookings.length,
          ongoing: bookings.filter((b) => b.status === 'confirmed' || b.status === 'in-progress').length,
          completed: bookings.filter((b) => b.status === 'completed').length,
        });

        // Get upcoming events (next 5)
        const upcoming = bookings
          .filter((b) => new Date(b.eventDate) >= new Date())
          .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
          .slice(0, 5);
        setUpcomingEvents(upcoming);

        // Mock notifications
        setNotifications([
          { id: 1, message: 'New booking assigned: Wedding Event', time: '2 hours ago', type: 'info' },
          { id: 2, message: 'Event updated: Corporate Dinner', time: '5 hours ago', type: 'warning' },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set mock data for demo
        setStats({ assigned: 5, ongoing: 3, completed: 12 });
        setUpcomingEvents([]);
      }
    };

    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B] mb-2">
          {getGreeting()}, {user?.name || 'Employee'} 👋
        </h1>
        <p className="text-gray-600">Here's what's happening with your events today</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Assigned Bookings"
          value={stats.assigned}
          subtitle="Total assigned events"
          icon={<EventIcon />}
          color="blue"
        />
        <StatCard
          title="Ongoing Events"
          value={stats.ongoing}
          subtitle="Currently active"
          icon={<EventAvailableIcon />}
          color="yellow"
        />
        <StatCard
          title="Completed Events"
          value={stats.completed}
          subtitle="Successfully finished"
          icon={<CheckCircleIcon />}
          color="green"
        />
      </div>

      {/* Calendar View and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <CalendarView
            events={upcomingEvents}
            onSelectDate={() => {}}
          />
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <NotificationsIcon className="text-[#2563EB]" />
            <h2 className="text-xl font-semibold text-[#1E293B]">Notifications</h2>
          </div>
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 bg-gray-50 rounded-lg border-l-4 border-[#2563EB]"
                >
                  <p className="text-sm text-[#1E293B] mb-1">{notif.message}</p>
                  <p className="text-xs text-gray-500">{notif.time}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No new notifications</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


