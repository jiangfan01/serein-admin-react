import {Button, Checkbox, Form, Input, message} from 'antd';
import React from 'react';
import {login} from "../../api/auth";
import {setToken} from "../../../utils/auth";
import {useNavigate} from "react-router-dom";

const App = () => {

    const navigate = useNavigate();
    const onFinish = async (values) => {
        const res = await login(values)
        if (res.code !== 20000) {
            return message.error(res.message)
        }
        setToken(res.data.token, values.remember)
        navigate("/")
    };

    return (
        <>
            <div className="login">
                <Form
                    name="basic"

                    style={{
                        maxWidth: 699,
                        margin: "0 auto ",
                        paddingTop: "10%"
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <div className="login-title" style={{textAlign:"center",fontSize:28}}>
                        <p>Serein of Class Backstage</p>
                    </div>
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码!',
                            },
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        style={{display:"flex",justifyContent:"center"}}
                    >
                        <Button type="primary" htmlType="submit" >
                            登录
                        </Button>
                        <Checkbox style={{marginLeft:10}}>记住我</Checkbox>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
};
export default App;