import React, { useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import axios from 'axios';


function Login() {

    const [user, setUser] = useState({
        userId: '',
        userPwd: ''
    });

    const handleUser = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5173/main', user);
            console.log(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <>
            <MainLayout>
                <form onSubmit={handleLogin} className='login-container'>
                    <h1>로그인</h1>
                    <label htmlFor="userId">ID : </label>
                    <input
                        type="text"
                        name='userId'
                        id='userId'
                        value={user.userId}
                        onChange={handleUser}
                        placeholder='ID를 입력하세요'
                    /><br />
                    <label htmlFor="userPwd">PWD : </label>
                    <input
                        type="password"
                        name='userPwd'
                        id='userPwd'
                        value={user.userPwd}
                        onChange={handleUser}
                        placeholder='비밀번호를 입력하세요' />
                    <br /><button>로그인</button>
                </form>
            </MainLayout>
        </>
    )
}

export default Login
