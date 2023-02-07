import { useNavigate } from "react-router-dom";
import { PieChartOutlined, UserOutlined, VideoCameraOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";

const { Sider } = Layout;

const SiderBar = () => {
    const navigate = useNavigate();
    const items = [
        {
            label: "首页",
            key: "/",
            icon: <PieChartOutlined />
        },
        {
            label: "新闻管理",
            key: "/articles",
            icon: <UnorderedListOutlined />
        },
        {
            label: "视频管理",
            key: "video",
            icon: <VideoCameraOutlined />,
            children: [
                {
                    label: "分类管理",
                    key: "/categories"
                },
                {
                    label: "课程",
                    key: "/courses"
                }
            ]
        },
        {
            label: "系统管理",
            key: "system",
            icon: <UserOutlined />,
            children: [
                {
                    label: "用户管理",
                    key: "/users"
                },
                {
                    label: "其他",
                    key: "/others"
                }
            ]
        }
    ];

    /**
     * 点击后跳转
     * @param e
     */
    const onClick = (e) => {
        navigate(e.key);
    };

    return (
        <Sider width={200} className="site-layout-background">
            <Menu
                mode="inline"
                onClick={onClick}
                style={{ height: "100%", borderRight: 0 }}
                items={items}
                defaultOpenKeys={["video", "system"]}
            />
        </Sider>
    )
}
export default SiderBar;
