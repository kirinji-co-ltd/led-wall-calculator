import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { NumberInput } from './NumberInput';

const meta = {
  title: 'Form/NumberInput',
  component: NumberInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    onChange: fn(),
    onBlur: fn(),
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'LEDパネル幅',
    name: 'panelWidth',
    value: 500,
    unit: 'mm',
    placeholder: '例: 500',
  },
};

export const Required: Story = {
  args: {
    label: 'LEDパネル幅',
    name: 'panelWidth',
    value: 0,
    unit: 'mm',
    required: true,
    placeholder: '例: 500',
  },
};

export const WithError: Story = {
  args: {
    label: 'LEDパネル幅',
    name: 'panelWidth',
    value: 0,
    unit: 'mm',
    required: true,
    error: 'パネルサイズは0より大きい値を入力してください',
    placeholder: '例: 500',
  },
};

export const WithMinMax: Story = {
  args: {
    label: '画面幅（枚数）',
    name: 'screenWidth',
    value: 4,
    unit: '枚',
    min: 1,
    max: 100,
    step: 1,
    placeholder: '例: 4',
  },
};

export const Currency: Story = {
  args: {
    label: '予算範囲',
    name: 'budget',
    value: 1000000,
    unit: '円',
    step: 1000,
    placeholder: '例: 1000000',
  },
};

export const Disabled: Story = {
  args: {
    label: 'LEDパネル幅',
    name: 'panelWidth',
    value: 500,
    unit: 'mm',
    disabled: true,
  },
};

export const NoUnit: Story = {
  args: {
    label: 'Count',
    name: 'count',
    value: 10,
    placeholder: 'Enter a number',
  },
};
