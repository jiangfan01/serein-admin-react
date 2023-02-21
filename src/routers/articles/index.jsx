import React, {useState, useEffect} from "react";
import {Button, Space, Table, Tag, message, Popconfirm} from "antd";
import {Link} from "react-router-dom";
import {fetchArticleList, deleteArticle} from "../../api/articles.js";
import formatDate from "../../../utils/formatDate.js";

const {Column,} = Table;

const App = () => {

    const [pagination, setPagination] = useState({});
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageParams, setPageParams] = useState({
        currentPage: 1,
        pageSize: 10
    });

    const init = async () => {
        setLoading(true)
        const res = await fetchArticleList(pageParams)
        setArticles(res.data.articles)
        setPagination(res.data.pagination)
        setLoading(false)
    }

    useEffect(() => {
        init().then()
    }, [pageParams])

    //删除单条
    const confirm = async (id) => {
        const res = await deleteArticle(id)
        await init();
        message.success(res.message);
    }

    //页面发生变化
    const onChange = (page, pageSize) => {
        setPageParams({
            currentPage: page,
            pageSize:pageSize
        })
    }

    return (
        <>
            <Link to={`/articles/create`}>
                <Space wrap className={"create-button"}>
                    <Button>新增</Button>
                </Space>
            </Link>

            <Table dataSource={articles} rowKey="id" loading={loading} pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                defaultCurrent: 1,
                pageSizeOptions: [1, 10, 20, 30, 40],
                defaultPageSize: 10,
                total: pagination.total,
                onChange: onChange
            }}>
                <Column title="编号" dataIndex="id" key="id" align="center"/>
                <Column title="文章标题" dataIndex="title" key="title" align="center"/>
                <Column title="发布时间" dataIndex="createdAt" key="createdAt" align="center"/>
                <Column
                    title="操作"
                    key="action"
                    align="center"
                    render={(_, record) => (
                        <Space size="middle">
                            <Link to={`/articles/edit/${record.id}`}>
                                编辑
                            </Link>
                            <Popconfirm
                                title="删除？"
                                description="确定要删除这条记录吗？"
                                onConfirm={() => confirm(record.id)}
                                okText="是"
                                cancelText="否"
                            >
                                <a>删除</a>
                            </Popconfirm>
                        </Space>
                    )}
                />
            </Table>
        </>
    )
};
export default App;
