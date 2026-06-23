import React from 'react';
import type { AIModelConfig } from '../../../../types/ai';
import AIConfigCard from './AIConfigCard';

interface AIConfigListProps {
  configs: AIModelConfig[];
}

const AIConfigList: React.FC<AIConfigListProps> = ({ configs }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      {configs.map((config) => (
        <AIConfigCard key={config.provider} config={config} />
      ))}
    </div>
  );
};

export default AIConfigList;
