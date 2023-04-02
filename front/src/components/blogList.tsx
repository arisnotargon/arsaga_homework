import React, { useEffect, useRef, useState } from 'react';
import { Col, Row ,Typography, Avatar, List, Skeleton, Input, Button, Pagination } from 'antd';
import { blogList as blogListRequest,deleteBlog as deleteBlogRequest } from '../api/request';
import { AxiosError } from 'axios';
import type { UserInfoType } from '../App';
import type { PaginationProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { showBlogDetailModal , BlogDetail as BlogDetailModal } from './blogDetail'


const { Text } = Typography;
//BasicProps
type Props = {
    header: React.ExoticComponent,
    setUserInfo: React.Dispatch<React.SetStateAction<{
        userName: string;
        userId: number;
    }>>,
    logout: Function,
    userInfo: UserInfoType,
}

type BlogListReqDataType = {
    page: number,
    keyword: string,
}

type Article = {
    id: number,
    title: string,
    content: string,
    uid: number,
    created_at: string,
    updated_at: string,
    uname: string
}

const BlogList = ({ header, setUserInfo, logout, userInfo }: Props) => {
    const [articleList, setArticleList] = useState([] as Array<Article>);
    const [page, setPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentSearchKeyword, setCurrentSearchKeyword] = useState('');
    const [total, setTotal] = useState(0);

    const callBlogListRequest = async (data: BlogListReqDataType) => { 
        setArticleList([]);
        setTotal(0);
        try {
            const response = await blogListRequest(data);
            console.log('in callBlogListRequest', response);
            const resData = response.data;
            setArticleList(resData.list);
            setTotal(resData.total);
        } catch (e) { 
            if (e instanceof AxiosError) {
                if (e.response?.status === 401) { 
                    // ログイン状態無効になった
                    logout();
                }
            } else {
                console.log('callBlogListRequest error=>',e);
            }
        }
    }

    useEffect(() => {
        // init
        callBlogListRequest({
            page: 1,
            keyword: ''
        });
    }, []);

    const reloadList = () => {
        callBlogListRequest({
            page: page,
            keyword: searchKeyword
        })
    }
    
    const deleteBlog = async (id: number) => {
        try {
            const response = await deleteBlogRequest(id);
            console.log('in deleteBlog', response);
            
            // reload
            callBlogListRequest({
                page: page,
                keyword: currentSearchKeyword
            });
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
        }
     };
    return(
        <>
            <header >
                <Row >
                    <Col span={8} />
                    <Col span={8}><Text style={{fontSize:'12vh'}} type="success">Blog List</Text></Col>
                    <Col span={8} />
                </Row>
            </header> 
            <div style={{ padding: 24, minHeight: 360 }}>
                <Row >
                    <Col span={8} />
                    <Col span={12} />
                    <Col span={3} >
                        <Input
                            name='search'
                            value={searchKeyword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setSearchKeyword(e.target.value);
                            }}
                            placeholder='keywords'
                        />
                    </Col>
                    <Col span={1} >
                        <Button
                            type={"primary"}
                            icon={<SearchOutlined />}
                            onClick={() => {
                                setPage(1);
                                setCurrentSearchKeyword(searchKeyword);
                                callBlogListRequest({
                                    page: 1,
                                    keyword: searchKeyword
                                })
                             }}
                        >
                            Search
                        </Button>
                    </Col>
                </Row>
                <List
                    itemLayout="horizontal"
                    dataSource={articleList}
                    renderItem={(item, index) => (
                        <List.Item actions={
                            // 自分の文章を編集、削除できる
                            userInfo.userId === item.uid ?
                                [<a key="list-edit">edit</a>, <a key="list-delete" onClick={() => {
                                    deleteBlog(item.id)
                                }}>delete</a>] : []
                        }>
                            <Skeleton avatar title={false} loading={false} active>
                                <List.Item.Meta
                                    // avatar={<Avatar src={item.picture.large} />}
                                    title={<a href="!#" onClick={() => {
                                        // console.log(showBlogDetailModal);
                                        showBlogDetailModal(item.id);
                                    }}>{item.title}</a>}
                                    description={item.content.length < 10
                                        ? item.content : item.content.substring(0, 10) + '...'}
                                />
                                <div>
                                    <p>craeted by: {item.uname}</p>
                                    <p>last edit at: {item.updated_at}</p>
                                </div>
                            </Skeleton>
                    </List.Item>
                    )}
                />
                <Pagination
                    pageSize={5}
                    current={page}
                    defaultCurrent={1}
                    total={total}
                    onChange={(newPage: number, pageSize: number) => {
                        setPage(newPage);
                        callBlogListRequest({
                            page: newPage,
                            keyword: currentSearchKeyword
                        })
                    }}
                />
            </div>
            <BlogDetailModal logout={logout} userId={userInfo.userId} reloadList={ reloadList } />
        </>
    )
 };

export default BlogList;

export type { BlogListReqDataType }