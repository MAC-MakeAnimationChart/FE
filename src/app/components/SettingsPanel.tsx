import React from 'react';
import { ChartSettings, ChartData } from '../types/chart';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Download, Palette, Type, BarChart3, Settings2 } from 'lucide-react';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

interface SettingsPanelProps {
  settings: ChartSettings;
  onSettingsChange: (settings: Partial<ChartSettings>) => void;
  data: ChartData[];
  onExport: () => void;
}

export function SettingsPanel({ settings, onSettingsChange, data, onExport }: SettingsPanelProps) {
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <ScrollArea className="h-full w-80 bg-white border-l border-gray-200">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">차트 설정</h2>
          <Button onClick={onExport} size="sm">
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </Button>
        </div>

        <Separator />

        {/* 데이터 설정 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-sm">데이터 설정</h3>
          </div>

          <div className="space-y-2">
            <Label>카테고리 컬럼</Label>
            <Select value={settings.categoryColumn} onValueChange={(value) => onSettingsChange({ categoryColumn: value })}>
              <SelectTrigger>
                <SelectValue placeholder="컬럼 선택" />
              </SelectTrigger>
              <SelectContent>
                {columns.map(col => (
                  <SelectItem key={col} value={col}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>값 컬럼</Label>
            <Select value={settings.valueColumn} onValueChange={(value) => onSettingsChange({ valueColumn: value })}>
              <SelectTrigger>
                <SelectValue placeholder="컬럼 선택" />
              </SelectTrigger>
              <SelectContent>
                {columns.map(col => (
                  <SelectItem key={col} value={col}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>표시할 행 수 (Top N): {settings.topN}</Label>
            <Slider
              value={[settings.topN]}
              onValueChange={([value]) => onSettingsChange({ topN: value })}
              min={1}
              max={Math.min(50, data.length)}
              step={1}
            />
          </div>
        </div>

        <Separator />

        {/* 색상 설정 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-sm">색상</h3>
          </div>

          <div className="space-y-2">
            <Label>막대 색상</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.barColor}
                onChange={(e) => onSettingsChange({ barColor: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={settings.barColor}
                onChange={(e) => onSettingsChange({ barColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>배경 색상</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* 막대 설정 */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">막대 설정</h3>

          <div className="space-y-2">
            <Label>막대 두께 (%): {settings.barWidth}</Label>
            <Slider
              value={[settings.barWidth]}
              onValueChange={([value]) => onSettingsChange({ barWidth: value })}
              min={10}
              max={100}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <Label>투명도 (%): {settings.barOpacity}</Label>
            <Slider
              value={[settings.barOpacity]}
              onValueChange={([value]) => onSettingsChange({ barOpacity: value })}
              min={0}
              max={100}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <Label>막대 간격</Label>
            <Select value={settings.barGap} onValueChange={(value) => onSettingsChange({ barGap: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0%">좁게 (0%)</SelectItem>
                <SelectItem value="10%">보통 (10%)</SelectItem>
                <SelectItem value="20%">넓게 (20%)</SelectItem>
                <SelectItem value="30%">매우 넓게 (30%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* 글자 서식 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-sm">글자 서식</h3>
          </div>

          <div className="space-y-2">
            <Label>라벨 크기: {settings.labelFontSize}px</Label>
            <Slider
              value={[settings.labelFontSize]}
              onValueChange={([value]) => onSettingsChange({ labelFontSize: value })}
              min={8}
              max={24}
              step={1}
            />
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.labelBold}
                onCheckedChange={(checked) => onSettingsChange({ labelBold: checked })}
              />
              <Label>굵게</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>축 글자 크기: {settings.axisFontSize}px</Label>
            <Slider
              value={[settings.axisFontSize]}
              onValueChange={([value]) => onSettingsChange({ axisFontSize: value })}
              min={8}
              max={24}
              step={1}
            />
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.axisBold}
                onCheckedChange={(checked) => onSettingsChange({ axisBold: checked })}
              />
              <Label>굵게</Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* 범례 */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">범례 (Legend)</h3>

          <div className="flex items-center gap-2">
            <Switch
              checked={settings.showLegend}
              onCheckedChange={(checked) => onSettingsChange({ showLegend: checked })}
            />
            <Label>범례 표시</Label>
          </div>

          {settings.showLegend && (
            <>
              <div className="space-y-2">
                <Label>범례 글자 크기: {settings.legendFontSize}px</Label>
                <Slider
                  value={[settings.legendFontSize]}
                  onValueChange={([value]) => onSettingsChange({ legendFontSize: value })}
                  min={8}
                  max={20}
                  step={1}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.legendBold}
                  onCheckedChange={(checked) => onSettingsChange({ legendBold: checked })}
                />
                <Label>굵게</Label>
              </div>
            </>
          )}
        </div>

        <Separator />

        {/* 제목 설정 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-sm">제목</h3>
          </div>

          <div className="space-y-2">
            <Label>대제목</Label>
            <Input
              value={settings.mainTitle}
              onChange={(e) => onSettingsChange({ mainTitle: e.target.value })}
              placeholder="차트 제목 입력"
            />
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label className="text-xs">크기: {settings.mainTitleFontSize}px</Label>
                <Slider
                  value={[settings.mainTitleFontSize]}
                  onValueChange={([value]) => onSettingsChange({ mainTitleFontSize: value })}
                  min={12}
                  max={48}
                  step={2}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.mainTitleBold}
                  onCheckedChange={(checked) => onSettingsChange({ mainTitleBold: checked })}
                />
                <Label className="text-xs">굵게</Label>
              </div>
              <Select value={settings.mainTitlePosition} onValueChange={(value: any) => onSettingsChange({ mainTitlePosition: value })}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">왼쪽</SelectItem>
                  <SelectItem value="center">중앙</SelectItem>
                  <SelectItem value="right">오른쪽</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>부제목</Label>
            <Input
              value={settings.subTitle}
              onChange={(e) => onSettingsChange({ subTitle: e.target.value })}
              placeholder="부제목 입력"
            />
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label className="text-xs">크기: {settings.subTitleFontSize}px</Label>
                <Slider
                  value={[settings.subTitleFontSize]}
                  onValueChange={([value]) => onSettingsChange({ subTitleFontSize: value })}
                  min={10}
                  max={32}
                  step={2}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.subTitleBold}
                  onCheckedChange={(checked) => onSettingsChange({ subTitleBold: checked })}
                />
                <Label className="text-xs">굵게</Label>
              </div>
              <Select value={settings.subTitlePosition} onValueChange={(value: any) => onSettingsChange({ subTitlePosition: value })}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">왼쪽</SelectItem>
                  <SelectItem value="center">중앙</SelectItem>
                  <SelectItem value="right">오른쪽</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* 출처 */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">데이터 출처</h3>

          <div className="space-y-2">
            <Label>출처</Label>
            <Input
              value={settings.dataSource}
              onChange={(e) => onSettingsChange({ dataSource: e.target.value })}
              placeholder="예: 통계청, 2024"
            />
            <div className="space-y-2">
              <Label className="text-xs">크기: {settings.sourceFontSize}px</Label>
              <Slider
                value={[settings.sourceFontSize]}
                onValueChange={([value]) => onSettingsChange({ sourceFontSize: value })}
                min={8}
                max={16}
                step={1}
              />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
