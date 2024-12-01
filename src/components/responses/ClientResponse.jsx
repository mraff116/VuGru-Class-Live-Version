import { useState } from 'react';
import PropTypes from 'prop-types';
import { Send } from 'lucide-react';

function ClientResponse({ onSubmit }) {
  const [response, setResponse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (response.trim()) {
      onSubmit(response);
      setResponse('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-[#1a1a1a] p-4 rounded-lg">
      <div className="space-y-4">
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Type your response..."
          className="w-full bg-[#333] text-white rounded-lg p-4 min-h-[100px] focus:ring-2 focus:ring-orange-500 focus:outline-none placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={!response.trim()}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5 mr-2" />
          Send Response
        </button>
      </div>
    </form>
  );
}

ClientResponse.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default ClientResponse;