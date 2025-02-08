import PropTypes from 'prop-types';

function Progress({ text, percentage }) {
    percentage = percentage ?? 0;
    return (
        <div className="w-full">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-[#003049]">{text}</span>
                <span className="text-sm font-medium text-[#003049]">{`${percentage.toFixed(2)}%`}</span>
            </div>
            <div className="w-full bg-[#fdf0d5] rounded-full h-2.5">
                <div
                    className="bg-[#c1121f] h-2.5 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}

Progress.propTypes = {
    text: PropTypes.string.isRequired,
    percentage: PropTypes.number
};

export default Progress;