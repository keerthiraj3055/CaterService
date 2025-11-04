import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const initial = {
  usersCount: 0,
  ordersCount: 0,
  revenueTotal: 0,
  bookingsCount: 0,
  revenueTrend: [],
  ordersByCategory: []
};

const useAdminSummary = (range = '30d') => {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    let intervalId;
    const fetchData = () => {
      setLoading(true);
      Promise.all([
        axiosInstance.get(`/reports/summary`),
        axiosInstance.get(`/reports/revenue-trend?range=${encodeURIComponent(range)}`),
        axiosInstance.get(`/reports/orders-by-category?range=${encodeURIComponent(range)}`)
      ])
        .then(([s, t, c]) => {
          if (!mounted) return;
          setData({
            usersCount: s.data?.usersCount ?? 0,
            ordersCount: s.data?.ordersCount ?? 0,
            revenueTotal: s.data?.revenueTotal ?? 0,
            bookingsCount: s.data?.bookingsCount ?? 0,
            revenueTrend: t.data ?? [],
            ordersByCategory: c.data ?? []
          });
        })
        .catch((e) => setError(e))
        .finally(() => mounted && setLoading(false));
    };
    fetchData();
    intervalId = setInterval(fetchData, 10000); // 10 seconds
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [range]);

  return { data, loading, error };
};

export default useAdminSummary;




