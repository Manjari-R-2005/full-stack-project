import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const useQuery = () => new URLSearchParams(useLocation().search);

const VerifyOtp = () => {
  const query = useQuery();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const e = query.get('email') || '';
    setEmail(e);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const res = await verifyOtp({ email, otp });
    if (res.success) {
      setMessage('OTP verified. Redirecting to reset password...');
      setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`), 700);
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-purple-900 flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md w-full space-y-8">
        <div className="glass-effect rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-4">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-4">
              <KeyRound className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold gradient-text">Verify OTP</h2>
            <p className="text-gray-400 mt-1">Enter the 6-digit OTP sent to your email</p>
          </div>

          {message && <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm mb-3">{message}</div>}
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm mb-3">{error}</div>}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="w-full py-3 px-4 bg-dark-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 transition-all" placeholder="Enter your email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">OTP</label>
              <input value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} className="w-full py-3 px-4 tracking-widest text-center text-lg bg-dark-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 transition-all" placeholder="000000" />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} type="submit" className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 transition-all disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
