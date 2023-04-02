import type { registInfoType } from '../components/regist'
import type { loginInfoType } from '../components/login'
import type { BlogListReqDataType } from '../components/blogList'
import type { EditBlogDetailType } from '../components/blogDetail'

import axios from 'axios';

const req = {};

const host = 'http://127.0.0.1';
const port = '8080';

const post = async (url: string, data: any) => {
    const jwt = localStorage.getItem("jwt");
    const config = {
        headers:{
            Authorization: "Bearer " + jwt,
        }
    };

    return await axios.post(url, data, config)
};

const put = async (url: string, data: any = {}) => {
    const jwt = localStorage.getItem("jwt");
    const config = {
        headers:{
            Authorization: "Bearer " + jwt,
        }
    };

    return await axios.put(url, data, config)
};

const get = async (url: string, data: any = {}) => {
    const jwt = localStorage.getItem("jwt");
    const config = {
        headers:{
            Authorization: "Bearer " + jwt,
        },
        params: data,
    };

    return await axios.get(url, config)
};

const deleteMethod = async (url: string, data: any = {}) => {
    const jwt = localStorage.getItem("jwt");
    const config = {
        headers:{
            Authorization: "Bearer " + jwt,
        },
        params: data,
    };

    return await axios.delete(url, config);
};

const regist = async (registInfo: registInfoType) => { 
    const response = await post(host + ':' + port + '/createAccount', registInfo)
    return response;
};

const login = async (loginInfo: loginInfoType) => { 
    const response = await post(host + ':' + port + '/login', loginInfo)
    return response;
};

const logout = async () => {
    const response = await get(host + ':' + port + '/logout')
    return response;
};

const blogList = async (data: BlogListReqDataType) => {
    const response = await get(host + ':' + port + '/article', data)
    return response;
};

// get login user info
const me = async () => {
    const response = await get(host + ':' + port + '/me')
    return response;
};

const deleteBlog = async (id: number) => {
    const response = await deleteMethod(host + ':' + port + `/article/${id}`);
    return response;
};

const blogDetail = async (id: number) => {
    const response = await get(host + ':' + port + `/article/${id}`);
    return response;
};

const blogEdit = async (id: number, data: EditBlogDetailType) => {
    const response = await put(host + ':' + port + `/article/${id}`, data);
    return response;
};

export {
    regist,
    logout,
    login,
    blogList,
    me,
    deleteBlog,
    blogDetail,
    blogEdit,
};