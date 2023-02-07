import {Button, Form, Input, Select, Upload, Switch, message} from 'antd';
import {PlusOutlined, LoadingOutlined} from '@ant-design/icons';
import {useNavigate, useParams} from "react-router-dom";
import {fetchUser, updateUser} from "../../api/users.js";
import {useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";
import {fetchUploadToken} from "../../api/uploads.js";

const rules = {
    username: [{required: true, message: "请填写用户名!"}],
}

const App = () => {
    const navigate = useNavigate();
    const params = useParams();
    const {TextArea} = Input;
    const [formData] = Form.useForm();
    const [imageUrl, setImageUrl] = useState();
    const [sex, setSex] = useState();
    const [admin, setAdmin] = useState();
    const [loading, setLoading] = useState(false);
    const [uploadData, setUploadData] = useState({
        token: "",
        key: ""
    });

    /**
     * @description 查询单条
     */
    const init = async () => {
        const res = await fetchUser(params.id)
        formData.setFieldsValue({...res.data.user,password:""})
        setImageUrl(res.data.user.avatar)
        setSex(res.data.user.sex ? "男" : "女")
        //获取token
        const token = await fetchUploadToken()
        await setUploadData({
            ...uploadData,
            token: token.data.uploadToken
        })
    }

    /**
     * 上传图片之前
     */
    const beforeUpload = (file) => {
        const isPngJpg = file.type === "image/jpeg" || file.type === "image/png"
        // 验证图片格式
        if (!isPngJpg) {
            message.error("你只能上传 JPG/PNG 文件!").then(res => {
            });
            return false;
        }

        // 验证上传图片大小
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("图片必须小于 2MB!").then(res => {
            });
            return false;
        }

        // 先把图片格式处理好后，在赋值给七牛所需要的key
        const ext = file.type.split("/")[1];
        setUploadData({
            ...uploadData,
            key: `${uuidv4()}.${ext}`
        })
    }

    /**
     * 上传状态发生变化
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
    }

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

    /**
     * 修改管理员状态
     * @param checked
     */
    const handleAdmin = (checked,) => {
        // setAdmin(checked)
        message.success("修改管理员状态成功").then(res => {
        })
    }

    useEffect(() => {
        init().then()
    }, []);

    //提交表单
    const onFinish = async (values) => {
        values = {
            ...values,
            avatar:imageUrl
        }
        console.log(333, values)
        const res = await updateUser(params.id, values)
        if (res.code !== 20000) {
            return message.error(res.message)
        }
        message.success(res.message)
        navigate("/users")
    };


    return (
        <Form
            form={formData}
            name="basic"
            labelCol={{
                span: 2,
            }}
            wrapperCol={{
                span: 22,
            }}
            initialValues={{
                sort: 1,
            }}
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item
                label="用户名"
                name="username"
                rules={rules.username}
            >
                <Input/>
            </Form.Item>


            <Form.Item label="修改头像">
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

            <Form.Item
                label="签名"
                name="signature"
            >
                <Input/>
            </Form.Item>

            <Form.Item
                label="公司 学校"
                name="company"
            >
                <Input/>
            </Form.Item>

            <Form.Item label="个人介绍" name="introduce">
                <TextArea rows={4}/>
            </Form.Item>

            <Form.Item name="admin" label="设置管理员" valuePropName='checked'>
                <Switch onClick={handleAdmin}/>
            </Form.Item>

            <Form.Item label="性别">
                <Select className="sex-input" allowClear={true} disabled={true} placeholder={sex}>
                    <Select.Option value="man">男</Select.Option>
                    <Select.Option value="woman">女</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="oldPassword"
                label="原始密码"
                rules={[
                    {
                        required: true,
                        message: '请输入原始密码!',
                    },
                ]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: '请输入原始密码!',
                    },
                ]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>



            <Form.Item
                name="passwordConfirm"
                label="确认密码"
                dependencies={['passwordConfirm']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: '请输入确认密码',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('两次密码不一致'));
                        },
                    }),
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 2,
                    span: 10,
                }}
            >
                <Button type="primary" htmlType="submit" className={'submit-button'}>
                    更新
                </Button>
            </Form.Item>
        </Form>
    );
};
export default App;
