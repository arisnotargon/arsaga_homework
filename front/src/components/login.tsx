import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { Button, Modal, Checkbox, Form, Input, notification } from 'antd';
import { login as loginRequest } from '../api/request';
import { AxiosError } from 'axios';

let showLoginModal: Function;

type loginInfoType = {
    email: string,
    password: string,
}

type LoginProps = {
    setUserInfo: Function
}

const Login = ({ setUserInfo }: LoginProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    showLoginModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
    } as loginInfoType);

    const loginInfoInputChangeGenerator = (k: keyof loginInfoType,) => { 
        return (e: React.ChangeEvent<HTMLInputElement>) => { 
            const newLoginInfo = { ...loginInfo };
            newLoginInfo[k] = e.target.value;
            setLoginInfo({
                ...newLoginInfo,
            })
            setErrorMsg('');
        }
    }
    const [errorMsg, setErrorMsg] = useState('');

    return <>
        <Modal title="Login" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={() => { console.log('in onFinish') }}
                onFinishFailed={() => { console.log('in onFinishFailed') }}
                autoComplete="off"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true,type: 'email', message: "Please input your email!" }]}
                    >
                    <Input onChange={loginInfoInputChangeGenerator('email')} />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please input your password!" }]}
                    >
                    <Input.Password  onChange={loginInfoInputChangeGenerator('password')} />
                </Form.Item>
                
                <p style={{ color: 'red' }}>{errorMsg}</p>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" onClick={async () => { 
                        try {
                            const response = await loginRequest(loginInfo);
                            setErrorMsg('');
                            
                            setUserInfo({
                                userName: response.data.name,
                                userId: response.data.id,
                            });
                            localStorage.setItem('jwt', response.data.access_token);
                            setIsModalOpen(false);
                        } catch (e) { 
                            if (e instanceof AxiosError ) {
                                console.log(e, e.response?.data, e.response?.data?.message, typeof e.response?.data?.message === 'string');
                                if (typeof e.response?.data?.message === 'string') {
                                    setErrorMsg(e.response?.data?.message);
                                } else { 
                                    setErrorMsg('ログイン失敗');
                                }
                            } else {
                                setErrorMsg('something went wrong');
                            }
                        }
                        
                     }}>
                    Login
                </Button>
                </Form.Item>
            </Form>
        </Modal>
    </>
};

export { showLoginModal, Login };
export type { loginInfoType };