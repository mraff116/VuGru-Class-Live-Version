import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

function Login() {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    try {
      setError(null);
      await login(data.email, data.password);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="max-w-md mx-auto pt-16">
      <h1 className="text-4xl font-bold mb-8 text-center text-orange-500">
        Welcome Back
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-orange-400 text-lg mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              {...register('email')}
              type="email"
              className="w-full bg-[#333] text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Enter your email"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          {errors.email && (
            <p className="mt-1 text-red-400 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-orange-400 text-lg mb-2">
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type="password"
              className="w-full bg-[#333] text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Enter your password"
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          {errors.password && (
            <p className="mt-1 text-red-400 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-orange-400 hover:text-orange-300">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;