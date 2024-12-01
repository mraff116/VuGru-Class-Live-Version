import PropTypes from 'prop-types';
import { Bell } from 'lucide-react';
import { formatLastUpdateTime } from '../../utils/dateUtils';

function ReminderButton({ lastUpdate, onSendReminder }) {
  return (
    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-yellow-300">
          <Bell className="w-5 h-5 mr-2" />
          <span>Last update: {formatLastUpdateTime(lastUpdate)}</span>
        </div>
        <button
          onClick={onSendReminder}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg text-sm font-medium transition-colors"
        >
          Send Reminder
        </button>
      </div>
    </div>
  );
}

ReminderButton.propTypes = {
  lastUpdate: PropTypes.string,
  onSendReminder: PropTypes.func.isRequired
};

export default ReminderButton;