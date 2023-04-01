import React, { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { regist as registRequest } from '../api/request';
import { AxiosError } from 'axios';

let showRegistModal: Function;

type registInfoType = {
    name: string,
    email: string,
    password: string,
    password_confirmation: string
}

type RegistProps = {
    setUserInfo: Function
}

const Regist = ({ setUserInfo }: RegistProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    showRegistModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [registInfo, setRegistInfo] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    } as registInfoType);

    const registInfoInputChangeGenerator = (k: keyof registInfoType,) => { 
        return (e: React.ChangeEvent<HTMLInputElement>) => { 
            const newRegistInfo = { ...registInfo };
            newRegistInfo[k] = e.target.value;
            setRegistInfo({
                ...newRegistInfo,
            })
            setErrorMsg('');
        }
    }
    const [errorMsg, setErrorMsg] = useState('');

    return <>
        <Modal title="Account Regist" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: "Please input your name!" }]}
                    >
                    <Input onChange={registInfoInputChangeGenerator('name')} />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true,type: 'email', message: "Please input your email!" }]}
                    >
                    <Input onChange={registInfoInputChangeGenerator('email')} />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please input your password!" }]}
                    >
                    <Input.Password  onChange={registInfoInputChangeGenerator('password')} />
                </Form.Item>

                <Form.Item
                    label="Password Confirm"
                    name="password_confirmation"
                    rules={[{ required: true, message: "Please confirm your password!" }]}
                    >
                    <Input.Password  onChange={registInfoInputChangeGenerator('password_confirmation')} />
                </Form.Item>
                <p style={{ color: 'red' }}>{errorMsg}</p>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" onClick={async () => { 
                        try {
                            const res = await registRequest(registInfo);
                            setErrorMsg('');
                            
                            setUserInfo({
                                userName: res.data.name,
                                userId: res.data.id,
                            });
                            localStorage.setItem('jwt', res.data.access_token);
                            setIsModalOpen(false);
                        } catch (e) {
                            if (e instanceof AxiosError ) {
                                console.log(e, e.response?.data, e.response?.data?.message, typeof e.response?.data?.message === 'string');
                                if (typeof e.response?.data?.message === 'string') { 
                                    setErrorMsg(e.response?.data?.message);
                                } else { 
                                    setErrorMsg('登録失敗');
                                }
                            } else {
                                setErrorMsg('something went wrong');
                            }
                        }
                        
                     }}>
                    Regist
                </Button>
                </Form.Item>
            </Form>
        </Modal>
    </>
};

export { showRegistModal, Regist };
export type { registInfoType };