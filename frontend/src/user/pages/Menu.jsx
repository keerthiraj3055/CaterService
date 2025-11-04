import React, { useEffect, useMemo, useState } from 'react';
import MenuCard from '../../components/MenuCard';
import axiosInstance from '../../api/axiosInstance';

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  useEffect(() => {
    axiosInstance.get('/menu').then(res => setMenu(res.data));
  }, []);
  const categories = useMemo(() => ['All', ...Array.from(new Set(menu.map(m => m.category).filter(Boolean)))], [menu]);
  const filtered = useMemo(() => menu.filter(m => (category === 'All' || m.category === category) && (!query || (m.name || '').toLowerCase().includes(query.toLowerCase()))), [menu, category, query]);
  return (
    <div className="min-h-screen bg-white py-10">
      <h2 className="text-4xl font-bold text-center text-[#1E293B] mb-6">Menu</h2>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search dishes..." className="flex-1 min-w-[220px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(item => <MenuCard key={item._id || item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
};

export default Menu;
