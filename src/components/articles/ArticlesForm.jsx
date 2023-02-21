import {Button, Form, Input, InputNumber, message} from 'antd';
import {Link, useNavigate, useParams} from "react-router-dom";
import {createArticle, updateArticle} from "../../api/articles.js";
import {fetchArticle} from "../../api/pages.js";
import {useEffect, useState} from "react";
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';

const rules = {
    title: [{required: true, message: "请填写文章标题!"}],
    content: [{required: true, message: "请填写内容!"}]
}

const App = (props) => {
    const navigate = useNavigate();
    const params = useParams();
    const [formData] = Form.useForm();
    const [contentHtml, setContentHtml] = useState("")
    const [content, setContent] = useState("")
    //查询单条
    const init = async () => {
        const res = await fetchArticle(params.id)
        formData.setFieldsValue(res.data.article)
        setContent(res.data.article.content)
    }

    useEffect(() => {
        if (props.isEdit) {
            init().then()
        }
    }, []);


    //提交表单
    const onFinish = async (values) => {
        let res
        values = {
            ...values,
            content,
            contentHtml
        }
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


    const mdParser = new MarkdownIt(/* Markdown-it options */);

    const handleEditorChange = ({html, text}) => {
        setContentHtml(html)
        setContent(text)
    }

    const renderHTML = (text) => {
        // 模拟异步渲染Markdown
        return new Promise((resolve) => {
            resolve(mdParser.render(text))
        })
    }

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
                <Input/>
            </Form.Item>

            <Form.Item
                label="文章内容"
                name="content"
                rules={rules.content}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="文章内容"
            >
                <MdEditor value={content} style={{height: '500px', paddingLeft: "50"}} renderHTML={renderHTML}
                          onChange={handleEditorChange}
                />
            </Form.Item>
            <Form.Item
                label="查看详情"
            >
                <Link to={`/show_article/${params.id}`}>
                    <Button size="large">查看详细</Button>
                </Link>
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
