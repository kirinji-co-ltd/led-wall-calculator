import type { Meta, StoryObj } from '@storybook/react';
import { PresetManager } from './PresetManager';

const meta = {
  title: 'Form/PresetManager',
  component: PresetManager,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onPresetsUpdate: { action: 'presets updated' },
  },
} satisfies Meta<typeof PresetManager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentValues: {
      panelWidth: 500,
      panelHeight: 500,
      ledPitch: 3.91,
    },
  },
};

export const WithCustomValues: Story = {
  args: {
    currentValues: {
      panelWidth: 640,
      panelHeight: 480,
      ledPitch: 2.5,
    },
  },
};
