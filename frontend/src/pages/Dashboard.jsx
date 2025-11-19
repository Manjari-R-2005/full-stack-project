import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading: authLoading, isAuthenticated, getBookings, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'profile'
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const greetingName = useMemo(() => user?.name || user?.email?.split('@')[0] || 'User', [user]);

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (authLoading || !isAuthenticated) return;
      setLoading(true);
      const res = await getBookings();
      if (mounted) {
        if (res.success) setBookings(res.bookings || []);
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [authLoading, isAuthenticated, getBookings]);

  const onSaveProfile = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    const res = await updateProfile({ name: profile.name, email: profile.email });
    setMsg({ type: res.success ? 'success' : 'error', text: res.message });
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    if (!pwd.currentPassword || !pwd.newPassword) {
      setMsg({ type: 'error', text: 'Please fill all password fields' });
      return;
    }
    if (pwd.newPassword !== pwd.confirmPassword) {
      setMsg({ type: 'error', text: 'New password and confirm password do not match' });
      return;
    }
    const res = await changePassword({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
    setMsg({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) setPwd({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const downloadReceipt = (b) => {
    try {
      const w = window.open('', 'PRINT', 'height=700,width=800');
      if (!w) return;
      w.document.write('<html><head><title>Receipt</title></head><body style="font-family: Arial, sans-serif; padding:20px;">');
      w.document.write(`<h2 style="margin-top:0;">ConcertHub - Booking Receipt</h2>`);
      w.document.write(`<p><strong>Event:</strong> ${b.eventTitle}</p>`);
      w.document.write(`<p><strong>Date & Time:</strong> ${new Date(b.date).toLocaleDateString()} ${b.time || ''}</p>`);
      w.document.write(`<p><strong>Venue:</strong> ${b.venueName}${b.venueCity ? ', ' + b.venueCity : ''}</p>`);
      w.document.write(`<p><strong>Ticket:</strong> ${b.quantity} x ${b.ticketType}</p>`);
      w.document.write(`<p><strong>Total Paid:</strong> $${(b.totalAmount || 0).toFixed ? b.totalAmount.toFixed(2) : b.totalAmount}</p>`);
      w.document.write(`<p><strong>Buyer:</strong> ${profile.name} (${profile.email})</p>`);
      w.document.write('</body></html>');
      w.document.close();
      w.focus();
      w.print();
      w.close();
    } catch (e) {
      // no-op
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Please sign in</h1>
          <p className="text-gray-300 mb-4">You need to be logged in to view your dashboard.</p>
          <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {greetingName}!</h1>
        <p className="text-gray-300 mb-8">Manage your bookings and profile settings.</p>

        <div className="border-b border-gray-800 mb-6">
          <nav className="flex gap-4">
            <button
              className={`px-3 py-2 border-b-2 ${activeTab==='bookings' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('bookings')}
            >Bookings</button>
            <button
              className={`px-3 py-2 border-b-2 ${activeTab==='profile' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('profile')}
            >Profile Settings</button>
          </nav>
        </div>

        {msg.text && (
          <div className={`mb-6 rounded-md px-4 py-3 ${msg.type==='success' ? 'bg-green-900/30 text-green-300 border border-green-700' : 'bg-red-900/30 text-red-300 border border-red-700'}`}>
            {msg.text}
          </div>
        )}

        {activeTab === 'bookings' && (
          <section>
            {loading ? (
              <div className="text-gray-300">Loading your bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="text-gray-400">No bookings yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((b, idx) => (
                  <div key={idx} className="bg-gray-800/60 border border-gray-700 rounded-lg p-5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{b.eventTitle}</h3>
                      <p className="text-gray-300"><span className="text-gray-400">Date & Venue:</span> {b.date ? new Date(b.date).toLocaleDateString() : ''} • {b.venueName}{b.venueCity ? ', ' + b.venueCity : ''}</p>
                      <p className="text-gray-300"><span className="text-gray-400">Ticket:</span> {b.ticketType} × {b.quantity}</p>
                      <p className="text-gray-300"><span className="text-gray-400">Amount:</span> ${b.totalAmount?.toFixed ? b.totalAmount.toFixed(2) : b.totalAmount}</p>
                    </div>
                    <div className="pt-4">
                      <button onClick={() => downloadReceipt(b)} className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium">Download Receipt</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'profile' && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <form onSubmit={onSaveProfile} className="bg-gray-800/60 border border-gray-700 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold">Profile</h2>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="pt-2">
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium">Save Changes</button>
              </div>
            </form>

            <form onSubmit={onChangePassword} className="bg-gray-800/60 border border-gray-700 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold">Change Password</h2>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                <input
                  type="password"
                  value={pwd.currentPassword}
                  onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">New Password</label>
                  <input
                    type="password"
                    value={pwd.newPassword}
                    onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={pwd.confirmPassword}
                    onChange={(e) => setPwd({ ...pwd, confirmPassword: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-md font-medium">Update Password</button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
