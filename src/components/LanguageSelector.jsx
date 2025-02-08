import { useState, useRef, useEffect } from "react"
import PropTypes from "prop-types"
import { LANGUAGES } from "../languages"
import { Languages, ChevronDown, ChevronUp } from "lucide-react"

export default function LanguageSelector({ type, onChange, defaultLanguage }) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedLanguage, setSelectedLanguage] = useState(() => {
        const found = Object.entries(LANGUAGES).find(([, value]) => value === defaultLanguage)
        return found ? found[0] : Object.keys(LANGUAGES)[0] // Fallback to first language if not found
    })
    const wrapperRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const filteredLanguages = Object.entries(LANGUAGES).filter(([key]) =>
        key.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleSelect = (key, value) => {
        setSelectedLanguage(key)
        onChange({ target: { value } })
        setIsOpen(false)
    }

    return (
        <div className="w-full" ref={wrapperRef}>
            <label htmlFor={`${type}-language`} className="text-sm font-medium text-[#003049] mb-1 flex items-center">
                <Languages className="mr-1" size={16} color="#003049" />
                {type} Language
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full pl-3 pr-10 py-2 text-left text-base border-2 border-[#003049] focus:outline-none focus:ring-[#c1121f] focus:border-[#c1121f] sm:text-sm rounded-md bg-[#fdf0d5] flex items-center justify-between"
                >
                    <span>{selectedLanguage}</span>
                    {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-[#003049]" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-[#003049]" />
                    )}
                </button>
                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-[#003049] rounded-md shadow-lg max-h-60 overflow-auto">
                        <input
                            type="text"
                            className="w-full p-1 border-b border-[#003049] focus:outline-none focus:ring-[#c1121f] focus:border-[#c1121f]"
                            placeholder="Search languages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {filteredLanguages.map(([key, value]) => (
                            <div key={key} className="p-2 hover:bg-[#fdf0d5] cursor-pointer" onClick={() => handleSelect(key, value)}>
                                {key}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

LanguageSelector.propTypes = {
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    defaultLanguage: PropTypes.string.isRequired,
}

