import React, { useState } from 'react';
import AIConfigEditModal from './AIConfigEditModal';
import { Card } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Switch } from '../../../../components/ui/switch';
import type { AIModelConfig } from '../../../../types/ai';
import { Button } from '../../../../components/ui/button';
import { Cpu, Edit, Activity, Loader2 } from 'lucide-react';
import { useUpdateAIConfig } from '../../hooks/ai/useUpdateAIConfig';
import { useTestAIProvider } from '../../hooks/ai/useTestAIProvider';

interface AIConfigCardProps {
  config: AIModelConfig;
}

const AIConfigCard: React.FC<AIConfigCardProps> = ({ config }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: updateConfig, isPending: isUpdating } = useUpdateAIConfig();
  const { mutate: testProvider, isPending: isTesting } = useTestAIProvider();

  return (
    <>
      <Card
        className={`p-4 bg-card border-2 transition-all hover:shadow-md ${config.enabled ? 'border-green-500/30' : 'border-border'}`}
      >
        <div className='flex items-start justify-between mb-3'>
          <div className='flex items-center gap-3'>
            <div
              className={`p-2 rounded-lg ${config.enabled ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}
            >
              <Cpu size={18} />
            </div>
            <div>
              <h3 className='text-base font-bold'>
                {config.displayName || config.provider}
              </h3>
              <div className='flex items-center gap-2 mt-1'>
                <Badge
                  variant={config.enabled ? 'default' : 'secondary'}
                  className='text-xs'
                >
                  {config.enabled ? 'Active' : 'Inactive'}
                </Badge>
                <Badge
                  variant={config.isFree ? 'outline' : 'default'}
                  className='text-xs'
                >
                  {config.isFree ? 'Free' : 'Paid'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2 mb-3 text-sm'>
          <div>
            <p className='text-muted-foreground text-xs'>Free Limit</p>
            <p className='font-semibold'>{config.dailyFreeLimit}/day</p>
          </div>
          <div>
            <p className='text-muted-foreground text-xs'>Cost</p>
            <p className='font-semibold'>{config.artcoinCostPerImage} AC</p>
          </div>
          <div>
            <p className='text-muted-foreground text-xs'>Models</p>
            <p className='font-semibold text-xs truncate'>
              {config.availableModels?.join(', ') || 'N/A'}
            </p>
          </div>
          <div>
            <p className='text-muted-foreground text-xs'>Priority</p>
            <p className='font-semibold'>{config.priority || 99}</p>
          </div>
        </div>

        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => testProvider(config.provider)}
            disabled={isTesting}
            className='flex-1'
          >
            {isTesting ? (
              <Loader2 className='w-3 h-3 animate-spin' />
            ) : (
              <Activity className='w-3 h-3' />
            )}
            <span className='ml-2'>Test</span>
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsModalOpen(true)}
            className='flex-1'
          >
            <Edit className='w-3 h-3' /> <span className='ml-2'>Edit</span>
          </Button>
          <Switch
            variant='green'
            checked={config.enabled}
            onCheckedChange={() =>
              updateConfig({
                provider: config.provider,
                enabled: !config.enabled,
              })
            }
            disabled={isUpdating}
          />
        </div>
      </Card>

      <AIConfigEditModal
        config={config}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AIConfigCard;
