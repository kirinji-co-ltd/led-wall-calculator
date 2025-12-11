import type { Meta, StoryObj } from '@storybook/react';
import { LEDPreview } from './LEDPreview';

const meta = {
  title: 'Components/Results/LEDPreview',
  component: LEDPreview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Interactive LED panel layout preview with zoom, pan, and tooltip features. Optimized for large panel configurations (1000+ panels).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    screenWidth: {
      control: { type: 'number', min: 1, max: 100 },
      description: '横のパネル数',
    },
    screenHeight: {
      control: { type: 'number', min: 1, max: 100 },
      description: '縦のパネル数',
    },
    panelWidth: {
      control: { type: 'number', min: 100, max: 1000 },
      description: 'パネル幅 (mm)',
    },
    panelHeight: {
      control: { type: 'number', min: 100, max: 1000 },
      description: 'パネル高さ (mm)',
    },
    ledPitch: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'LEDピッチ (mm)',
    },
    mode: {
      control: { type: 'radio' },
      options: ['compact', 'detailed'],
      description: '表示モード',
    },
  },
} satisfies Meta<typeof LEDPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small2x2: Story = {
  args: {
    screenWidth: 2,
    screenHeight: 2,
    panelWidth: 500,
    panelHeight: 500,
    ledPitch: 2.5,
    mode: 'detailed',
  },
};

export const Standard4x3: Story = {
  args: {
    screenWidth: 4,
    screenHeight: 3,
    panelWidth: 500,
    panelHeight: 500,
    ledPitch: 2.5,
    mode: 'detailed',
  },
};

export const Wide16x9: Story = {
  args: {
    screenWidth: 16,
    screenHeight: 9,
    panelWidth: 500,
    panelHeight: 500,
    ledPitch: 3.0,
    mode: 'detailed',
  },
};

export const Large10x8: Story = {
  args: {
    screenWidth: 10,
    screenHeight: 8,
    panelWidth: 500,
    panelHeight: 500,
    ledPitch: 2.5,
    mode: 'detailed',
  },
};

export const VeryLarge20x15: Story = {
  args: {
    screenWidth: 20,
    screenHeight: 15,
    panelWidth: 500,
    panelHeight: 500,
    ledPitch: 3.5,
    mode: 'detailed',
  },
  parameters: {
    docs: {
      description: {
        story: '大規模構成（300パネル）でのパフォーマンステスト',
      },
    },
  },
};

export const Massive50x20: Story = {
  args: {
    screenWidth: 50,
    screenHeight: 20,
    panelWidth: 500,
    panelHeight: 500,
    ledPitch: 4.0,
    mode: 'compact',
  },
  parameters: {
    docs: {
      description: {
        story: '超大規模構成（1000パネル）でのパフォーマンステスト - コンパクトモード推奨',
      },
    },
  },
};

export const Portrait3x5: Story = {
  args: {
    screenWidth: 3,
    screenHeight: 5,
    panelWidth: 500,
    panelHeight: 1000,
    ledPitch: 2.5,
    mode: 'detailed',
  },
  parameters: {
    docs: {
      description: {
        story: '縦長レイアウト',
      },
    },
  },
};

export const UltraWide12x3: Story = {
  args: {
    screenWidth: 12,
    screenHeight: 3,
    panelWidth: 1000,
    panelHeight: 500,
    ledPitch: 3.0,
    mode: 'detailed',
  },
  parameters: {
    docs: {
      description: {
        story: '横長レイアウト（ウルトラワイド）',
      },
    },
  },
};

export const SinglePanel: Story = {
  args: {
    screenWidth: 1,
    screenHeight: 1,
    panelWidth: 500,
    panelHeight: 500,
    ledPitch: 2.5,
    mode: 'detailed',
  },
};

export const CompactMode: Story = {
  args: {
    screenWidth: 10,
    screenHeight: 10,
    panelWidth: 500,
    panelHeight: 500,
    ledPitch: 2.5,
    mode: 'compact',
  },
  parameters: {
    docs: {
      description: {
        story: 'コンパクトモード - パネル番号を非表示にしてパフォーマンスを向上',
      },
    },
  },
};

export const FinePitch: Story = {
  args: {
    screenWidth: 6,
    screenHeight: 4,
    panelWidth: 500,
    panelHeight: 500,
    ledPitch: 1.2,
    mode: 'detailed',
  },
  parameters: {
    docs: {
      description: {
        story: '細かいピッチ（高解像度）',
      },
    },
  },
};

export const CoarsePitch: Story = {
  args: {
    screenWidth: 8,
    screenHeight: 6,
    panelWidth: 500,
    panelHeight: 500,
    ledPitch: 6.0,
    mode: 'detailed',
  },
  parameters: {
    docs: {
      description: {
        story: '粗いピッチ（屋外用）',
      },
    },
  },
};
