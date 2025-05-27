import { FormSection } from '../../types';

interface ProgressIndicatorProps {
  sections: FormSection[];
  currentSectionIndex: number;
  onSectionClick: (index: number) => void;
}

const ProgressIndicator = ({ 
  sections, 
  currentSectionIndex, 
  onSectionClick 
}: ProgressIndicatorProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {sections.map((section, index) => (
          <div 
            key={section.id} 
            className="flex flex-col items-center"
          >
            <button
              onClick={() => onSectionClick(index)}
              className={`relative flex items-center justify-center rounded-full transition-all
                ${index <= currentSectionIndex 
                  ? 'bg-hpe-green text-white' 
                  : 'bg-gray-200 text-gray-500'}
                w-8 h-8 mb-2 font-medium
              `}
            >
              {index + 1}
            </button>
            <span 
              className={`text-xs font-medium ${
                index <= currentSectionIndex ? 'text-hpe-blue-700' : 'text-gray-500'
              }`}
            >
              {section.title}
            </span>
            
            {/* Connector lines between circles */}
            {index < sections.length - 1 && (
              <div 
                className={`absolute h-0.5 w-full max-w-[100px] transition-colors ${
                  index < currentSectionIndex ? 'bg-hpe-green' : 'bg-gray-200'
                }`}
                style={{
                  left: `calc(50% + 16px)`,
                  top: '16px',
                  width: 'calc(100% - 64px)',
                  transform: 'translateX(32px)',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;