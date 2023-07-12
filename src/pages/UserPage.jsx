import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, message } from "antd";
import { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
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

  let { snils } = useParams();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
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

  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Введите СНИЛС`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Поиск
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 80,
            }}
          >
            Сброс
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Фильтр
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Закрыть
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "№",
      dataIndex: "key",
      rowScope: "row",
      width: "5%",
    },
    {
      title: "СНИЛС",
      dataIndex: "snils",
      key: "snils",
      width: "10%",
      //...getColumnSearchProps("snils"),
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
      width: "5%",
    },
    {
      title: "Сумма баллов с ИД",
      dataIndex: "sumBal_ID",
      key: "sumBal_ID",
      width: "8%",
    },
    {
      title: "Сумма баллов по предметам",
      dataIndex: "sumBal",
      key: "sumBal",
      width: "5%",
    },
    {
      title: "ПМ/М",
      dataIndex: "pred_1",
      key: "pred_1",
      width: "5%",
    },
    {
      title: "ФИЗ/ИНФ",
      dataIndex: "pred_2",
      key: "pred_2",
      width: "5%",
    },
    {
      title: "Русский язык",
      dataIndex: "pred_3",
      key: "pred_3",
      width: "5%",
    },
    {
      title: "Химия",
      dataIndex: "pred_4",
      key: "pred_4",
      width: "5%",
    },
    {
      title: "Индивидуальные достижения",
      dataIndex: "sumBal_OnlyID",
      key: "sumBal_OnlyID",
      width: "5%",
    },
    {
      title: "Наименование направления",
      dataIndex: "napravlenie",
      key: "napravlenie",
      width: "auto",
      //...getColumnSearchProps("napravlenie"),
    },
    {
      title: "Наименование профиля",
      dataIndex: "profil",
      key: "profil",
      width: "auto",
      //...getColumnSearchProps("profil"),
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
            searchEnrolle(value.trim());
          }}
          loading={isLoadingSearch}
        />
      </Header>
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
            <Link to="" style={{ color: "blue", fontSize: 30 }}>
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
