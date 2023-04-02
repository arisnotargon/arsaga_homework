import React, { useEffect, useRef, useState } from 'react';
import { Col, Row ,Typography, Avatar, List, Skeleton, Input, Button, Pagination } from 'antd';
import { blogList as blogListRequest } from '../api/request';
import { AxiosError } from 'axios';
import type { UserInfoType } from '../App';
import type { PaginationProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';


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
        callBlogListRequest({
            page: 1,
            keyword: ''
        });
    }, []);
    

    const paginationItemRender: PaginationProps['itemRender'] = (idx, type, originalElement) => {
        console.log('in paginationItemRender', idx, type, originalElement);
        if (type === 'prev') {
            return <a>Previous</a>;
        }
        if (type === 'next') {
            return <a>Next</a>;
        }
        return originalElement;
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
                            [<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>] : []
                        }>
                            <Skeleton avatar title={false} loading={false} active>
                                <List.Item.Meta
                                    // avatar={<Avatar src={item.picture.large} />}
                                    title={<a href="!#">{item.title}</a>}
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
        </>
    )
 };

export default BlogList;

export type { BlogListReqDataType }