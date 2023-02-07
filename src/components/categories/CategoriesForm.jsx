import {Button, Form, Input, InputNumber, message} from 'antd';
import {useNavigate, useParams} from "react-router-dom";
import {createCategory, fetchCategory, updateCategory} from "../../api/categories.js";
import {useEffect, useState} from "react";

const rules = {
    name: [{ required: true, message: "请填写分类名称!" }],
    sort: [{ required: true, message: "请填写排序!" }]
}

const App = (props) => {
    const navigate = useNavigate();
    const params = useParams();
    const [formData] = Form.useForm();

    //查询单条
    const init = async () => {
        const res = await fetchCategory(params.id)
        formData.setFieldsValue(res.data.category)
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
            res = await updateCategory(params.id, values)
        } else {
            res = await createCategory(values)
        }

        if (res.code !== 20000) {
            return message.error(res.message)
        }

        message.success(res.message)
        navigate("/categories")
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
                label="分类名称"
                name="name"
                rules={rules.name}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="排序"
                name="sort"
                rules={rules.sort}
            >
                <InputNumber min={1} max={99} />
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
