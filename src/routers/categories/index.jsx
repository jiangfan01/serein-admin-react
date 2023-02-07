import React, {useState, useEffect} from "react";
import {Button, Space, Table, Tag, message, Popconfirm} from "antd";
import {Link} from "react-router-dom";
import {deleteCategory, fetchCategoryList} from "../../api/categories.js";

const {Column,} = Table;

const App = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const init = async () => {
        setLoading(true)
        const res = await fetchCategoryList()
        setCategories(res.data)
        setLoading(false)
    }

    useEffect(() => {
        init().then()
    }, [])

    //删除单条
    const confirm = async (id) => {
        const res = await deleteCategory(id)
        await init();
        message.success(res.message);
    }

    return (
        <>
            <Link to={`/categories/create`}>
                <Space wrap className={"create-button"}>
                    <Button>新增</Button>
                </Space>
            </Link>

            <Table dataSource={categories} rowKey="id" loading={loading} pagination={false}>
                <Column title="编号" dataIndex="id" key="id" align="center"/>
                <Column title="分类名称" dataIndex="name" key="name" align="center"/>
                <Column title="排序" dataIndex="sort" key="sort" align="center"/>
                <Column
                    title="操作"
                    key="action"
                    align="center"
                    render={(_, record) => (
                        <Space size="middle">
                            <Link to={`/categories/edit/${record.id}`}>
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
