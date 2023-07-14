import { Input, Table, message, Tooltip } from "antd";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Layout, theme, Tag } from "antd";
import { fetchAllDataForEnrolle, fetchEnrolle } from "../http/statementApi";
const { Header, Content, Footer } = Layout;
const { Search } = Input;

const UserPage = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const screenWidth = window.screen.width;

  let { snils } = useParams();
  const [loading, setLoading] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [tablesData, setTablesData] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchAllDataForEnrolle(
      snils?.includes("_") ? snils.replaceAll("_", " ") : snils
    )
      .then((data) => {
        setTablesData(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const searchEnrolle = (value) => {
    setIsLoadingSearch(true);
    fetchEnrolle(value)
      .then((data) => {
        if (data === true) {
          setIsLoadingSearch(false);
          navigate(
            `/abiturient/${
              value.lenght !== 0
                ? value.includes(" ")
                  ? value.replaceAll(" ", "_")
                  : value
                : value
            }`
          );
        } else {
          setIsLoadingSearch(false);
          message.error(`Пользователь со СНИЛСом ${value} не найден`);
        }
      })
      .catch((err) => {
        setIsLoadingSearch(false);
      });
  };

  const columns = [
    {
      title: "СНИЛС",
      dataIndex: "snils",
      key: "snils",
      width: "10%",
      align: "center",
      render: (text) => {
        if (text !== null && text !== undefined) {
          if (text.length !== 0) {
            return (
              <Link
                to={`/abiturient/${
                  text.includes(" ") ? text.replaceAll(" ", "_") : text
                }`}
              >
                {text}
              </Link>
            );
          }
        }
      },
    },
    {
      title: "Приоритет",
      dataIndex: "priority",
      key: "priority",
      width: "2%",
      align: "center",
    },
    {
      title: "Сумма баллов с ИД",
      dataIndex: "sumBal_ID",
      key: "sumBal_ID",
      width: "6%",
      align: "center",
    },
    {
      title: "Сумма баллов по предметам",
      dataIndex: "sumBal",
      key: "sumBal",
      width: "5%",
      align: "center",
    },
    {
      title: "Русский язык",
      dataIndex: "pred_1",
      key: "pred_1",
      width: "4%",
      align: "center",
    },
    {
      title: (
        <Tooltip title="Информатика/Физика/Общая энергетика/Прикладная информатика/Экономическая теория/Химия/Биология">
          <span>Предмет по выбору</span>
        </Tooltip>
      ),
      dataIndex: "pred_2",
      key: "pred_2",
      width: "4%",
      align: "center",
    },
    {
      title: "Математика/ ПМ",
      dataIndex: "pred_3",
      key: "pred_3",
      width: "4%",
      align: "center",
    },
    {
      title: (
        <Tooltip title="Индивидуальные достижения">
          <span>ИД</span>
        </Tooltip>
      ),
      dataIndex: "sumBal_OnlyID",
      key: "sumBal_OnlyID",
      width: "3%",
      align: "center",
    },
    {
      title: "Наименование направления",
      dataIndex: "napravlenie",
      key: "napravlenie",
      width: "15%",
    },
    {
      title: "Наименование профиля",
      dataIndex: "profil",
      key: "profil",
      width: "15%",
    },
    {
      title: "Оригинал",
      dataIndex: "originalDiplom",
      key: "originalDiplom",
      width: "5%",
      render: (text) => {
        if (text === "Да") {
          return (
            <Tag color="#4CBB17" key={text}>
              {text}
            </Tag>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Нуждаемость в общежитии",
      dataIndex: "needRoom",
      key: "needRoom",
      width: "8%",
    },
  ];
  return (
    <Layout className="layout">
      {screenWidth < 900 ? (
        <Header
          theme="light"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
            width: screenWidth,
          }}
        >
          <a href="https://kgeu.ru/" target="_blank" rel="noopener">
            <div
              className="demo-logo"
              style={{ color: "white", fontWeight: "bold", fontSize: 19 }}
            >
              КГЭУ
            </div>
          </a>
          <Search
            placeholder="СНИЛС"
            allowClear
            enterButton="Найти"
            size="small"
            style={{ width: 220 }}
            onSearch={(value) => {
              searchEnrolle(value);
            }}
            loading={isLoadingSearch}
          />
        </Header>
      ) : (
        <Header
          theme="light"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a href="https://kgeu.ru/" target="_blank" rel="noopener">
            <div
              className="demo-logo"
              style={{ color: "white", fontWeight: "bold", fontSize: 24 }}
            >
              КГЭУ
            </div>
          </a>
          <Search
            placeholder="СНИЛС"
            allowClear
            enterButton="Найти"
            size="middle"
            style={{ width: "auto" }}
            onSearch={(value) => {
              searchEnrolle(value);
            }}
            loading={isLoadingSearch}
          />
        </Header>
      )}
      {screenWidth < 900 ? (
        <Content
          style={{
            padding: "0 5px 0 5px",
            marginTop: 10,
            minHeight: "630px",
          }}
        >
          <div
            className="site-layout-content"
            style={{
              background: colorBgContainer,
            }}
          >
            <h1
              style={{
                marginLeft: 10,
                marginTop: 10,
                marginRight: 10,
                fontSize: 25,
              }}
            >
              Cводка заявлений абитуриента{" "}
              <Link to="" style={{ color: "#1677ff", fontSize: 25 }}>
                {snils?.includes("_") ? snils.replaceAll("_", " ") : snils}
              </Link>{" "}
              в 2023 году
            </h1>
            <>
              <Table
                columns={columns}
                dataSource={tablesData}
                rowKey={(record) => record.key}
                bordered
                loading={loading}
                pagination={false}
                size="small"
                scroll={{
                  x: 1200,
                  //y: 285,
                }}
                style={{ margin: 10 }}
              />
            </>
          </div>
        </Content>
      ) : (
        <Content
          style={{
            padding: "0 50px",
            marginTop: 16,
            paddingTop: "10px",
            minHeight: "630px",
          }}
        >
          <div
            className="site-layout-content"
            style={{
              background: colorBgContainer,
            }}
          >
            <h1 style={{ marginLeft: 10, marginTop: 10, fontSize: 30 }}>
              Cводка заявлений абитуриента{" "}
              <Link to="" style={{ color: "#1677ff", fontSize: 30 }}>
                {snils?.includes("_") ? snils.replaceAll("_", " ") : snils}
              </Link>{" "}
              в 2023 году
            </h1>

            <>
              <Table
                columns={columns}
                dataSource={tablesData}
                bordered
                loading={loading}
                pagination={false}
                size="small"
                scroll={{
                  x: 1200,
                  //y: 285,
                }}
                style={{ margin: 10 }}
              />
            </>
          </div>
        </Content>
      )}

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
export default UserPage;
