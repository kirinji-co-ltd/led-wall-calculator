import type { Meta, StoryObj } from '@storybook/react';
import { ResultsDisplay } from './ResultsDisplay';
import type { LEDWallCalculationResult } from '@/types/led-calculator';

const meta = {
  title: 'Components/Results/ResultsDisplay',
  component: ResultsDisplay,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ResultsDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

const smallResult: LEDWallCalculationResult = {
  input: {
    panelWidth: 500,
    panelHeight: 500,
    screenWidth: 2,
    screenHeight: 2,
    ledPitch: 2.5,
  },
  panelCount: 4,
  resolution: {
    width: 400,
    height: 400,
    totalPixels: 160000,
  },
  physicalSize: {
    width: 1000,
    height: 1000,
    area: 1,
  },
  pixelDensity: 160000,
  viewingDistance: {
    minimum: 2.5,
    optimal: 3.5,
    maximum: 10.0,
  },
};

const standardResult: LEDWallCalculationResult = {
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

const standardResultWithCost: LEDWallCalculationResult = {
  ...standardResult,
  input: {
    ...standardResult.input,
    pricePerPanel: 100000,
  },
  costEstimate: {
    panelCount: 12,
    totalCost: 1200000,
    costPerSquareMeter: 400000,
  },
};

const largeResult: LEDWallCalculationResult = {
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
};

const veryLargeResult: LEDWallCalculationResult = {
  input: {
    panelWidth: 500,
    panelHeight: 500,
    screenWidth: 20,
    screenHeight: 15,
    ledPitch: 1.5,
  },
  panelCount: 300,
  resolution: {
    width: 6660,
    height: 4995,
    totalPixels: 33266700,
  },
  physicalSize: {
    width: 10000,
    height: 7500,
    area: 75,
  },
  pixelDensity: 443556,
  viewingDistance: {
    minimum: 1.5,
    optimal: 35.0,
    maximum: 100.0,
  },
  costEstimate: {
    panelCount: 300,
    totalCost: 45000000,
    costPerSquareMeter: 600000,
  },
};

const finePitchResult: LEDWallCalculationResult = {
  input: {
    panelWidth: 600,
    panelHeight: 337.5,
    screenWidth: 3,
    screenHeight: 2,
    ledPitch: 1.2,
  },
  panelCount: 6,
  resolution: {
    width: 1500,
    height: 562,
    totalPixels: 843000,
  },
  physicalSize: {
    width: 1800,
    height: 675,
    area: 1.215,
  },
  pixelDensity: 693827,
  viewingDistance: {
    minimum: 1.2,
    optimal: 6.3,
    maximum: 18.0,
  },
  costEstimate: {
    panelCount: 6,
    totalCost: 900000,
    costPerSquareMeter: 740741,
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

export const SmallScreen: Story = {
  args: {
    result: smallResult,
    isLoading: false,
  },
};

export const StandardScreen: Story = {
  args: {
    result: standardResult,
    isLoading: false,
  },
};

export const StandardWithCost: Story = {
  args: {
    result: standardResultWithCost,
    isLoading: false,
  },
};

export const LargeScreen: Story = {
  args: {
    result: largeResult,
    isLoading: false,
  },
};

export const VeryLargeScreen: Story = {
  args: {
    result: veryLargeResult,
    isLoading: false,
  },
};

export const FinePitch: Story = {
  args: {
    result: finePitchResult,
    isLoading: false,
  },
};

export const WideAspectRatio: Story = {
  args: {
    result: {
      input: {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 6,
        screenHeight: 2,
        ledPitch: 2.5,
      },
      panelCount: 12,
      resolution: {
        width: 1200,
        height: 400,
        totalPixels: 480000,
      },
      physicalSize: {
        width: 3000,
        height: 1000,
        area: 3,
      },
      pixelDensity: 160000,
      viewingDistance: {
        minimum: 2.5,
        optimal: 10.5,
        maximum: 30.0,
      },
    },
    isLoading: false,
  },
};

export const TallAspectRatio: Story = {
  args: {
    result: {
      input: {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 2,
        screenHeight: 6,
        ledPitch: 2.5,
      },
      panelCount: 12,
      resolution: {
        width: 400,
        height: 1200,
        totalPixels: 480000,
      },
      physicalSize: {
        width: 1000,
        height: 3000,
        area: 3,
      },
      pixelDensity: 160000,
      viewingDistance: {
        minimum: 2.5,
        optimal: 10.5,
        maximum: 30.0,
      },
    },
    isLoading: false,
  },
};
