import type { Meta, StoryObj } from '@storybook/react';
import { PanelDetail } from './PanelDetail';
import { panelModels } from '@/lib/panelModels';

const meta = {
  title: 'Form/PanelDetail',
  component: PanelDetail,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PanelDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HighResolutionPanel: Story = {
  args: {
    panel: panelModels[0], // Q+1.5
  },
};

export const StandardPanel: Story = {
  args: {
    panel: panelModels[2], // Q+2.5
  },
};

export const LargePanel: Story = {
  args: {
    panel: panelModels[5], // Q+4.8
  },
};

export const AllSpecifications: Story = {
  args: {
    panel: {
      ...panelModels[2],
      imageUrl: 'https://via.placeholder.com/800x600/4B5563/FFFFFF?text=LED+Panel',
      pricePerPanel: 125000,
    },
  },
};

export const MinimalSpecifications: Story = {
  args: {
    panel: {
      id: 'minimal-panel',
      modelNumber: 'MIN-1',
      displayName: 'Minimal Panel',
      series: 'Basic',
      panelWidth: 500,
      panelHeight: 500,
      pixelPitch: 2.0,
      brightness: 800,
      description: 'A basic LED panel with minimal specifications',
    },
  },
};
