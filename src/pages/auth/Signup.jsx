import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Signup() {
    const [form, setForm] = useState({
        id: '',
        pwd: '',
        name: ''
    })
    const navigate = useNavigate();
    return (
        <>
            <button onClick={() => navigate('/')}>홈가기</button>
            <h2>회원가입</h2>
            <br />
            <input type="text" id='id' placeholder='아이디' onChange={(e) => setForm({ ...form, id: e.target.value })} />
            <br />
            <input type="password" id='pwd' placeholder='비밀번호' onChange={(e) => setForm({ ...form, pwd: e.target.value })} />
            <br />
            <input type="text" id='name' placeholder='이름' onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <br />
            <p>추가할거 있으면 말씀하셔라</p>
            <button onClick={() => navigate('/login')}>회원가입</button>
        </>
    )
}

export default Signup
