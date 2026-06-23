import React, { useState, useEffect } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Switch } from '../../../../components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { useUpdateAIConfig } from '../../hooks/ai/useUpdateAIConfig';
import type { AIModelConfig } from '../../../../types/ai';

interface AIConfigEditModalProps {
  config: AIModelConfig;
  isOpen: boolean;
  onClose: () => void;
}

const AIConfigEditModal: React.FC<AIConfigEditModalProps> = ({
  config,
  isOpen,
  onClose,
}) => {
  const { mutate: updateConfig, isPending: isUpdating } = useUpdateAIConfig();
  const [formData, setFormData] = useState<Partial<AIModelConfig>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        enabled: config.enabled,
        dailyFreeLimit: config.dailyFreeLimit,
        artcoinCostPerImage: config.artcoinCostPerImage,
        apiKey: '',
        displayName: config.displayName,
        isFree: config.isFree,
      });
    }
  }, [isOpen, config]);

  const handleSave = () => {
    const updates: Partial<AIModelConfig> = {};
    if (formData.enabled !== config.enabled) updates.enabled = formData.enabled;
    if (formData.dailyFreeLimit !== config.dailyFreeLimit)
      updates.dailyFreeLimit = formData.dailyFreeLimit;
    if (formData.artcoinCostPerImage !== config.artcoinCostPerImage)
      updates.artcoinCostPerImage = formData.artcoinCostPerImage;
    if (formData.apiKey) updates.apiKey = formData.apiKey;
    if (formData.displayName !== config.displayName)
      updates.displayName = formData.displayName;
    if (formData.isFree !== config.isFree) updates.isFree = formData.isFree;

    updateConfig(
      { provider: config.provider, ...updates },
      { onSuccess: onClose },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            Edit {config.displayName || config.provider}
          </DialogTitle>
          <DialogDescription>
            Configure settings for this AI provider
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label>Display Name</Label>
            <Input
              value={formData.displayName || ''}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label>Enabled</Label>
            <Switch
              checked={formData.enabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, enabled: checked })
              }
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label>Free Provider</Label>
            <Switch
              checked={formData.isFree}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isFree: checked })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label>Daily Free Limit</Label>
            <Input
              type='number'
              value={formData.dailyFreeLimit || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dailyFreeLimit: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label>Cost Per Image (ArtCoins)</Label>
            <Input
              type='number'
              value={formData.artcoinCostPerImage || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  artcoinCostPerImage: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label>API Key</Label>
            <Input
              type='password'
              value={formData.apiKey || ''}
              onChange={(e) =>
                setFormData({ ...formData, apiKey: e.target.value })
              }
              placeholder='Enter API key'
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isUpdating}>
            <X className='w-4 h-4 mr-2' /> Cancel
          </Button>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? (
              <Loader2 className='w-4 h-4 mr-2 animate-spin' />
            ) : (
              <Save className='w-4 h-4 mr-2' />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIConfigEditModal;
