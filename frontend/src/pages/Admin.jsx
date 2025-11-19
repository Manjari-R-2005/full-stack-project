import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ADMIN_EMAIL = 'manjari.raveendran@gmail.com';

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input {...props} className={`w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-blue-500 focus:outline-none ${props.className||''}`} />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <textarea {...props} className={`w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-blue-500 focus:outline-none ${props.className||''}`} />
    </div>
  );
}

const Admin = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [section, setSection] = useState('overview');
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({ totalUsers: 0, totalBookings: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Create/Edit Event
  const emptyEvent = {
    title: '',
    date: '',
    time: '19:00',
    venueName: '',
    venueAddress: '',
    venueCity: '',
    venueCapacity: 5000,
    description: '',
    artist: '',
    ticketPrice: 50,
    poster: '',
    featured: false,
    status: 'upcoming',
    genre: 'Concert',
    duration: '2h'
  };
  const [form, setForm] = useState(emptyEvent);
  const [editing, setEditing] = useState(null); // event id or null
  const [showEdit, setShowEdit] = useState(false);

  const isAdmin = useMemo(() => !!user && user.email?.toLowerCase() === ADMIN_EMAIL, [user]);

  useEffect(() => {
    if (!isAdmin) return;
    // initial loads
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([loadEvents(), loadUsers(), loadAnalytics()]);
    setLoading(false);
  };

  const loadEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/events');
      setEvents(res.data || []);
    } catch (_) {}
  };
  const loadUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(res.data || []);
    } catch (_) {}
  };
  const loadAnalytics = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/analytics');
      setAnalytics(res.data || { totalUsers:0, totalBookings:0, totalRevenue:0 });
    } catch (_) {}
  };

  const resetForm = () => setForm(emptyEvent);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMsg('');
    const payload = mapFormToEvent(form);
    try {
      await axios.post('http://localhost:5000/api/admin/events', payload);
      resetForm();
      await loadEvents();
      setSection('manage-events');
      setMsg('Event created');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to create event');
    }
  };

  const openEdit = (ev) => {
    setEditing(ev._id);
    setForm(mapEventToForm(ev));
    setShowEdit(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setMsg('');
    const payload = mapFormToEvent(form);
    try {
      await axios.put(`http://localhost:5000/api/admin/events/${editing}`, payload);
      setShowEdit(false);
      setEditing(null);
      await loadEvents();
      setMsg('Event updated');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to update event');
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/events/${id}`);
      await loadEvents();
      setMsg('Event deleted');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const toggleUserActive = async (u) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/users/${u._id}/status`, { isActive: !u.isActive });
      await loadUsers();
    } catch (_) {}
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const viewBookings = async (u) => {
    setSelectedUser(u);
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/users/${u._id}/bookings`);
      setUserBookings(res.data?.bookings || []);
    } catch (_) { setUserBookings([]); }
  };

  const [broadcast, setBroadcast] = useState({ subject: 'New concert added!', message: '' });
  const sendBroadcast = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/notify', broadcast);
      setMsg(`Announcement sent to ${res.data.recipients || 0} users`);
      setBroadcast({ subject: 'New concert added!', message: '' });
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to send announcement');
    }
  };

  const activeUsers = users.filter(u => u.isActive !== false).length;
  const deactivatedUsers = users.length - activeUsers;

  if (authLoading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-300">This page is restricted to the admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-5 gap-6">
        <aside className="md:col-span-1 bg-gray-800/60 border border-gray-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Admin</h2>
          <nav className="space-y-1">
            {[
              {key:'overview', label:'Dashboard Overview'},
              {key:'manage-events', label:'Manage Events'},
              {key:'manage-users', label:'Manage Users'},
              {key:'analytics', label:'Reports / Analytics'},
              {key:'notifications', label:'Notifications'},
              {key:'settings', label:'Settings'},
            ].map(item => (
              <button key={item.key} onClick={()=>setSection(item.key)} className={`w-full text-left px-3 py-2 rounded-md ${section===item.key?'bg-blue-600 text-white':'text-gray-300 hover:bg-gray-700'}`}>{item.label}</button>
            ))}
          </nav>
        </aside>

        <main className="md:col-span-4 space-y-6">
          {msg && (
            <div className="bg-blue-900/30 border border-blue-700 text-blue-200 px-4 py-3 rounded-md">{msg}</div>
          )}

          {section === 'overview' && (
            <section>
              <h1 className="text-2xl font-bold mb-4">Overview</h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                  <div className="text-gray-400">Total Users</div>
                  <div className="text-3xl font-semibold">{analytics.totalUsers}</div>
                </div>
                <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                  <div className="text-gray-400">Total Bookings</div>
                  <div className="text-3xl font-semibold">{analytics.totalBookings}</div>
                </div>
                <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                  <div className="text-gray-400">Total Revenue</div>
                  <div className="text-3xl font-semibold">${analytics.totalRevenue?.toFixed ? analytics.totalRevenue.toFixed(2) : analytics.totalRevenue}</div>
                </div>
              </div>
            </section>
          )}

          {section === 'manage-events' && (
            <section className="space-y-6">
              <h1 className="text-2xl font-bold">Manage Events</h1>

              <form onSubmit={handleCreate} className="bg-gray-800/60 border border-gray-700 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
                <Input type="date" label="Date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
                <Input label="Time" value={form.time} onChange={e=>setForm({...form, time:e.target.value})} />
                <Input label="Venue Name" value={form.venueName} onChange={e=>setForm({...form, venueName:e.target.value})} />
                <Input label="Venue Address" value={form.venueAddress} onChange={e=>setForm({...form, venueAddress:e.target.value})} />
                <Input label="Venue City" value={form.venueCity} onChange={e=>setForm({...form, venueCity:e.target.value})} />
                <Input type="number" label="Venue Capacity" value={form.venueCapacity} onChange={e=>setForm({...form, venueCapacity:Number(e.target.value)})} />
                <Input label="Artist Name" value={form.artist} onChange={e=>setForm({...form, artist:e.target.value})} />
                <Input type="number" label="Ticket Price ($)" value={form.ticketPrice} onChange={e=>setForm({...form, ticketPrice:Number(e.target.value)})} />
                <Input label="Image URL" value={form.poster} onChange={e=>setForm({...form, poster:e.target.value})} />
                <Textarea className="md:col-span-2" rows={3} label="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
                <div className="md:col-span-2">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md">Create Event</button>
                </div>
              </form>

              <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="text-gray-400">
                    <tr>
                      <th className="px-3 py-2">Title</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Venue</th>
                      <th className="px-3 py-2">Price</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(ev => (
                      <tr key={ev._id} className="border-t border-gray-700">
                        <td className="px-3 py-2">{ev.title}</td>
                        <td className="px-3 py-2">{ev.date ? new Date(ev.date).toLocaleDateString() : ''}</td>
                        <td className="px-3 py-2">{ev.venue?.name}</td>
                        <td className="px-3 py-2">${ev.ticketTypes?.[0]?.price ?? '-'}</td>
                        <td className="px-3 py-2 space-x-2">
                          <button onClick={()=>openEdit(ev)} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md">Edit</button>
                          <button onClick={()=>deleteEvent(ev._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showEdit && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-2xl">
                    <h3 className="text-xl font-semibold mb-4">Edit Event</h3>
                    <form onSubmit={saveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
                      <Input type="date" label="Date" value={form.date?.slice(0,10) || ''} onChange={e=>setForm({...form, date:e.target.value})} />
                      <Input label="Time" value={form.time} onChange={e=>setForm({...form, time:e.target.value})} />
                      <Input label="Venue Name" value={form.venueName} onChange={e=>setForm({...form, venueName:e.target.value})} />
                      <Input label="Venue Address" value={form.venueAddress} onChange={e=>setForm({...form, venueAddress:e.target.value})} />
                      <Input label="Venue City" value={form.venueCity} onChange={e=>setForm({...form, venueCity:e.target.value})} />
                      <Input type="number" label="Venue Capacity" value={form.venueCapacity} onChange={e=>setForm({...form, venueCapacity:Number(e.target.value)})} />
                      <Input label="Artist Name" value={form.artist} onChange={e=>setForm({...form, artist:e.target.value})} />
                      <Input type="number" label="Ticket Price ($)" value={form.ticketPrice} onChange={e=>setForm({...form, ticketPrice:Number(e.target.value)})} />
                      <Input label="Image URL" value={form.poster} onChange={e=>setForm({...form, poster:e.target.value})} />
                      <Textarea className="md:col-span-2" rows={3} label="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
                      <div className="md:col-span-2 flex gap-2 pt-2">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md">Save</button>
                        <button type="button" onClick={()=>setShowEdit(false)} className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-md">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          )}

          {section === 'manage-users' && (
            <section className="space-y-4">
              <h1 className="text-2xl font-bold">Manage Users</h1>
              <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="text-gray-400">
                    <tr>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Role</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-t border-gray-700">
                        <td className="px-3 py-2">{u.name}</td>
                        <td className="px-3 py-2">{u.email}</td>
                        <td className="px-3 py-2">{u.role}</td>
                        <td className="px-3 py-2">{u.isActive === false ? 'Deactivated' : 'Active'}</td>
                        <td className="px-3 py-2 space-x-2">
                          <button onClick={()=>viewBookings(u)} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md">View Bookings</button>
                          <button onClick={()=>toggleUserActive(u)} className={`${u.isActive===false?'bg-green-600 hover:bg-green-700':'bg-yellow-600 hover:bg-yellow-700'} text-white px-3 py-1 rounded-md`}>{u.isActive===false?'Activate':'Deactivate'}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedUser && (
                <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Bookings for {selectedUser.email}</h3>
                  {userBookings.length === 0 ? (
                    <div className="text-gray-400">No bookings.</div>
                  ) : (
                    <ul className="divide-y divide-gray-800">
                      {userBookings.map((b, idx) => (
                        <li key={idx} className="py-2 flex items-center justify-between">
                          <div>
                            <div className="font-medium">{b.eventTitle}</div>
                            <div className="text-gray-400 text-sm">{b.date? new Date(b.date).toLocaleDateString():''} • {b.venueName}{b.venueCity?`, ${b.venueCity}`:''}</div>
                          </div>
                          <div className="text-gray-300">{b.quantity} × {b.ticketType} • ${b.totalAmount}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </section>
          )}

          {section === 'analytics' && (
            <section className="space-y-4">
              <h1 className="text-2xl font-bold">Analytics</h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                  <div className="text-gray-400">Total Users</div>
                  <div className="text-3xl font-semibold">{analytics.totalUsers}</div>
                </div>
                <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                  <div className="text-gray-400">Total Bookings</div>
                  <div className="text-3xl font-semibold">{analytics.totalBookings}</div>
                </div>
                <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                  <div className="text-gray-400">Total Revenue</div>
                  <div className="text-3xl font-semibold">${analytics.totalRevenue?.toFixed ? analytics.totalRevenue.toFixed(2) : analytics.totalRevenue}</div>
                </div>
              </div>
              <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                <Bar height={120}
                  data={{
                    labels: ['Active Users', 'Deactivated Users', 'Bookings'],
                    datasets: [
                      {
                        label: 'Counts',
                        data: [activeUsers, deactivatedUsers, analytics.totalBookings],
                        backgroundColor: ['#22c55e','#f59e0b','#3b82f6'],
                      },
                    ],
                  }}
                  options={{
                    responsive:true,
                    plugins:{ legend:{display:false}, title:{display:false, text:'Overview'} },
                    scales:{
                      x:{ ticks:{ color:'#9ca3af' }, grid:{ color:'#111827' } },
                      y:{ ticks:{ color:'#9ca3af' }, grid:{ color:'#111827' } },
                    }
                  }}
                />
              </div>
            </section>
          )}

          {section === 'notifications' && (
            <section className="space-y-4">
              <h1 className="text-2xl font-bold">Notifications / Broadcast</h1>
              <form onSubmit={sendBroadcast} className="bg-gray-800/60 border border-gray-700 rounded-lg p-6 space-y-4">
                <Input label="Subject" value={broadcast.subject} onChange={e=>setBroadcast({...broadcast, subject:e.target.value})} />
                <Textarea rows={4} label="Message" value={broadcast.message} onChange={e=>setBroadcast({...broadcast, message:e.target.value})} />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md">Send Announcement</button>
              </form>
            </section>
          )}

          {section === 'settings' && (
            <section className="space-y-4">
              <h1 className="text-2xl font-bold">Settings</h1>
              <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-6 text-gray-300">
                Basic admin settings can be configured here.
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

function mapFormToEvent(f) {
  // Map minimal form to Event schema
  return {
    title: f.title,
    description: f.description || '—',
    artist: f.artist || '—',
    lineup: [],
    date: f.date ? new Date(f.date) : new Date(),
    time: f.time || '19:00',
    venue: {
      name: f.venueName || 'Venue',
      address: f.venueAddress || '',
      city: f.venueCity || '',
      capacity: Number(f.venueCapacity || 0)
    },
    poster: f.poster || 'https://via.placeholder.com/600x800?text=Event+Poster',
    ticketTypes: [
      { type: 'Regular', price: Number(f.ticketPrice || 0), totalTickets: 1000, soldTickets: 0 }
    ],
    featured: !!f.featured,
    status: f.status || 'upcoming',
    genre: f.genre || 'Concert',
    duration: f.duration || '2h'
  };
}

function mapEventToForm(ev) {
  return {
    title: ev.title || '',
    date: ev.date ? new Date(ev.date).toISOString().slice(0,10) : '',
    time: ev.time || '19:00',
    venueName: ev.venue?.name || '',
    venueAddress: ev.venue?.address || '',
    venueCity: ev.venue?.city || '',
    venueCapacity: ev.venue?.capacity || 0,
    description: ev.description || '',
    artist: ev.artist || '',
    ticketPrice: ev.ticketTypes?.[0]?.price || 0,
    poster: ev.poster || '',
    featured: !!ev.featured,
    status: ev.status || 'upcoming',
    genre: ev.genre || 'Concert',
    duration: ev.duration || '2h'
  };
}

export default Admin;
