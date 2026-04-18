import React from 'react'

function Sidebar({ columns = [], settings, onSettingsChange, onFileUpload }) {
    const update = (field, value) =>
        onSettingsChange({ ...settings, [field]: value })

    const isArea = settings?.chartType === 'area-stacked' || settings?.chartType === 'area-proportional'
    const isHeatmap = settings?.chartType === 'heatmap-categorical'

    return (
        <div className='sidebar' style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* CSV 업로드 */}
            <div>
                <label style={{ fontWeight: 'bold' }}>CSV 파일 업로드</label><br />
                <input type='file' accept='.csv' onChange={onFileUpload} />
            </div>

            {/* 차트 타입 */}
            <div>
                <label style={{ fontWeight: 'bold' }}>차트 타입</label><br />
                <select value={settings?.chartType} onChange={e => update('chartType', e.target.value)} style={{ width: '100%' }}>
                    <option value='bar'>막대 그래프</option>
                    <option value='area-stacked'>누적 영역 차트</option>
                    <option value='area-proportional'>비중 영역 차트</option>
                    <option value='heatmap-categorical'>범주형 히트맵</option>
                </select>
            </div>

            {/* 막대 / area 공통: 카테고리 컬럼 */}
            {!isHeatmap && (
                <div>
                    <label>X축 / 카테고리 컬럼</label><br />
                    <select value={settings?.categoryColumn} onChange={e => update('categoryColumn', e.target.value)} style={{ width: '100%' }}>
                        {columns.map(col => <option key={col} value={col}>{col}</option>)}
                    </select>
                </div>
            )}

            {/* 막대: 값 컬럼 */}
            {!isArea && !isHeatmap && (
                <div>
                    <label>값 컬럼</label><br />
                    <select value={settings?.valueColumn} onChange={e => update('valueColumn', e.target.value)} style={{ width: '100%' }}>
                        {columns.map(col => <option key={col} value={col}>{col}</option>)}
                    </select>
                </div>
            )}

            {/* area: 시리즈 컬럼 다중 선택 */}
            {isArea && (
                <div>
                    <label>시리즈 컬럼 (체크 = 포함)</label>
                    {columns.filter(c => c !== settings?.categoryColumn).map(col => (
                        <div key={col}>
                            <label>
                                <input
                                    type='checkbox'
                                    checked={settings?.seriesColumns?.includes(col) ?? true}
                                    onChange={e => {
                                        const prev = settings?.seriesColumns ?? []
                                        const next = e.target.checked
                                            ? [...prev, col]
                                            : prev.filter(c => c !== col)
                                        update('seriesColumns', next)
                                    }}
                                />
                                {' '}{col}
                            </label>
                        </div>
                    ))}
                </div>
            )}

            {/* heatmap: X / Y / 값 컬럼 */}
            {isHeatmap && (
                <>
                    <div>
                        <label>X축 컬럼</label><br />
                        <select value={settings?.xColumn} onChange={e => update('xColumn', e.target.value)} style={{ width: '100%' }}>
                            {columns.map(col => <option key={col} value={col}>{col}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Y축 컬럼</label><br />
                        <select value={settings?.yColumn} onChange={e => update('yColumn', e.target.value)} style={{ width: '100%' }}>
                            {columns.map(col => <option key={col} value={col}>{col}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>값 컬럼</label><br />
                        <select value={settings?.valueColumn} onChange={e => update('valueColumn', e.target.value)} style={{ width: '100%' }}>
                            {columns.map(col => <option key={col} value={col}>{col}</option>)}
                        </select>
                    </div>
                </>
            )}

            {/* 제목 */}
            <div>
                <label>메인 제목</label><br />
                <input value={settings?.mainTitle} onChange={e => update('mainTitle', e.target.value)} style={{ width: '100%' }} />
            </div>
            <div>
                <label>서브 제목</label><br />
                <input value={settings?.subTitle} onChange={e => update('subTitle', e.target.value)} style={{ width: '100%' }} />
            </div>
            <div>
                <label>출처</label><br />
                <input value={settings?.dataSource} onChange={e => update('dataSource', e.target.value)} style={{ width: '100%' }} />
            </div>

            {/* 상위 N개 */}
            {!isArea && !isHeatmap && (
                <div>
                    <label>상위 N개: {settings?.topN}</label><br />
                    <input type='range' min={1} max={50} value={settings?.topN}
                        onChange={e => update('topN', Number(e.target.value))} style={{ width: '100%' }} />
                </div>
            )}

        </div>
    )
}

export default Sidebar
