// Import necessary hooks and components
import { useForm } from 'react-hook-form'; // Provides form handling features like validation
import { Link } from 'react-router-dom'; // Enables navigation between routes
import { Mail, Lock } from 'lucide-react'; // Icons for email and password fields
import { useAuth } from '../../context/AuthContext'; // Custom hook for authentication context
import { useState } from 'react'; // React hook to manage state
import { zodResolver } from '@hookform/resolvers/zod'; // Zod resolver for schema validation in forms
import { z } from 'zod'; // Library for defining and validating schemas

// Define a schema for form validation
const schema = z.object({
  email: z.string().email('Invalid email address'), // Validates email format
  password: z.string().min(6, 'Password must be at least 6 characters') // Ensures password has a minimum length of 6
});

function Login() {
  // Extract the `login` function from the authentication context
  const { login } = useAuth();

  // Set up form handling with react-hook-form and schema validation
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema) // Use Zod schema for validation
  });

  // State to manage login error messages
  const [error, setError] = useState(null);

  // Function to handle form submission
  const onSubmit = async (data) => {
    try {
      setError(null); // Clear any existing errors
      await login(data.email, data.password); // Call the login function with email and password
    } catch (err) {
      setError('Invalid email or password'); // Display error message on failure
    }
  };

  return (
    // Wrapper div for the login form with responsive max-width and top padding
    <div className="max-w-md mx-auto pt-16">
      {/* Heading with bold styling and an orange color */}
      <h1 className="text-4xl font-bold mb-8 text-center text-orange-500">
        Welcome Back
      </h1>

      {/* Error message displayed if there’s a login error */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center">
          {error}
        </div>
      )}

      {/* Login form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email input field */}
        <div>
          <label className="block text-orange-400 text-lg mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              {...register('email')} // Register input for react-hook-form
              type="email"
              className="w-full bg-[#333] text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Enter your email" // Placeholder text
            />
            {/* Email icon positioned inside the input */}
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          {/* Error message for email validation */}
          {errors.email && (
            <p className="mt-1 text-red-400 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password input field */}
        <div>
          <label className="block text-orange-400 text-lg mb-2">
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')} // Register input for react-hook-form
              type="password"
              className="w-full bg-[#333] text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Enter your password" // Placeholder text
            />
            {/* Password icon positioned inside the input */}
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          {/* Error message for password validation */}
          {errors.password && (
            <p className="mt-1 text-red-400 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting} // Disable button while submitting
          className="w-full bg-blue-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'} {/* Show loading state */}
        </button>

        {/* Link to sign-up page */}
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

export default Login; // Export the Login component for use in other parts of the app
