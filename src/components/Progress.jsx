import PropTypes from 'prop-types';

function Progress({ text, percentage }) {
    percentage = percentage ?? 0;
    return (
        <div className="progress-container">
            <div className='progress-bar' style={{ 'width': `${percentage}%` }}>
                {text} ({`${percentage.toFixed(2)}%`})
            </div>
        </div>
    );
}

Progress.propTypes = {
    text: PropTypes.string.isRequired,
    percentage: PropTypes.number
};

export default Progress;