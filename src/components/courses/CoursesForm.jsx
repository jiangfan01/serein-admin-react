import React, {useEffect, useState} from "react";
import {Button, Form, Input, Select, Switch, Upload, message} from "antd";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {createCourse, fetchCourse, updateCourse} from "../../api/courses.js";
import {useNavigate, useParams} from "react-router-dom";
import {fetchCategoryList} from "../../api/categories.js";
import { fetchUserList} from "../../api/users.js";
import {fetchUploadToken} from "../../api/uploads.js";
import {v4 as uuidv4} from "uuid";

const {TextArea} = Input;
const {Option} = Select
/**
 * 验证规则
 * @type {{name: [{message: string, required: boolean}], sort: [{message: string, required: boolean}]}}
 */
const rules = {
    title: [{required: true, message: "请填写文章标题!"}],
    content: [{required: true, message: "请填写文章内容!"}]
}


const App = (props) => {
    const navigate = useNavigate();
    const params = useParams();
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [uploadData, setUploadData] = useState({
        token: "",
        key: ""
    });
    const [status,setStatus] = useState()

    /**
     * 上传图片之前
     * @param file
     * @returns {Promise<boolean>}
     */
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("你只能上传 JPG/PNG 文件!");
            return false;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("图片必须小于 2MB!");
            return false;
        }

        const ext = file.type.split("/")[1];
        setUploadData({
            ...uploadData,
            key: `${uuidv4()}.${ext}`
        })
    };

    /**
     * 初始化数据
     * @returns {Promise<void>}
     */
    const init = async () => {
        // 所有分类
        const categoryRes = await fetchCategoryList()
        setCategories(categoryRes.data)

        // 用户
        const userRes = await fetchUserList()
        setUsers(userRes.data.users)

        // 获取上传token
        const uploadRes = await fetchUploadToken()
        await setUploadData({
            ...uploadData,
            token: uploadRes.data.uploadToken
        })
    }


    /**
     * 编辑时，读取当前课程
     * @returns {Promise<void>}
     */
    const fetchData = async () => {
        const res = await fetchCourse(params.id)
        setImageUrl(res.data.course.image)
        form.setFieldsValue(res.data.course)
    }

    useEffect(() => {
        if (props.isEdit) {
            fetchData().then()
        }

        init().then()
    }, []);


    /**
     * 当上传状态改变了
     * @param info
     */
    const handleChange = (info) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }

        if (info.file.status === "done") {
            setImageUrl(`http://rpee3iey7.hn-bkt.clouddn.com/${info.file.response.key}`)
            setLoading(false);
        }
    };

    const handleStatus = (checked) => {
        setStatus(checked)
        message.success("修改成功").then(res => {
        })
    }

    /**
     * 提交表单
     * @param values
     * @returns {MessageType}
     */
    const onFinish = async (values) => {
        let res
        values = {
            ...values,
            image:imageUrl
        }
        if (props.isEdit) {
            res = await updateCourse(params.id, values)
        } else {
            res = await createCourse(values)
        }

        if (res.code !== 20000) {
            return message.error(res.message)
        }

        message.success(res.message)
        navigate("/courses")
    };

    /**
     * 上传按钮
     * @type {JSX.Element}
     */
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined/> : <PlusOutlined/>}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                上传
            </div>
        </div>
    );

    return (
        <Form
            form={form}
            name="basic"
            labelCol={{
                span: 2,
            }}
            wrapperCol={{
                span: 14,
            }}
            initialValues={{
                sort: 1,
            }}
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item
                label="课程名称"
                name="name"
                rules={rules.name}
            >
                <Input/>
            </Form.Item>

            <Form.Item label="课程图片" >
                <Upload
                    name="file"
                    action="http://up-z2.qiniup.com/"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    data={uploadData}
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="avatar"
                            style={{
                                width: "100%",
                                borderRadius: "8px"
                            }}
                        />
                    ) : (
                        uploadButton
                    )}
                </Upload>
            </Form.Item>

            <Form.Item name="categoryId" label="分类" rules={[{ required: true }]}>
                <Select
                    placeholder="请选择分类"
                    allowClear
                >
                    {categories.map(category => (
                        <Option value={category.id} key={category.id}>{category.name}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item name="userId" label="教学老师" rules={[{required: true}]}>
                <Select
                    placeholder="请选择教学老师"
                    allowClear
                >
                    {users.map(user => (
                        <Option value={user.id} key={user.id}>{user.username}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item label="推荐" name="recommended" valuePropName="checked">
                <Switch onClick={handleStatus}/>
            </Form.Item>

            <Form.Item label="入门" name="introductory" valuePropName="checked">
                <Switch onClick={handleStatus}/>
            </Form.Item>

            <Form.Item
                label="内容"
                name="content"
                rules={rules.content}
            >
                <TextArea rows={4}/>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 2,
                    span: 10,
                }}
            >
                <Button type="primary" htmlType="submit" className={'submit-button'}>
                    {props.isEdit ? "更新" : "新增"}
                </Button>
            </Form.Item>
        </Form>
    )
}
export default App