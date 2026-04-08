import { useState } from 'react';
import Papa from 'papaparse';
import * as echarts from 'echarts';
import { Header } from './components/Header';
import { DataTable } from './components/DataTable';
import { ChartPreview } from './components/ChartPreview';
import { SettingsPanel } from './components/SettingsPanel';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';
import { ChartData, ChartSettings, DEFAULT_CHART_SETTINGS } from './types/chart';
import { toast } from 'sonner';

export default function App() {
  const [data, setData] = useState<ChartData[]>([]);
  const [settings, setSettings] = useState<ChartSettings>(DEFAULT_CHART_SETTINGS);
  const [activeTab, setActiveTab] = useState<'preview' | 'data'>('data');
  const [showWelcome, setShowWelcome] = useState(true);

  const handleFileUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const parsedData = results.data as ChartData[];
          setData(parsedData);
          
          // Auto-select first two columns as default
          const columns = Object.keys(parsedData[0]);
          if (columns.length >= 2) {
            setSettings({
              ...settings,
              categoryColumn: columns[0],
              valueColumn: columns[1],
            });
          }
          
          setActiveTab('preview');
          toast.success(`${parsedData.length}개의 데이터가 로드되었습니다.`);
        }
      },
      error: (error) => {
        toast.error('파일을 읽는 중 오류가 발생했습니다: ' + error.message);
      },
    });
  };

  const handleDataChange = (newData: ChartData[]) => {
    setData(newData);
    toast.success('데이터가 업데이트되었습니다.');
  };

  const handleSettingsChange = (newSettings: Partial<ChartSettings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  const handleExport = () => {
    const chartElement = document.querySelector('.echarts-for-export') as HTMLDivElement;
    
    if (!chartElement) {
      // Create a temporary chart for export
      const tempDiv = document.createElement('div');
      tempDiv.style.width = '1920px';
      tempDiv.style.height = '1080px';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.className = 'echarts-for-export';
      document.body.appendChild(tempDiv);

      const tempChart = echarts.init(tempDiv);
      
      // Get chart options from the preview component
      const categories = data
        .slice(0, settings.topN)
        .map(row => String(row[settings.categoryColumn]));
      const values = data
        .slice(0, settings.topN)
        .map(row => Number(row[settings.valueColumn]) || 0);

      const option: echarts.EChartsOption = {
        backgroundColor: settings.backgroundColor,
        title: [
          {
            text: settings.mainTitle,
            left: settings.mainTitlePosition,
            top: 40,
            textStyle: {
              fontSize: settings.mainTitleFontSize,
              fontWeight: settings.mainTitleBold ? 'bold' : 'normal',
              color: '#333',
            },
          },
          {
            text: settings.subTitle,
            left: settings.subTitlePosition,
            top: settings.mainTitle ? settings.mainTitleFontSize + 60 : 40,
            textStyle: {
              fontSize: settings.subTitleFontSize,
              fontWeight: settings.subTitleBold ? 'bold' : 'normal',
              color: '#666',
            },
          },
        ],
        grid: {
          left: '10%',
          right: '10%',
          top: settings.mainTitle || settings.subTitle ? 180 : 100,
          bottom: settings.dataSource ? 120 : 100,
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            fontSize: settings.axisFontSize,
            fontWeight: settings.axisBold ? 'bold' : 'normal',
          },
        },
        yAxis: {
          type: 'category',
          data: categories,
          axisLabel: {
            fontSize: settings.axisFontSize,
            fontWeight: settings.axisBold ? 'bold' : 'normal',
          },
        },
        series: [
          {
            type: 'bar',
            data: values,
            itemStyle: {
              color: settings.barColor,
              opacity: settings.barOpacity / 100,
            },
            barWidth: `${settings.barWidth}%`,
            barGap: settings.barGap,
            label: {
              show: true,
              position: 'right',
              fontSize: settings.labelFontSize,
              fontWeight: settings.labelBold ? 'bold' : 'normal',
            },
          },
        ],
        legend: {
          show: settings.showLegend,
          bottom: settings.dataSource ? 80 : 40,
          textStyle: {
            fontSize: settings.legendFontSize,
            fontWeight: settings.legendBold ? 'bold' : 'normal',
          },
        },
        graphic: settings.dataSource ? [
          {
            type: 'text',
            left: 'center',
            bottom: 20,
            style: {
              text: settings.dataSource,
              fontSize: settings.sourceFontSize,
              fill: '#999',
            },
          },
        ] : [],
      };

      tempChart.setOption(option);

      // Export as image
      setTimeout(() => {
        const url = tempChart.getDataURL({
          type: 'jpg',
          pixelRatio: 2,
          backgroundColor: settings.backgroundColor,
        });

        const link = document.createElement('a');
        link.download = `chart-${Date.now()}.jpg`;
        link.href = url;
        link.click();

        tempChart.dispose();
        document.body.removeChild(tempDiv);
        toast.success('차트가 다운로드되었습니다.');
      }, 500);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      
      {showWelcome && data.length === 0 ? (
        <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'preview' | 'data')} className="flex-1 flex flex-col">
              <div className="border-b bg-white px-6">
                <TabsList className="h-12">
                  <TabsTrigger value="preview" className="px-6">
                    미리보기
                  </TabsTrigger>
                  <TabsTrigger value="data" className="px-6">
                    데이터
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="preview" className="flex-1 p-6 m-0">
                <ChartPreview data={data} settings={settings} />
              </TabsContent>

              <TabsContent value="data" className="flex-1 p-6 m-0">
                <DataTable 
                  data={data} 
                  onDataChange={handleDataChange}
                  onUpload={handleFileUpload}
                />
              </TabsContent>
            </Tabs>
          </div>

          {data.length > 0 && (
            <SettingsPanel
              settings={settings}
              onSettingsChange={handleSettingsChange}
              data={data}
              onExport={handleExport}
            />
          )}
        </div>
      )}
      
      <Toaster />
    </div>
  );
}