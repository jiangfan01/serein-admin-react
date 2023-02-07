import {Button, Form, Input, InputNumber, message} from 'antd';
import {useNavigate, useParams} from "react-router-dom";
import {createArticle, fetchArticle, updateArticle} from "../../api/articles.js";
import {useEffect, useState} from "react";

const rules = {
    title: [{ required: true, message: "请填写文章标题!" }],
    content: [{ required: true, message: "请填写内容!" }]
}

const App = (props) => {
    console.log(props)
    const navigate = useNavigate();
    const params = useParams();
    const [formData] = Form.useForm();

    //查询单条
    const init = async () => {
        const res = await fetchArticle(params.id)
        formData.setFieldsValue(res.data.article)
    }

    useEffect(() => {
        if (props.isEdit) {
            init().then()
        }
    }, []);


    //提交表单
    const onFinish = async (values) => {
        let res

        if (props.isEdit) {
            res = await updateArticle(params.id, values)
        } else {
            res = await createArticle(values)
        }

        if (res.code !== 20000) {
            return message.error(res.message)
        }

        message.success(res.message)
        navigate("/articles")
    };


    return (
        <Form
            form={formData}
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
                label="文章标题"
                name="title"
                rules={rules.title}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="文章内容"
                name="content"
                rules={rules.content}
            >
                <Input />
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
    );
};
export default App;
