import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [form, setForm] = useState({ id: '', pwd: '' })
    const navigate = useNavigate();
    return (
        <>
            <button onClick={() => navigate('/')}>홈가기</button>
            <h1>로그인</h1>
            <input type="text" placeholder='아이디' onChange={(e) => setForm({ ...form, id: e.target.value })} />
            <br />
            <input type="password" placeholder='비밀번호' onChange={(e) => setForm({ ...form, pwd: e.target.value })} />
            <br />
            <hr />
            <button
                // 여기에 로그인으로 연결
                onClick={() => navigate('/')}
            >로그인</button>

            <button
                //여기에 회원가입으로 연결
                onClick={() => navigate('/signup')}
            >회원가입</button>
        </>
    )
}

export default Login
