import React, { useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { Input, Button, Space, Table, Tooltip, Tag, Checkbox } from "antd";
import { MainContext } from "../App";

const MainPage = () => {
  const { levelTraining, tablesData, loading, kcp, setOnlyOriginal } =
    useContext(MainContext);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [tablesDataCopy, setTablesDataCopy] = useState([]);
  const [tablesDataSorted, setTablesDataSorted] = useState([]);
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    setTablesDataSorted([]);
    setTablesDataCopy([]);
    sorted ? sortByDescend() : sortByBall();
  }, [tablesData]);

  const sortByDescend = () => {
    tablesData
      .sort(function (a, b) {
        return a.priority - b.priority;
      })
      .forEach((element, index) => {
        element.key = index + 1;
      });
    setTablesDataSorted([...tablesData]);
  };

  const sortByBall = () => {
    tablesData
      .sort(function (a, b) {
        return b.sumBal_ID - a.sumBal_ID;
      })
      .forEach((element, index) => {
        element.key = index + 1;
      });
    setTablesDataCopy([...tablesData]);
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
      width: "9%",
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
      sorter: () => {},
      sortDirections: ["descend"],
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
    },
    {
      title: "Нуждаемость в общежитии",
      dataIndex: "needRoom",
      key: "needRoom",
      width: "8%",
      align: "center",
    },
    {
      title: "Состояние",
      dataIndex: "state",
      key: "state",
      width: "5%",
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
      showSorterTooltip: false,
      sorter: () => {},
      sortDirections: ["descend"],
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
    },
    {
      title: "Нуждаемость в общежитии",
      dataIndex: "needRoom",
      key: "needRoom",
      width: "8%",
      align: "center",
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    if (sorter.order === undefined) {
      sortByBall();
      setSorted(false);
    } else {
      sortByDescend();
      setSorted(true);
    }
  };

  return (
    <>
      <Table
        columns={levelTraining === "Бакалавриат" ? columns : columnsMag}
        dataSource={sorted ? tablesDataSorted : tablesData}
        rowKey={(record) => record.key}
        bordered
        onChange={onChange}
        title={() => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: "600" }}>
              Контрольные цифры приема: <Tag color="blue">{kcp}</Tag>
            </div>
            <div>
              <Checkbox
                style={{
                  fontWeight: "600",
                }}
                onChange={(e) => setOnlyOriginal(e.target.checked)}
              >
                Показать только оригинал
              </Checkbox>
            </div>
          </div>
        )}
        loading={loading}
        pagination={{ showSizeChanger: true }}
        size="small"
        scroll={{
          x: 1200,
          //y: 285,
        }}
        style={{ margin: 10 }}
      />
    </>
  );
};

export default MainPage;
