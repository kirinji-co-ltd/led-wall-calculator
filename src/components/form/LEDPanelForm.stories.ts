import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { LEDPanelForm } from './LEDPanelForm';

const meta = {
  title: 'Form/LEDPanelForm',
  component: LEDPanelForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    onSubmit: fn(),
    onChange: fn(),
  },
} satisfies Meta<typeof LEDPanelForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {},
};

export const WithInitialValues: Story = {
  args: {
    initialValues: {
      panelWidth: 500,
      panelHeight: 500,
      screenWidth: 4,
      screenHeight: 3,
      ledPitch: 2.5,
      viewingDistance: 5,
      budget: 1000000,
    },
  },
};

export const PartiallyFilled: Story = {
  args: {
    initialValues: {
      panelWidth: 500,
      panelHeight: 500,
      ledPitch: 2.5,
    },
  },
};
