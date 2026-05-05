import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate();
    return (
        <>
            <h1>홈</h1>
            <button onClick={() => navigate('/login')}>로그인</button>
            <button onClick={() => navigate('/signup')}>회원가입</button>
            <button onClick={() => navigate('/workspace')}>워크스페이스</button>
            <button onClick={() => navigate('/admin')}>관리자메뉴</button>
        </>
    )
}

export default Home
