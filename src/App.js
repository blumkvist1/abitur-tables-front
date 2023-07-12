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

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const [directions, setDirections] = useState([]);
  const [tablesData, setTablesData] = useState([]);

  const [formStudy, setFormStudy] = useState("Очная");
  const [levelTraining, setLevelTraining] = useState("Бакалавриат");
  const [direction, setDirection] = useState(null);
  const [reasonAdmission, setReasonAdmission] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  useEffect(() => {
    fetchAllDirections(levelTraining, formStudy)
      .then((data) => {
        setDirection(null);
        setDirections(data);
      })
      .catch((err) => {});
  }, [levelTraining, formStudy]);

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
      width: "4%",
    },
    {
      title: "Сумма баллов по предметам",
      dataIndex: "sumBal",
      key: "sumBal",
      width: "5%",
    },
    {
      title: "Русский язык",
      dataIndex: "pred_1",
      key: "pred_1",
      width: "4%",
    },
    {
      title:
        "Информатика/Физика/Общая энергетика/Прикладная информатика/Эконом теория/Химия/Биология",
      dataIndex: "pred_2",
      key: "pred_2",
      width: "4%",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Математика/ ПМ",
      dataIndex: "pred_3",
      key: "pred_3",
      width: "4%",
      // ellipsis: {
      // 	showTitle: false,
      //  },
    },
    {
      title: "Индивидуальные достижения",
      dataIndex: "sumBal_OnlyID",
      key: "sumBal_OnlyID",
      width: "5%",
    },
    {
      title: "Тип вступительных испытьаний",
      dataIndex: "typeIsp",
      key: "typeIsp",
      width: "8%",
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

  const columnsMag = [
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
      title: "Междисциплинарный экзамен",
      dataIndex: "pred_1",
      key: "pred_1",
      width: "5%",
    },

    {
      title: "Индивидуальные достижения",
      dataIndex: "sumBal_OnlyID",
      key: "sumBal_OnlyID",
      width: "5%",
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
              onChange={(e) => setLevelTraining(e.target.value)}
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
              onChange={(e) => setFormStudy(e.target.value)}
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
                width: "600",
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
                width: "600",
              }}
              placeholder="Выберите основание поступления"
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
                { value: "Ососбая квота", label: "Ососбая квота" },
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
              columns={levelTraining === "Бакалавриат" ? columns : columnsMag}
              dataSource={tablesData}
              rowKey={(record) => record.key}
              bordered
              //pagination={false}
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
