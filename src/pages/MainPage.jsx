import React from 'react'
import Sidebar from '../layouts/Sidebar'
import SideLayout from '../layouts/SideLayout'

function MainPage() {

    const chartList = [1, 2, 3, 4]; // 임시 데이터

    return (
        <SideLayout>
            <div className='main-page'>

                {/* 🔥 About Us 영역 */}
                <section className='about-section'>
                    <div className='about-box'>
                        about us
                    </div>
                </section>

                {/* 🔥 차트 리스트 영역 */}
                <section className='chart-section'>

                    {/* 우측 상단 버튼 */}
                    <div className='chart-header'>
                        <button className='mypage-btn'>
                            마이페이지
                        </button>
                    </div>

                    {/* 차트 아이템 리스트 */}
                    <div className='chart-list'>
                        {/* {chartList.map((item, idx) => (
                            <ChartItem key={idx} />
                        ))} */}
                    </div>

                </section>

            </div>
        </SideLayout>
    )
}

export default MainPage
