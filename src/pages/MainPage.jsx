import React, { useState } from 'react'
import SideLayout from '../layouts/SideLayout'
import { ChartPreview } from '../features/ChartPreview'
import Papa from 'papaparse'

function MainPage() {
    const [data, setData] = useState([])
    const [columns, setColumns] = useState([])
    const [settings, setSettings] = useState({
        chartType: 'bar',
        categoryColumn: '',
        valueColumn: '',
        topN: 20,
        mainTitle: '',
        subTitle: '',
        mainTitlePosition: 'center',
        subTitlePosition: 'center',
        mainTitleFontSize: 20,
        subTitleFontSize: 14,
        mainTitleBold: false,
        subTitleBold: false,
        axisFontSize: 12,
        axisBold: false,
        labelFontSize: 12,
        labelBold: false,
        legendFontSize: 12,
        legendBold: false,
        sourceFontSize: 11,
        barColor: '#5470c6',
        barOpacity: 80,
        barWidth: 60,
        barGap: '30%',
        backgroundColor: '#ffffff',
        showLegend: true,
        dataSource: '',
        seriesColumns: [],
        smooth: true,
        showLabel: false,
        xColumn: '',
        yColumn: '',
        heatmapHighColor: '#c23531',
    })

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return
        Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    encoding: 'UTF-8',
    complete: (result) => {
                const parsed = result.data
                const cols = Object.keys(parsed[0] || {})
                setData(parsed)
                setColumns(cols)
                setSettings(prev => ({
                    ...prev,
                    categoryColumn: cols[0] || '',
                    valueColumn: cols[1] || '',
                    xColumn: cols[0] || '',
                    yColumn: cols[1] || '',
                    seriesColumns: cols.slice(1),
                }))
            }
        })
    }

    return (
        <SideLayout
            columns={columns}
            settings={settings}
            onSettingsChange={setSettings}
            onFileUpload={handleFileUpload}
        >
            <div className='main-page' style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
    <section style={{ flex: 1, height: '80vh', padding: '20px', minHeight: '500px' }}>
        <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
            <ChartPreview data={data} settings={settings} />
        </div>
    </section>
</div>
        </SideLayout>
    )
}

export default MainPage