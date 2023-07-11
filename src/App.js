import {
  Input,
  Layout,
  theme,
  Radio,
  Select,
  Button,
  Space,
  Table,
  message,
  Tag,
} from "antd";
import { useState, useEffect, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {
  fetchAllDirections,
  fetchAllData,
  fetchEnrolle,
} from "./http/statementApi";
import { Link, useNavigate } from "react-router-dom";
const { Header, Content, Footer } = Layout;
const { Search } = Input;

const data = [
  {
    sumBall: 243,
    napravlenie: "Информатика и вычислительная техника",
    levelTraining: "Бакалавриат",
    foundationReceipts: "Бюджетная основа",
    admissionCategory: "Имеющие особое право",
    naprav_Group: "09.03.01_О_Б_ОП_Информатика и вычислительная техника",
    profil: "Информационные системы управления бизнес-процессами",
    prioritet: 1,
    typeIsp: "Собственные",
    haveDiplomInVus: "Да",
    idEnrolle: 145290,
    snils: "169-969-534 63",
    sumBall_ID: 253,
    soglasie: "Нет",
  },
  {
    sumBall: 243,
    napravlenie: "Информатика и вычислительная техника",
    levelTraining: "Бакалавриат",
    foundationReceipts: "Бюджетная основа",
    admissionCategory: "Имеющие особое право",
    naprav_Group: "09.03.01_О_Б_ОП_Информатика и вычислительная техника",
    profil: "Информационные системы управления бизнес-процессами",
    prioritet: 1,
    typeIsp: "Собственные",
    haveDiplomInVus: "Да",
    idEnrolle: 145290,
    snils: "169-969-534 63",
    sumBall_ID: 253,
    soglasie: "Нет",
  },
];

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const [directions, setDirections] = useState([]);
  const [tablesData, setTablesData] = useState([]);

  const [formStudy, setFormStudy] = useState("Бакалавриат");
  const [levelTraining, setLevelTraining] = useState("Очная");
  const [direction, setDirection] = useState(null);
  const [reasonAdmission, setReasonAdmission] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  //const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchAllDirections(levelTraining, formStudy).then((data) => {
      setDirections(data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAllData(levelTraining, formStudy, direction, reasonAdmission)
      .then((data) => {
        setTablesData(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [formStudy, levelTraining, direction, reasonAdmission]);

  let listDirections = [];

  const createListDirections = (directions) => {
    listDirections = directions?.map((dir) => ({
      key: dir,
      value: dir,
      label: dir,
    }));
  };
  createListDirections(directions);

  const searchEnrolle = (value) => {
    setIsLoadingSearch(true);
    fetchEnrolle(value).then((data) => {
      if (data === true) {
        setIsLoadingSearch(false);
        navigate(`/abiturient/${value}`);
      } else {
        setIsLoadingSearch(false);
        message.error(`Пользователь со СНИЛСом ${value} не найден`);
      }
    });
  };

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
          placeholder={`Название института`}
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
      ...getColumnSearchProps("snils"),
      render: (text) => {
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
      },
    },
    {
      title: "Приоритет",
      dataIndex: "prioritet",
      key: "prioritet",
      width: "5%",
    },
    {
      title: "Сумма баллов с ИД",
      dataIndex: "sumBall_ID",
      key: "sumBall_ID",
      width: "8%",
    },
    {
      title: "Сумма баллов по предметам",
      dataIndex: "sumBall",
      key: "sumBall",
      width: "5%",
    },
    {
      title: "ПМ/М",
      dataIndex: "sumBall_ID",
      key: "sumBall_ID",
      width: "5%",
    },
    {
      title: "ФИЗ/ИНФ",
      dataIndex: "sumBall_ID",
      key: "sumBall_ID",
      width: "5%",
    },
    {
      title: "Русский язык",
      dataIndex: "sumBall_ID",
      key: "sumBall_ID",
      width: "5%",
    },
    {
      title: "Индивидуальные достижения",
      dataIndex: "sumBall_ID",
      key: "sumBall_ID",
      width: "5%",
    },
    {
      title: "Оригинал",
      dataIndex: "haveDiplomInVus",
      key: "haveDiplomInVus",
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
    //  {
    //    title: "Наименование направления",
    //    dataIndex: "napravlenie",
    //    key: "napravlenie",
    //    width: "auto",
    //    ...getColumnSearchProps("napravlenie"),
    //  },
    //  {
    //    title: "Наименование профиля",
    //    dataIndex: "profil",
    //    key: "profil",
    //    width: "auto",
    //    ...getColumnSearchProps("profil"),
    //  },
    {
      title: "Нуждаемость в общежитии",
      dataIndex: "soglasie",
      key: "soglasie",
      width: "8%",
    },
  ];

  //  const directions = [
  //    "Автоматизация технологических процессов и производств",
  //    "Водные биоресурсы и аквакультура",
  //    "Информатика и вычислительная техника",
  //    "Менеджмент",
  //    "Мехатроника и робототехника",
  //    "Прикладная информатика",
  //    "Прикладная математика",
  //    "Реклама и связи с общественностью",
  //    "Социология",
  //    "Теплоэнергетика и теплотехника",
  //    "Техносферная безопасность",
  //    "Экономика",
  //    "Электроника и наноэлектроника",
  //    "Электроэнергетика и электротехника",
  //    "Энергетическое машиностроение",
  //  ];

  //   const profiles = [
  //     "Информационные системы управления бизнес-процессами",
  //     "Технологии разработки информационных систем и web-приложений",
  //     "Технологии разработки программного обеспечения",
  //   ];

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
        <div className="demo-logo" style={{ color: "white" }}>
          КГЭУ
        </div>

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
            Cводка приема заявлений абитуриентов в 2023 году
          </h1>
          <div style={{ marginLeft: 10, fontWeight: "600" }}>
            Уровень образования:
            <Radio.Group
              defaultValue="Бакалавриат"
              buttonStyle="solid"
              size="middle"
              style={{ margin: 10, width: "auto" }}
              onChange={(value) => setLevelTraining(value)}
            >
              <Radio.Button value="Бакалавриат">
                Бакалавриат/специалитет
              </Radio.Button>
              <Radio.Button value="Магистратура">Магистратура</Radio.Button>
            </Radio.Group>
          </div>
          <div style={{ marginLeft: 10, fontWeight: "600" }}>
            Форма обучения:
            <Radio.Group
              defaultValue="Очная"
              buttonStyle="solid"
              size="middle"
              style={{ margin: 10 }}
              onChange={(value) => setFormStudy(value)}
            >
              <Radio.Button value="Очная">Очная</Radio.Button>
              <Radio.Button value="Очно-заочная">Очно-заочная</Radio.Button>
              <Radio.Button value="Заочная">Заочная</Radio.Button>
            </Radio.Group>
          </div>
          <div style={{ marginLeft: 10, fontWeight: "600" }}>
            Направление:
            <Select
              showSearch
              style={{
                margin: 10,
                width: "500",
              }}
              placeholder="Введите название направления"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={listDirections}
              onChange={(value) => setDirection(value)}
            />
          </div>
          <div style={{ marginLeft: 10, fontWeight: "600" }}>
            Основание поступления:
            <Select
              showSearch
              style={{
                margin: 10,
                width: "500",
              }}
              placeholder="Введите название направления"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                { value: "На общих основаниях", label: "На общих основаниях" },
                { value: "Целевая квота", label: "Целевая квота" },
                { value: "Отдельная квота", label: "Отдельная квота" },
                { value: "Специальная квота", label: "Специальная квота" },
                {
                  value: "Полное возмещение затрат",
                  label: "Полное возмещение затрат",
                },
              ]}
              onChange={(value) => setReasonAdmission(value)}
            />
          </div>
          {/* <Outlet /> */}
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
export default App;
