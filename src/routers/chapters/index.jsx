import React, {useState, useEffect} from "react";
import {Button, Space, Table, message, Popconfirm, Pagination, Switch} from "antd";
import {Link} from "react-router-dom";
import {fetchChapterList, deleteChapter} from "../../api/chapters.js";
import formatDate from "../../../utils/formatDate.js";
import {useSearchParams} from "react-router-dom";


const {Column} = Table;
const App = () => {
    const [searchParams] = useSearchParams();
    const [pagination, setPagination] = useState({});
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(false);
    const courseId = searchParams.get("courseId")
    const [pageParams, setPageParams] = useState({
        courseId,
        pageSize: 10,
        page:1
    });
    const init = async () => {
        setLoading(true);
        const res = await fetchChapterList(pageParams)
        setChapters(res.data.chapters)
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
        const res = await deleteChapter(id)
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
            ...pageParams,
            courseId,
            currentPage: page,
            pageSize
        })
    }


    return (
        <>
            <Link to={`/chapters/create?courseId=${courseId}`} className="create-button">
                <Space wrap className={"create-button"}>
                    <Button>新增</Button>
                </Space>
            </Link>

            <Table dataSource={chapters} rowKey="id" loading={loading} pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                defaultCurrent: 1,
                pageSizeOptions: [1, 10, 20, 30, 40],
                defaultPageSize: 10,
                total: pagination.total,
                onChange: onChange
            }}>
                <Column title="编号" dataIndex="id" key="id" align={'center'}/>
                <Column title="标题" dataIndex="title" key="title" align={'center'}/>
                <Column title="排序" dataIndex="sort" key="sort" align={'center'}/>
                <Column
                    title="所属课程"
                    dataIndex="course"
                    key="course"
                    align={'center'}
                    render={(course) => course.name}
                />
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
                            <Link to={`/chapters/edit/${record.id}?courseId=${courseId}`}>
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
    );
}
//
export default App;
