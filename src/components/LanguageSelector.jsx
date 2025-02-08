import PropTypes from 'prop-types';
import { LANGUAGES } from '../languages';
import { Languages } from 'lucide-react';

export default function LanguageSelector({ type, onChange, defaultLanguage }) {
    return (
        <div className="w-full">
            <label htmlFor={`${type}-language`} className="text-sm font-medium text-[#003049] mb-1 flex items-center">
                <Languages className="mr-1" size={16} color="#003049" />
                {type} Language
            </label>
            <select
                id={`${type}-language`}
                onChange={onChange}
                defaultValue={defaultLanguage}
                className="block w-full pl-3 pr-10 py-2 text-base border-2 border-[#003049] focus:outline-none focus:ring-[#c1121f] focus:border-[#c1121f] sm:text-sm rounded-md bg-[#fdf0d5]"
            >
                {Object.entries(LANGUAGES).map(([key, value]) => (
                    <option key={key} value={value}>
                        {key}
                    </option>
                ))}
            </select>
        </div>
    )
}

LanguageSelector.propTypes = {
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    defaultLanguage: PropTypes.string.isRequired
};