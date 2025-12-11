import type { Meta, StoryObj } from '@storybook/react';
import { PanelSelector } from './PanelSelector';
import { panelModels } from '@/lib/panelModels';

const meta = {
  title: 'Form/PanelSelector',
  component: PanelSelector,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onSelect: { action: 'panel selected' },
  },
} satisfies Meta<typeof PanelSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    panels: panelModels,
    onSelect: () => {},
  },
};

export const WithSelectedPanel: Story = {
  args: {
    panels: panelModels,
    selectedPanelId: 'q-plus-p2.5',
    onSelect: () => {},
  },
};

export const EmptyPanels: Story = {
  args: {
    panels: [],
    onSelect: () => {},
  },
};

export const SinglePanel: Story = {
  args: {
    panels: [panelModels[0]],
    onSelect: () => {},
  },
};
