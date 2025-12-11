'use client';

import { useState, useRef, useEffect } from 'react';
import { Save, Upload, Download, Trash2, X } from 'lucide-react';
import type { LEDPreset, PresetExport } from '@/types/preset';
import type { LEDPanelFormData } from '@/types/ledPanel';
import {
  addCustomPreset,
  deleteCustomPreset,
  exportPresets,
  importPresets,
  loadCustomPresets,
} from '@/lib/presetStorage';

export interface PresetManagerProps {
  /** Current form values to save as preset */
  currentValues: Pick<LEDPanelFormData, 'panelWidth' | 'panelHeight' | 'ledPitch'>;
  /** Callback when presets are updated */
  onPresetsUpdate?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Manager component for custom preset CRUD operations
 */
export const PresetManager = ({
  currentValues,
  onPresetsUpdate,
  className = '',
}: PresetManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [customPresets, setCustomPresets] = useState<LEDPreset[]>([]);
  const [saveForm, setSaveForm] = useState({
    name: '',
    description: '',
    category: 'use-case' as LEDPreset['category'],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const loadCustomPresetsData = () => {
    const presets = loadCustomPresets();
    setCustomPresets(presets);
  };

  const handleOpen = () => {
    loadCustomPresetsData();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowSaveDialog(false);
    setSaveForm({ name: '', description: '', category: 'use-case' });
  };

  // Focus trap and keyboard navigation for modal
  useEffect(() => {
    if (!isOpen) return;

    // Focus the close button when modal opens
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close modal on Escape key
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      // Handle Tab key for focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSavePreset = () => {
    if (!saveForm.name.trim()) {
      alert('プリセット名を入力してください');
      return;
    }

    const newPreset = addCustomPreset({
      name: saveForm.name.trim(),
      description: saveForm.description.trim(),
      category: saveForm.category,
      panelWidth: currentValues.panelWidth,
      panelHeight: currentValues.panelHeight,
      ledPitch: currentValues.ledPitch,
    });

    setSaveForm({ name: '', description: '', category: 'use-case' });
    setShowSaveDialog(false);
    loadCustomPresetsData();
    onPresetsUpdate?.();
    
    alert(`プリセット「${newPreset.name}」を保存しました`);
  };

  const handleDeletePreset = (id: string, name: string) => {
    if (!confirm(`プリセット「${name}」を削除しますか？`)) {
      return;
    }

    const success = deleteCustomPreset(id);
    if (success) {
      loadCustomPresetsData();
      onPresetsUpdate?.();
      alert(`プリセット「${name}」を削除しました`);
    } else {
      alert('削除に失敗しました');
    }
  };

  const handleExport = () => {
    const presets = loadCustomPresets();
    if (presets.length === 0) {
      alert('エクスポートするカスタムプリセットがありません');
      return;
    }

    const exportData = exportPresets(presets);
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `led-presets-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as PresetExport;
        const imported = importPresets(data);
        loadCustomPresetsData();
        onPresetsUpdate?.();
        alert(`${imported.length}件のプリセットをインポートしました`);
      } catch (error) {
        console.error('Import error:', error);
        alert('インポートに失敗しました。ファイル形式を確認してください。');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label="プリセット管理を開く"
        className={`px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${className}`}
      >
        プリセット管理
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="preset-manager-title"
        >
          <div 
            ref={modalRef}
            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h2 
                id="preset-manager-title"
                className="text-xl font-semibold text-zinc-900 dark:text-zinc-100"
              >
                プリセット管理
              </h2>
              <button
                ref={closeButtonRef}
                onClick={handleClose}
                className="p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="閉じる"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowSaveDialog(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                  aria-label="現在の設定を保存"
                >
                  <Save className="w-4 h-4 mr-2" aria-hidden="true" />
                  現在の設定を保存
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                  aria-label="プリセットをエクスポート"
                >
                  <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                  エクスポート
                </button>
                <button
                  type="button"
                  onClick={handleImport}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                  aria-label="プリセットをインポート"
                >
                  <Upload className="w-4 h-4 mr-2" aria-hidden="true" />
                  インポート
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-hidden="true"
                />
              </div>

              {/* Save Dialog */}
              {showSaveDialog && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg space-y-4">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                    新しいプリセットを保存
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="preset-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        プリセット名 <span className="text-red-600 dark:text-red-400" aria-label="required">*</span>
                      </label>
                      <input
                        id="preset-name"
                        type="text"
                        value={saveForm.name}
                        onChange={(e) => setSaveForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="例: 会議室用カスタム"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label htmlFor="preset-description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        説明
                      </label>
                      <textarea
                        id="preset-description"
                        value={saveForm.description}
                        onChange={(e) => setSaveForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="例: 小会議室用の設定"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label htmlFor="preset-category" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        カテゴリ
                      </label>
                      <select
                        id="preset-category"
                        value={saveForm.category}
                        onChange={(e) => setSaveForm(prev => ({ ...prev, category: e.target.value as LEDPreset['category'] }))}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="use-case">用途</option>
                        <option value="panel-size">パネルサイズ</option>
                        <option value="pitch">ピッチ</option>
                      </select>
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
                      パネル: {currentValues.panelWidth}×{currentValues.panelHeight}mm, 
                      ピッチ: P{currentValues.ledPitch}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSavePreset}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-blue-950"
                    >
                      保存
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSaveDialog(false);
                        setSaveForm({ name: '', description: '', category: 'use-case' });
                      }}
                      className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-blue-950"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              )}

              {/* Custom Presets List */}
              <div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-3">
                  カスタムプリセット ({customPresets.length})
                </h3>
                {customPresets.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    カスタムプリセットがありません
                  </p>
                ) : (
                  <div className="space-y-2" role="list">
                    {customPresets.map(preset => (
                      <div
                        key={preset.id}
                        role="listitem"
                        className="flex items-start justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                            {preset.name}
                          </h4>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                            {preset.description}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                            {preset.panelWidth}×{preset.panelHeight}mm, P{preset.ledPitch}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeletePreset(preset.id, preset.name)}
                          className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors ml-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800"
                          aria-label={`${preset.name}を削除`}
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleClose}
                className="w-full px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
