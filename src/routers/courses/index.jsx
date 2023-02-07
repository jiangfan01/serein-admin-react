import React, {useState, useEffect} from "react";
import {Button, Space, Table, message, Popconfirm, Pagination, Switch} from "antd";
import {Link} from "react-router-dom";
import {fetchCourseList, deleteCourse} from "../../api/courses.js";
import formatDate from "../../../utils/formatDate.js";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";

const {Column} = Table;
const App = () => {
    const [pagination, setPagination] = useState({});
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageParams, setPageParams] = useState({
        pageSize: 10,
        page:1
    });
    const init = async () => {
        setLoading(true);
        const res = await fetchCourseList(pageParams)
        setCourses(res.data.courses)
        setPagination(res.data.pagination)
        setLoading(false)
    }

    useEffect(() => {
        init().then();
    }, [pageParams]);

    /**
     * 删除
     * @param id
     * @returns {Promise<void>}
     */
    const confirm = async (id) => {
        const res = await deleteCourse(id)
        await init();
        message.success(res.message);
    };

    /**
     * 当分页改变了
     * @param page
     * @param pageSize
     */
    const onChange = (page, pageSize) => {
        setPageParams({
            currentPage: page,
            pageSize
        })
    }


    return (
        <>
            <Link to={"/courses/create"}>
                <Space wrap className={"create-button"}>
                    <Button>新增</Button>
                </Space>
            </Link>

            <Table dataSource={courses} rowKey="id" loading={loading} pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                defaultCurrent: 1,
                pageSizeOptions: [1, 10, 20, 30, 40],
                defaultPageSize: 10,
                total: pagination.total,
                onChange: onChange
            }}>
                <Column title="编号" dataIndex="id" key="id" align={'center'}/>
                <Column
                    title="图片"
                    dataIndex="image"
                    key="image"
                    align={'center'}
                    render={(image) => (
                        <img src={image} alt="" className="thumb"/>
                    )}
                />
                <Column title="名称" dataIndex="name" key="name" align={'center'}/>
                <Column
                    title="所属分类"
                    dataIndex="category"
                    key="category"
                    align={'center'}
                    render={(categoryId) => categoryId.name}
                />
                <Column
                    title="教学老师"
                    dataIndex="user"
                    key="user"
                    align={'center'}
                    render={(userId) => userId.username}
                />
                <Column
                    title="推荐"
                    dataIndex="recommended"
                    key="recommended"
                    render={(recommended) => (
                        recommended ? <CheckOutlined/> : <CloseOutlined/>
                    )}
                    align={'center'}
                >
                </Column>
                <Column
                    title="入门"
                    dataIndex="introductory"
                    key="introductory"
                    render={(introductory) => (
                        introductory ? <CheckOutlined/> : <CloseOutlined/>
                    )}
                    align={'center'}
                />
                <Column title="点赞数" dataIndex="likesCount" key="likesCount" align={'center'}/>
                <Column
                    title="发布时间"
                    key="createdAt"
                    render={(createdAt) => (
                        <div>{formatDate(createdAt)}</div>
                    )}
                    align={'center'}
                />
                <Column
                    title="操作"
                    key="action"
                    align={'center'}
                    render={(_, record) => (
                        <Space size="middle">
                            <Link to={`/courses/edit/${record.id}`}>
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
                <Column
                    title="章节视频"
                    key="action"
                    align={'center'}
                    render={(_, record) => (
                        <Space size="middle">
                            <Link to={`/chapters?courseId=${record.id}`}>
                                查看
                            </Link>
                        </Space>
                    )}
                />
            </Table>
        </>
    );
}
//
export default App;
