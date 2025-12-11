import type { Meta, StoryObj } from '@storybook/react';
import { PresetSelector } from './PresetSelector';

const meta = {
  title: 'Form/PresetSelector',
  component: PresetSelector,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onSelect: { action: 'preset selected' },
  },
} satisfies Meta<typeof PresetSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSelect: () => {},
  },
};

export const WithSelectedPreset: Story = {
  args: {
    onSelect: () => {},
    selectedId: 'panel-500x500',
  },
};
