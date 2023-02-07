import { Outlet,  useNavigation, } from "react-router-dom";
import { Layout,  Breadcrumb } from "antd";
import SiderBar from "../../components/layout/SiderBar.jsx";
import {useEffect, useState} from "react";
import {getMe} from "../../api/users.js";

const { Header, Content } = Layout;


export default function Root() {
    const [avatar,setAvatar] = useState("")

    const init = async () => {
        // const res = await getMe()
        // console.log(999,res)
        // setAvatar(res.data.)
    }


    useEffect(() => {
        init().then();
    }, []);

    return (
        <Layout>
            <Header className="header">
                <div className="logo"><img src="src/assets/image/86731b6195f4e00f3cec9d9883bcbadf.jpg" alt="logo"/></div>
                <div className="header-title">课程后台管理系统</div>
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
