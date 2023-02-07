import React, {useState, useEffect} from "react";
import {Space, Table, Tag, message, Popconfirm} from "antd";
import {Link} from "react-router-dom";
import {deleteUser, fetchUserList} from "../../api/users.js";

const {Column,} = Table;

const App = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageParams, setPageParams] = useState({
        pageSize: 5,
        page:1
    });
    const [pagination, setPagination] = useState({});
    const init = async () => {
        setLoading(true)
        const res = await fetchUserList(pageParams)
        setPagination(res.data.pagination)
        setUsers(res.data.users)
        setLoading(false)
    }

    useEffect(() => {
        init().then()
    }, [pageParams])

    /**
     * 删除单条
     * @param id
     * @return {Promise<void>}
     */
    const confirm = async (id) => {
        const res = await deleteUser(id)
        await init();
        message.success(res.message);
    }

    const onChange = (page, pageSize) => {
        setPageParams({
            currentPage: page,
            pageSize
        })
    }

    return (
        <>
            <Table dataSource={users} rowKey="id" loading={loading} pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                defaultCurrent: 1,
                pageSizeOptions: [1, 5, 10, 20, 30],
                defaultPageSize: 5,
                total: pagination.total,
                onChange: onChange
            }}>
                <Column title="编号" dataIndex="id" key="id" align="center"/>
                <Column title="用户昵称" dataIndex="username" key="username" align="center"/>
                <Column
                    title="头像"
                    dataIndex="avatar"
                    key="avatar"
                    align={'center'}
                    render={(image) => (
                        <img src={image} alt="" className="thumb"/>
                    )}
                />
                <Column
                    title="性别"
                    dataIndex="sex"
                    key="sex"
                    align="center"
                    render={(sex, record, index) => (
                        sex ? <Tag color="blue" key={sex}>男性 </Tag> : <Tag color="pink" key={sex}>女性</Tag>
                    )}
                />
                <Column title="签名" dataIndex="signature" key="signature" align="center"/>
                <Column title="公司 学校" dataIndex="company" key="company" align="center"/>
                <Column title="介绍" dataIndex="introduce" key="introduce" align="center"/>
                <Column
                    title="是否为管理员"
                    dataIndex="admin"
                    key="admin"
                    render={(admin, record, index) => (
                        admin ? <Tag color="green" key={admin}>是 </Tag> : <Tag color="red" key={admin}>否</Tag>
                    )}
                    align={'center'}
                />
                <Column
                    title="操作"
                    key="action"
                    align="center"
                    render={(_, record) => (
                        <Space size="middle">
                            <Link to={`/users/edit/${record.id}`}>
                                编辑
                            </Link>
                        </Space>
                    )}
                />
            </Table>
        </>
    )
};
export default App;
