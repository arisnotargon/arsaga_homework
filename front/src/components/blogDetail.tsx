import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { Button, Modal, Checkbox, Form, Input, notification } from 'antd';
import { blogDetail as blogDetailRequest, blogEdit as blogEditRequest } from '../api/request';
import { AxiosError } from 'axios';

let showBlogDetailModal: Function;

type BlogDetailType = {
    id: number,
    title: string,
    content: string,
    uid: number,
    created_at: string,
    updated_at: string,
    uname: string
};
type Props = {
    logout: Function,
    userId: number,
    reloadList: Function,
}

type EditBlogDetailType = {
    title: string,
    content: string,
};

const BlogDetail = ({ logout, userId, reloadList }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [blogDetail, setBlogDetail] = useState({} as BlogDetailType);

    const [form] = Form.useForm()

    const formTitle = Form.useWatch('title', form);
    const formContent = Form.useWatch('content', form);
    
    useEffect(() => {
        console.log('blogDetail changed', blogDetail);
    }, [blogDetail]);
    showBlogDetailModal = async (id: number, userId: number) => {
        if (id !== blogDetail.id) {
            setBlogDetail({} as BlogDetailType);
            try {
                const response = await blogDetailRequest(id);
                const data = response.data;
                console.log('blogDetailRequest data===>', data);
                setBlogDetail({
                    id: data.id,
                    title: data.title,
                    content: data.content,
                    uid: data.uid,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    uname: data.uname
                });

            form.setFieldValue('title', data.title);
            form.setFieldValue('content', data.content);
            } catch (e) { 
                if (e instanceof AxiosError) {
                    if (e.response?.status === 401) { 
                        // ログイン状態無効になった
                        logout();
                    } else if (e.response?.status === 403) { 
                        // 削除権限なし
                        console.log('todo:削除権限なしのtips');
                    }
                } else {
                    console.log('deleteBlogRequest error=>',e);
                }

                return;
            }
        }
        setIsModalOpen(true);
    };


    const handleCancel = () => {
        setIsModalOpen(false);
    };

    
    return <>
        <Modal
            title={'edit blog'}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={ [] }
        >
            <Form
                form={form}
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
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Please input title!" }]}
                    key={"title" + blogDetail.id}
                    >
                    <Input disabled={userId !== blogDetail.uid} />
                </Form.Item>

                <Form.Item
                    label="Content"
                    name="content"
                    rules={[{ required: true, message: "Please input content!" }]}
                    key={"content" + blogDetail.id}
                >
                    <Input.TextArea disabled={userId !== blogDetail.uid} />
                </Form.Item>
                
                <p style={{ color: 'red' }}>{errorMsg}</p>

                { userId === blogDetail.uid ? 
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" onClick={async () => { 
                            blogEditRequest(blogDetail.id, {
                                title: formTitle,
                                content:formContent,
                            }).then(() => { 
                                setErrorMsg('');
                                reloadList();
                                handleCancel();
                            }).catch((e) => { 
                                if (e instanceof AxiosError) {
                                    if (e.response?.status === 401) { 
                                        // ログイン状態無効になった
                                        logout();
                                        reloadList();
                                        handleCancel();
                                    } else if (e.response?.status === 403) { 
                                        // 削除権限なし
                                        setErrorMsg('削除権限なし');
                                    }
                                } else {
                                    setErrorMsg('some thing went wrong');
                                    console.log('deleteBlogRequest error=>',e);
                                }
                            })
                        }}>
                        edit
                    </Button>
                    </Form.Item> : null
                }
                
            </Form>
        </Modal>
    </>
};

export { showBlogDetailModal, BlogDetail };
export type { BlogDetailType, EditBlogDetailType };