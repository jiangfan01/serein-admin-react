import {Outlet, useNavigate, useNavigation,} from "react-router-dom";
import {Layout, Breadcrumb, message} from "antd";
import SiderBar from "../../components/layout/SiderBar.jsx";
import {useEffect, useState} from "react";
import {getMe} from "../../api/users.js";
import {LoginOutlined} from "@ant-design/icons";
import {removeToken} from "../../../utils/auth.js";

const { Header, Content } = Layout;


export default function Root() {
    const [data,setData] = useState({})
    const navigate = useNavigate();
    const init = async () => {
        const res = await getMe()
        setData(res.data.user)
    }
    const logout = () => {
        removeToken()
        navigate(`/login`)
        return message.success("退出成功")
    }


    useEffect(() => {
        init().then();
    }, []);

    return (
        <Layout>
            <Header className="header" style={{display:"flex",alignItems:"center",cursor:"pointer"}} title="退出登录">
                <div className="logo"><img src={data.avatar} alt="logo"/></div>
                <div className="header-title">课程后台管理系统</div>
                <LoginOutlined style={{color:"rgb(250, 128, 114)",fontSize:28,marginLeft:20,}} onClick={logout} />
            </Header>
            <Layout>
                {/* 侧边栏菜单 */}
                <SiderBar />

                {/* 右侧正文内容 */}
                <Layout style={{ padding: "0 24px 24px" }}>
                    <Breadcrumb style={{ margin: "16px 0" }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}
