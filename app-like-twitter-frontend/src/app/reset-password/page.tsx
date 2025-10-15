'use client';
import "@/app/globals.css"
import { useState } from 'react';
import FormInput from '@/components/loginregister/FormInput';
import { sendResetPasswordEmailApi } from '@/utils/api';

export default function RequestReset() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'sent'|'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await sendResetPasswordEmailApi(email);   
      setStatus('sent');
    } catch (err: any) {
      setError(err.response?.data?.email?.[0] || err.message || 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-6">
        {status === 'sent' ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              Check your inbox!
            </h2>
            <p className="text-gray-300">
              We've sent you a password reset link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-white text-center">
              Reset Password
            </h2>

            <FormInput
              type="email"
              id="email"
              name="email"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
