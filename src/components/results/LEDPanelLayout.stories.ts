import type { Meta, StoryObj } from '@storybook/react';
import { LEDPanelLayout } from './LEDPanelLayout';

const meta = {
  title: 'Components/Results/LEDPanelLayout',
  component: LEDPanelLayout,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LEDPanelLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small2x2: Story = {
  args: {
    screenWidth: 2,
    screenHeight: 2,
  },
};

export const Standard4x3: Story = {
  args: {
    screenWidth: 4,
    screenHeight: 3,
  },
};

export const Wide6x2: Story = {
  args: {
    screenWidth: 6,
    screenHeight: 2,
  },
};

export const Tall2x6: Story = {
  args: {
    screenWidth: 2,
    screenHeight: 6,
  },
};

export const Large8x6: Story = {
  args: {
    screenWidth: 8,
    screenHeight: 6,
  },
};

export const VeryLarge10x8: Story = {
  args: {
    screenWidth: 10,
    screenHeight: 8,
  },
};

export const Massive20x15: Story = {
  args: {
    screenWidth: 20,
    screenHeight: 15,
  },
};

export const SinglePanel: Story = {
  args: {
    screenWidth: 1,
    screenHeight: 1,
  },
};

export const Square5x5: Story = {
  args: {
    screenWidth: 5,
    screenHeight: 5,
  },
};
