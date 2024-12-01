import { useForm } from 'react-hook-form';
import { Calendar, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import VideographerSelect from './VideographerSelect';
import { createProject } from '../services/firebase';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PropTypes from 'prop-types';

const schema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  projectDescription: z.string().min(1, 'Project description is required'),
  services: z.array(z.string()).min(1, 'Select at least one service'),
  completionDate: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, 'Date must be today or in the future'),
  videographerId: z.string().min(1, 'Please select a videographer')
});

const AVAILABLE_SERVICES = [
  { id: 'photography', label: 'Photography' },
  { id: 'videography', label: 'Videography' },
  { id: 'virtualTour', label: 'Virtual Tour' },
];

function QuoteRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      services: []
    }
  });

  const selectedServices = watch('services') || [];
  const selectedVideographer = watch('videographerId');
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const toggleService = (serviceId) => {
    const currentServices = selectedServices;
    const newServices = currentServices.includes(serviceId)
      ? currentServices.filter(id => id !== serviceId)
      : [...currentServices, serviceId];
    setValue('services', newServices);
  };

  const onSubmit = async (data) => {
    if (!user) return;

    try {
      setSubmitting(true);
      
      const newProject = {
        clientId: user.id,
        clientName: user.name,
        projectName: data.projectName,
        description: data.projectDescription,
        status: 'pending',
        date: data.completionDate,
        deliverables: data.services,
        budget: 'To be discussed',
        location: 'To be confirmed',
        clientEmail: user.email,
        videographerId: data.videographerId,
        createdAt: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        comments: []
      };

      console.log('Creating project with data:', newProject);
      await createProject(newProject);
      navigate('/');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (user?.userType === 'videographer') {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-orange-500 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-400">
          Only clients can create new quote requests.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
          Request a Quote
        </h1>
        <p className="text-gray-400 text-lg">
          Tell us about your project and we'll help you bring it to life
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 bg-[#2a2a2a]/50 p-8 rounded-2xl backdrop-blur-sm">
        <div>
          <label className="block text-orange-400 text-2xl font-semibold mb-4">
            Project Name
          </label>
          <input
            {...register('projectName')}
            className="w-full bg-[#333]/80 text-white rounded-xl p-4 text-lg focus:ring-2 focus:ring-orange-500 focus:outline-none placeholder-gray-500 border border-gray-700/50"
            placeholder="Give your project a name"
          />
          {errors.projectName && (
            <p className="mt-2 text-red-400">{errors.projectName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-orange-400 text-2xl font-semibold mb-4">
            Project Description
          </label>
          <textarea
            {...register('projectDescription')}
            className="w-full bg-[#333]/80 text-white rounded-xl p-4 h-40 text-lg focus:ring-2 focus:ring-orange-500 focus:outline-none placeholder-gray-500 border border-gray-700/50"
            placeholder="Describe your vision, requirements, and any specific details that will help us understand your project better..."
          />
          {errors.projectDescription && (
            <p className="mt-2 text-red-400">{errors.projectDescription.message}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-orange-400 text-2xl font-semibold mb-4">
            What services do you need?
          </label>
          <button
            type="button"
            onClick={() => setIsServicesOpen(!isServicesOpen)}
            className="w-full bg-[#333]/80 text-white rounded-xl p-4 text-lg border border-gray-700/50 flex justify-between items-center hover:bg-[#333]/100 transition-colors"
          >
            <span className="text-gray-300">
              {selectedServices.length === 0 
                ? 'Select services...' 
                : AVAILABLE_SERVICES
                    .filter(service => selectedServices.includes(service.id))
                    .map(service => service.label)
                    .join(', ')}
            </span>
            <ChevronDown className={`w-5 h-5 transition-transform ${isServicesOpen ? 'transform rotate-180' : ''}`} />
          </button>
          {errors.services && (
            <p className="mt-2 text-red-400">{errors.services.message}</p>
          )}
          
          {isServicesOpen && (
            <div className="absolute z-10 w-full mt-2 bg-[#333] border border-gray-700 rounded-xl shadow-xl">
              {AVAILABLE_SERVICES.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-[#444] transition-colors flex items-center justify-between ${
                    selectedServices.includes(service.id) ? 'text-orange-400' : 'text-white'
                  }`}
                >
                  {service.label}
                  {selectedServices.includes(service.id) && (
                    <div className="w-2 h-2 bg-orange-400 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-orange-400 text-2xl font-semibold mb-4">
            Choose a Videographer
          </label>
          <VideographerSelect
            onSelect={(id) => setValue('videographerId', id)}
            selectedId={selectedVideographer}
          />
          {errors.videographerId && (
            <p className="mt-2 text-red-400">{errors.videographerId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-orange-400 text-2xl font-semibold mb-4">
            When do you need this completed?
          </label>
          <div className="relative">
            <input
              type="date"
              {...register('completionDate')}
              min={today}
              className="w-full bg-[#333]/80 text-white rounded-xl p-4 text-lg focus:ring-2 focus:ring-orange-500 focus:outline-none placeholder-gray-500 border border-gray-700/50"
            />
            <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 pointer-events-none" />
          </div>
          {errors.completionDate && (
            <p className="mt-2 text-red-400">{errors.completionDate.message}</p>
          )}
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] focus:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Quote Request'}
          </button>
        </div>
      </form>
    </div>
  );
}

QuoteRequest.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    userType: PropTypes.oneOf(['client', 'videographer'])
  })
};

export default QuoteRequest;