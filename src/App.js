import { Input, Layout,  theme} from "antd";
import { Outlet } from "react-router-dom";
const { Header, Content, Footer } = Layout;
const { Search } = Input;

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout className="layout">
      <Header
        theme="light"
        style={{
          display: "flex",
          alignItems: "center",
			 justifyContent: "space-between"
        }}
      >
        <div className="demo-logo" style={{color: "white"}}>
          КГЭУ
        </div>

		  <Search
      placeholder="ID или СНИЛС"
      allowClear
      enterButton="Поиск"
      size="middle"
		style={{width:"auto"}}
      onSearch={()=>{}}
    />
      </Header>
      <Content
        style={{
          padding: "0 50px",
          marginTop: 16,
			 paddingTop: "10px",
			 minHeight: "630px"
        }}
      >
        <div
          className="site-layout-content"
          style={{
            background: colorBgContainer,
          }}
        >
          <Outlet/>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        ©2023 Created by KGEU
      </Footer>
    </Layout>
  );
};
export default App;
