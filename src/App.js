import {
  Input,
  Layout,
  theme,
  Radio,
  Select,
  message,
  Checkbox,
  Tag,
  Breadcrumb,
} from "antd";
import { useState, useEffect, createContext } from "react";
import {
  HomeOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

import {
  fetchAllData,
  fetchEnrolle,
  getKCP,
  getUpdateDate,
} from "./http/statementApi";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import {
  bakalavrOchnaya,
  bakalavrOchnoZaochnaya,
  bakalavrZaochnaya,
  magistrOchnaya,
  magistrOchnoZaochnaya,
  magistrZaochnaya,
} from "./data";
const { Header, Content, Footer } = Layout;
const { Search } = Input;

export const MainContext = createContext(null);

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const screenWidth = window.screen.width;
  const navigate = useNavigate();
  const { snils } = useParams();

  let location = useLocation();
  let listDirections = [];

  const [direction, setDirection] = useState(null);
  const [directions, setDirections] = useState([]);
  const [tablesData, setTablesData] = useState([]);
  const [kcp, setKcp] = useState(0);
  const [dateUpdate, setDateUpdate] = useState("17.07.2023");
  const [formStudy, setFormStudy] = useState("Очная");
  const [levelTraining, setLevelTraining] = useState("Бакалавриат");
  const [reasonAdmission, setReasonAdmission] = useState("На общих основаниях");

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
  }, [levelTraining, formStudy, directions]);

  createListDirections(directions);

  useEffect(() => {
    setLoading(true);
    getKCP(levelTraining, formStudy, direction, reasonAdmission)
      .then((data) => {
        setKcp(data);
      })
      .catch((err) => console.error(err));
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

  useEffect(() => {
    getUpdateDate()
      .then((data) => setDateUpdate(data))
      .catch((err) => console.error(err));
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
        console.error(err);
        setIsLoadingSearch(false);
      });
  };

  return (
    <MainContext.Provider
      value={{
        levelTraining,
        tablesData,
        loading,
        kcp,
        onlyOriginal,
        setOnlyOriginal,
      }}
    >
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
          <>
            {location.pathname.includes("abiturient") ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Breadcrumb
                  style={{ marginLeft: 8, marginTop: 10 }}
                  items={[
                    {
                      title: (
                        <>
                          <ArrowLeftOutlined style={{ cursor: "pointer" }} />
                        </>
                      ),
                      onClick: () => navigate(-1),
                    },
                    {
                      title: (
                        <>
                          <HomeOutlined style={{ cursor: "pointer" }} />
                          <span style={{ cursor: "pointer" }}>Главная</span>
                        </>
                      ),
                      onClick: () => navigate("/"),
                    },
                    {
                      title: (
                        <>
                          <UserOutlined style={{ cursor: "pointer" }} />
                          <span style={{ cursor: "pointer" }}>
                            {snils?.includes("_")
                              ? snils.replaceAll("_", " ")
                              : snils}
                          </span>
                        </>
                      ),
                      onClick: () => navigate(`abiturient/${snils}`),
                    },
                  ]}
                />
                <div>
                  <div style={{marginRight: 4, marginTop:10}}>
                    Обновлено: <p style={{padding:0, margin:0}}><Tag color="blue">{dateUpdate}</Tag></p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Breadcrumb
                  style={{ marginLeft: 8, marginTop: 10 }}
                  items={[
                    {
                      title: (
                        <>
                          <HomeOutlined />
                          <span>Главная</span>
                        </>
                      ),
                      onClick: () => navigate("/"),
                    },
                  ]}
                />
                <div>
                  <div style={{marginRight: 4, marginTop:10}}>
                    Обновлено: <Tag color="blue">{dateUpdate}</Tag>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {location.pathname.includes("abiturient") ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Breadcrumb
                  style={{ marginLeft: 50, marginTop: 10 }}
                  items={[
                    {
                      title: (
                        <>
                          <ArrowLeftOutlined style={{ cursor: "pointer" }} />
                        </>
                      ),
                      onClick: () => navigate(-1),
                    },
                    {
                      title: (
                        <>
                          <HomeOutlined style={{ cursor: "pointer" }} />
                          <span style={{ cursor: "pointer" }}>Главная</span>
                        </>
                      ),
                      onClick: () => navigate("/"),
                    },
                    {
                      title: (
                        <>
                          <UserOutlined style={{ cursor: "pointer" }} />
                          <span style={{ cursor: "pointer" }}>
                            {snils?.includes("_")
                              ? snils.replaceAll("_", " ")
                              : snils}
                          </span>
                        </>
                      ),
                      onClick: () => navigate(`abiturient/${snils}`),
                    },
                  ]}
                />
                <div>
					 <div style={{ fontWeight: "600", marginRight: 50, marginTop: 10 }}>
                    Обновлено: <Tag color="geekblue">{dateUpdate}</Tag>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Breadcrumb
                  style={{ marginLeft: 50, marginTop: 10 }}
                  items={[
                    {
                      title: (
                        <>
                          <HomeOutlined />
                          <span>Главная</span>
                        </>
                      ),
                      onClick: () => navigate("/"),
                    },
                  ]}
                />
                <div>
                  <div style={{ fontWeight: "600", marginRight: 50, marginTop: 10 }}>
                    Обновлено: <Tag color="geekblue">{dateUpdate}</Tag>
                  </div>
                </div>
              </div>
            )}
          </>
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
              {location.pathname.includes("abiturient") ? (
                <>
                  <h1 style={{ marginLeft: 10, marginTop: 10, fontSize: 25 }}>
                    Cводка заявлений абитуриента{" "}
                    <a style={{ color: "#1677ff" }}>
                      {snils?.includes("_")
                        ? snils.replaceAll("_", " ")
                        : snils}
                    </a>{" "}
                    в 2023 году
                  </h1>
                  <div style={{ marginLeft: 10, fontWeight: "600" }}>
                    Уровень образования:
                    <Radio.Group
                      defaultValue="Бакалавриат"
                      buttonStyle="solid"
                      size="middle"
                      disabled
                      style={{ margin: 10, marginLeft: 0, width: "auto" }}
                      onChange={(e) => setLevelTraining(e.target.value)}
                    >
                      <Radio.Button value="Бакалавриат">
                        Бакалавриат/специалитет
                      </Radio.Button>
                      <Radio.Button value="Магистратура">
                        Магистратура
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                  <div style={{ marginLeft: 10, fontWeight: "600" }}>
                    Форма обучения:
                    <Radio.Group
                      defaultValue="Очная"
                      buttonStyle="solid"
                      size="middle"
                      disabled
                      style={{ margin: 10, marginLeft: 0 }}
                      onChange={(e) => setFormStudy(e.target.value)}
                    >
                      <Radio.Button value="Очная">Очная</Radio.Button>
                      <Radio.Button value="Очно-заочная">
                        Очно-заочная
                      </Radio.Button>
                      <Radio.Button value="Заочная">Заочная</Radio.Button>
                    </Radio.Group>
                  </div>
                  <div style={{ marginLeft: 10, fontWeight: "600" }}>
                    Направление:
                    <Select
                      //showSearch
                      //  value={direction}
                      //  defaultValue={direction}
                      style={{
                        margin: 10,
                        marginLeft: 0,
                        width: screenWidth - 34,
                      }}
                      disabled
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
                      //showSearch
                      style={{
                        margin: 10,
                        marginLeft: 0,
                        width: screenWidth - 34,
                      }}
                      disabled
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
                </>
              ) : (
                <>
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
                      <Radio.Button value="Магистратура">
                        Магистратура
                      </Radio.Button>
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
                      <Radio.Button value="Очно-заочная">
                        Очно-заочная
                      </Radio.Button>
                      <Radio.Button value="Заочная">Заочная</Radio.Button>
                    </Radio.Group>
                  </div>
                  <div style={{ marginLeft: 10, fontWeight: "600" }}>
                    Направление:
                    <Select
                      //showSearch
                      //  value={direction}
                      //  defaultValue={direction}
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
                      //showSearch
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
                </>
              )}

              <Outlet />
            </div>
          </Content>
        ) : (
          <Content
            style={{
              padding: "0 50px",
              marginTop: 0,
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
              {location.pathname.includes("abiturient") ? (
                <>
                  <h1 style={{ marginLeft: 10, marginTop: 10, fontSize: 25 }}>
                    Cводка заявлений абитуриента{" "}
                    <a style={{ color: "#1677ff" }}>
                      {snils?.includes("_")
                        ? snils.replaceAll("_", " ")
                        : snils}
                    </a>{" "}
                    в 2023 году
                  </h1>
                  <div style={{ marginLeft: 10, fontWeight: "600" }}>
                    Уровень образования:
                    <Radio.Group
                      defaultValue="Бакалавриат"
                      buttonStyle="solid"
                      size="middle"
                      disabled
                      style={{ margin: 10, width: "auto" }}
                      onChange={(e) => setLevelTraining(e.target.value)}
                    >
                      <Radio.Button value="Бакалавриат">
                        Бакалавриат/специалитет
                      </Radio.Button>
                      <Radio.Button value="Магистратура">
                        Магистратура
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                  <div style={{ marginLeft: 10, fontWeight: "600" }}>
                    Форма обучения:
                    <Radio.Group
                      defaultValue="Очная"
                      buttonStyle="solid"
                      disabled
                      size="middle"
                      style={{ margin: 10 }}
                      onChange={(e) => setFormStudy(e.target.value)}
                    >
                      <Radio.Button value="Очная">Очная</Radio.Button>
                      <Radio.Button value="Очно-заочная">
                        Очно-заочная
                      </Radio.Button>
                      <Radio.Button value="Заочная">Заочная</Radio.Button>
                    </Radio.Group>
                  </div>
                  <div style={{ marginLeft: 10, fontWeight: "600" }}>
                    Направление:
                    <Select
                      showSearch
                      //  value={direction}
                      //  defaultValue={direction}
                      style={{
                        margin: 10,
                        width: 450,
                      }}
                      disabled
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
                      //showSearch
                      style={{
                        margin: 10,
                        width: 378,
                      }}
                      disabled
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
                </>
              ) : (
                <>
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
                      <Radio.Button value="Магистратура">
                        Магистратура
                      </Radio.Button>
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
                      <Radio.Button value="Очно-заочная">
                        Очно-заочная
                      </Radio.Button>
                      <Radio.Button value="Заочная">Заочная</Radio.Button>
                    </Radio.Group>
                  </div>
                  <div style={{ marginLeft: 10, fontWeight: "600" }}>
                    Направление:
                    <Select
                      showSearch
                      //  value={direction}
                      //  defaultValue={direction}
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
                      //showSearch
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
                </>
              )}
              <Outlet />
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
    </MainContext.Provider>
  );
};
export default App;
