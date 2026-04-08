import React, { useState } from 'react';
import { ChartData } from '../types/chart';
import { Upload, Edit2, Save, X } from 'lucide-react';
import { Button } from './ui/button';

interface DataTableProps {
  data: ChartData[];
  onDataChange: (data: ChartData[]) => void;
  onUpload: (file: File) => void;
}

export function DataTable({ data, onDataChange, onUpload }: DataTableProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleCellClick = (rowIndex: number, columnKey: string, value: any) => {
    setEditingCell({ row: rowIndex, col: columnKey });
    setEditValue(String(value));
  };

  const handleCellSave = () => {
    if (editingCell) {
      const newData = [...data];
      newData[editingCell.row][editingCell.col] = editValue;
      onDataChange(newData);
      setEditingCell(null);
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <Upload className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">CSV 파일을 업로드하세요</h3>
        <p className="text-sm text-gray-500 mb-6">데이터 파일을 선택하여 차트를 만들어보세요</p>
        <label htmlFor="csv-upload">
          <Button asChild>
            <span className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              파일 선택
            </span>
          </Button>
        </label>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            총 {data.length}개 행
          </span>
        </div>
        <label htmlFor="csv-upload-reload">
          <Button variant="outline" size="sm" asChild>
            <span className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              다른 파일 업로드
            </span>
          </Button>
        </label>
        <input
          id="csv-upload-reload"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="bg-blue-50 sticky top-0 z-10">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 bg-blue-100 w-12">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[120px]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-500 bg-gray-50 font-medium">
                  {rowIndex + 1}
                </td>
                {columns.map((col) => (
                  <td
                    key={col}
                    className="border border-gray-300 px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-blue-50 relative group"
                    onClick={() => handleCellClick(rowIndex, col, row[col])}
                  >
                    {editingCell?.row === rowIndex && editingCell?.col === col ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCellSave();
                            if (e.key === 'Escape') handleCellCancel();
                          }}
                        />
                        <button
                          onClick={handleCellSave}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCellCancel}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span>{row[col]}</span>
                        <Edit2 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
