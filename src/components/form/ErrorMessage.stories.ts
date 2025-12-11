import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ErrorMessage } from './ErrorMessage';

const meta = {
  title: 'Form/ErrorMessage',
  component: ErrorMessage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'This field is required',
  },
};

export const NoMessage: Story = {
  args: {
    message: undefined,
  },
};

export const LongMessage: Story = {
  args: {
    message: 'This is a very long error message that should wrap properly on smaller screens and maintain readability',
  },
};
