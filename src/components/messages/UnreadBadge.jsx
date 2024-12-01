import PropTypes from 'prop-types';

function UnreadBadge({ count }) {
  if (!count || count <= 0) return null;
  
  return (
    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1">
      {count > 99 ? '99+' : count}
    </div>
  );
}

UnreadBadge.propTypes = {
  count: PropTypes.number
};

export default UnreadBadge;