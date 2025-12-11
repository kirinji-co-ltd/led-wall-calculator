import type { Meta, StoryObj } from '@storybook/react';
import { CalculationResult } from './CalculationResult';
import type { LEDWallCalculationResult } from '@/types/led-calculator';

const meta = {
  title: 'Components/Results/CalculationResult',
  component: CalculationResult,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CalculationResult>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleResult: LEDWallCalculationResult = {
  input: {
    panelWidth: 500,
    panelHeight: 500,
    screenWidth: 4,
    screenHeight: 3,
    ledPitch: 2.5,
  },
  panelCount: 12,
  resolution: {
    width: 800,
    height: 600,
    totalPixels: 480000,
  },
  physicalSize: {
    width: 2000,
    height: 1500,
    area: 3,
  },
  pixelDensity: 160000,
  viewingDistance: {
    minimum: 2.5,
    optimal: 7.0,
    maximum: 20.0,
  },
};

const sampleResultWithCost: LEDWallCalculationResult = {
  ...sampleResult,
  costEstimate: {
    panelCount: 12,
    totalCost: 1200000,
    costPerSquareMeter: 400000,
  },
};

export const Empty: Story = {
  args: {
    result: null,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    result: null,
    isLoading: true,
  },
};

export const WithBasicResult: Story = {
  args: {
    result: sampleResult,
    isLoading: false,
  },
};

export const WithCostEstimate: Story = {
  args: {
    result: sampleResultWithCost,
    isLoading: false,
  },
};

export const LargeScreen: Story = {
  args: {
    result: {
      input: {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 10,
        screenHeight: 8,
        ledPitch: 2.5,
      },
      panelCount: 80,
      resolution: {
        width: 2000,
        height: 1600,
        totalPixels: 3200000,
      },
      physicalSize: {
        width: 5000,
        height: 4000,
        area: 20,
      },
      pixelDensity: 160000,
      viewingDistance: {
        minimum: 2.5,
        optimal: 17.5,
        maximum: 50.0,
      },
      costEstimate: {
        panelCount: 80,
        totalCost: 8000000,
        costPerSquareMeter: 400000,
      },
    },
    isLoading: false,
  },
};
