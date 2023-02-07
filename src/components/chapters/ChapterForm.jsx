import {Button, Form, Input, InputNumber, message,} from 'antd';
import React, {useEffect, useState} from "react";
import {createChapter, fetchChapter, updateChapter} from "../../api/chapters.js";
import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";

const {TextArea} = Input;


const rules = {
    title: [{required: true, message: "请填写章节标题!"}],
    video: [
        {required: true, message: "请填写视频地址!"},
        {type: 'url', warningOnly: true, message: "不是一个有效的URL!"}
    ],
    content: [{required: true, message: "请填写章节内容!"}]
};
const App = (props) => {
    const navigate = useNavigate();
    const params = useParams();
    const [form] = Form.useForm();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("courseId")
    const init = async () => {
        const res = await fetchChapter(params.id)
        console.log(courseId)
        form.setFieldsValue(res.data.chapter)
    }

    useEffect(() => {
        if (props.isEdit) {
            init().then()
        }
    }, []);

    const onFinish = async (values) => {
        values = {
            ...values,
            courseId
        }
        let res
        if (props.isEdit) {
           res = await updateChapter(params.id, values)
        } else {
           res = await createChapter(values)
        }

        if (res.code !== 20000) {
            return message.error(res.message)
        }
        message.success(res.message)
        navigate(`/chapters?courseId=${courseId}`)
    };

    return (
        <>

            <Form
                form={form}
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="章节标题"
                    name="title"
                    rules={rules.title}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="视频地址"
                    name="video"
                    rules={rules.video}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="排序"
                    name="sort"
                    rules={rules.sort}
                >
                    <InputNumber min={1} max={99}/>
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
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        {props.isEdit ? "更新" : "创建"}
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
};
export default App;