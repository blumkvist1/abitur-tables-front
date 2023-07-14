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
  Checkbox,
  Tooltip,
  Tag,
} from "antd";
import { useState, useEffect, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { fetchAllData, fetchEnrolle } from "./http/statementApi";
import { Link, useNavigate } from "react-router-dom";
import {
  bakalavrOchnaya,
  bakalavrOchnoZaochnaya,
  bakalavrZaochnaya,
  magistrOchnaya,
  magistrOchnoZaochnaya,
  magistrZaochnaya,
  data,
} from "./data";
const { Header, Content, Footer } = Layout;
const { Search } = Input;

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const screenWidth = window.screen.width;
  const navigate = useNavigate();

  let listDirections = [];

  const [directions, setDirections] = useState([]);
  const [tablesData, setTablesData] = useState([]);

  const [formStudy, setFormStudy] = useState("Очная");
  const [levelTraining, setLevelTraining] = useState("Бакалавриат");
  const [direction, setDirection] = useState(null);
  const [reasonAdmission, setReasonAdmission] = useState("На общих основаниях");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [onlyOriginal, setOnlyOriginal] = useState(false);

  const createListDirections = (directions) => {
    listDirections = directions?.map((dir) => ({
      key: dir,
      value: dir,
      label: dir,
    }));
  };

  useEffect(() => {
    setDirections(null);
    if (levelTraining === "Бакалавриат") {
      if (formStudy === "Очная") {
        setDirections(bakalavrOchnaya);
      } else if (formStudy === "Очно-заочная") {
        setDirections(bakalavrOchnoZaochnaya);
      } else {
        setDirections(bakalavrZaochnaya);
      }
    } else {
      if (formStudy === "Очная") {
        setDirections(magistrOchnaya);
      } else if (formStudy === "Очно-заочная") {
        setDirections(magistrOchnoZaochnaya);
      } else {
        setDirections(magistrZaochnaya);
      }
    }
    setDirection(listDirections[0]?.value);
  }, [levelTraining, formStudy, directions]);

  createListDirections(directions);

  useEffect(() => {
    setLoading(true);
    fetchAllData(
      levelTraining,
      formStudy,
      direction,
      reasonAdmission,
      onlyOriginal
    )
      .then((data) => {
        setTablesData(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [formStudy, levelTraining, direction, reasonAdmission, onlyOriginal]);

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
      width: "3%",
      align: "center",
    },
    {
      title: "СНИЛС",
      dataIndex: "snils",
      key: "snils",
      width: "8%",
      align: "center",
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
      width: "2%",
      align: "center",
      showSorterTooltip: false,
      sorter: (a, b) => a.priority - b.priority,
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
      title: "Тип вступительных испытьаний",
      dataIndex: "typeIsp",
      key: "typeIsp",
      width: "8%",
      align: "center",
    },
    {
      title: "Оригинал",
      dataIndex: "originalDiplom",
      key: "originalDiplom",
      width: "5%",
      align: "center",

      filters: [
        {
          text: "Только с оригиналом",
          value: "Да",
        },
      ],
      render: (text) => {
        if (text === "Да") {
          return (
            <Tag color="#4CBB17" key={text}>
              {text.toUpperCase()}
            </Tag>
          );
        } else {
          return text;
        }
      },
      onFilter: (value, record) => record.originalDiplom?.indexOf(value) === 0,
    },
    {
      title: "Нуждаемость в общежитии",
      dataIndex: "needRoom",
      key: "needRoom",
      width: "8%",
      align: "center",
    },
  ];

  const columnsMag = [
    {
      title: "№",
      dataIndex: "key",
      rowScope: "row",
      width: "3%",
      align: "center",
    },
    {
      title: "СНИЛС",
      dataIndex: "snils",
      key: "snils",
      width: "8%",
      align: "center",
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
      title: "Междисциплинарный экзамен",
      dataIndex: "pred_1",
      key: "pred_1",
      width: "5%",
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
      width: "5%",
      align: "center",
    },
    {
      title: "Оригинал",
      dataIndex: "originalDiplom",
      key: "originalDiplom",
      width: "5%",
      align: "center",
      filters: [
        {
          text: "Только с оригиналом",
          value: "Да",
        },
      ],
      render: (text) => {
        if (text === "Да") {
          return (
            <Tag color="#4CBB17" key={text}>
              {text.toUpperCase()}
            </Tag>
          );
        } else {
          return text;
        }
      },
      onFilter: (value, record) => record.originalDiplom?.indexOf(value) === 0,
    },
    {
      title: "Нуждаемость в общежитии",
      dataIndex: "needRoom",
      key: "needRoom",
      width: "8%",
      align: "center",
    },
  ];

  //   const profiles = [
  //     "Информационные системы управления бизнес-процессами",
  //     "Технологии разработки информационных систем и web-приложений",
  //     "Технологии разработки программного обеспечения",
  //   ];

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
            padding: "0 5px",
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
            <h1 style={{ marginLeft: 10, marginTop: 10, fontSize: 25 }}>
              Cводка приема заявлений абитуриентов в 2023 году
            </h1>
            <div style={{ marginLeft: 10, fontWeight: "600" }}>
              Уровень образования:
              <Radio.Group
                defaultValue="Бакалавриат"
                buttonStyle="solid"
                size="middle"
                style={{ margin: 10, marginLeft: 0, width: "auto" }}
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
                style={{ margin: 10, marginLeft: 0 }}
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
                value={direction}
                defaultValue={direction}
                style={{
                  margin: 10,
                  marginLeft: 0,
                  width: screenWidth - 34,
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
                  marginLeft: 0,
                  width: screenWidth - 34,
                }}
                defaultValue={reasonAdmission}
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
                  {
                    value: "На общих основаниях",
                    label: "На общих основаниях",
                  },
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
            <>
              <Table
                columns={levelTraining === "Бакалавриат" ? columns : columnsMag}
                dataSource={tablesData}
                rowKey={(record) => record.key}
                bordered
                title={() => (
                  <div style={{ width: screenWidth - 40 }}>
                    <p>{direction}</p>
                    <p>{reasonAdmission}</p>

                    <div>
                      <Checkbox
                        style={{
                          fontWeight: "600",
                          width: screenWidth - 34,
                        }}
                        onChange={(e) => setOnlyOriginal(e.target.checked)}
                      >
                        Показать только оригинал
                      </Checkbox>
                    </div>
                  </div>
                )}
                loading={loading}
                pagination={{ pageSize: 25 }}
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
                value={direction}
                defaultValue={direction}
                style={{
                  margin: 10,
                  width: 450,
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
                  width: 378,
                }}
                defaultValue={reasonAdmission}
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
                  {
                    value: "На общих основаниях",
                    label: "На общих основаниях",
                  },
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
                title={() => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p>{direction}</p>
                      <p>{reasonAdmission}</p>
                    </div>
                    <div>
                      <Checkbox
                        style={{ marginLeft: 10, fontWeight: "600" }}
                        onChange={(e) => setOnlyOriginal(e.target.checked)}
                      >
                        Показать только оригинал
                      </Checkbox>
                    </div>
                  </div>
                )}
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
export default App;
