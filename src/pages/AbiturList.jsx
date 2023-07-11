import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
const data = [
  {
    key: "1",
    snils: "165-938-468 00",
    name: "20.03.01 Техносферная безопасность",
    profile: "Информационные системы управления бизнес-процессами",
  },
  {
    key: "2",
    snils: "157-436-346 83",
    age: 42,
    profile: "Технологии разработки программного обеспечения",
    name: "20.03.01 Техносферная безопасность",

    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    snils: "160-687-671 93",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    name: "15.03.06 Мехатроника и робототехника",
    profile: "Технологии разработки программного обеспечения",
  },
];

const AbiturList = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
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
      title: "Наименование направления",
      dataIndex: "name",
      key: "name",
      width: "auto",
      ...getColumnSearchProps("name"),
      render: (text) => (
        <Link to={`/program/${text.replaceAll(" ", "_")}`}>{text}</Link>
      ),
    },
    {
      title: "Наименование профиля",
      dataIndex: "profile",
      key: "profile",
      width: "auto",
      ...getColumnSearchProps("profile"),
      render: (text) => (
        <Link to={`/program/${text.replaceAll(" ", "_")}`}>{text}</Link>
      ),
    },
    {
      title: "СНИЛС",
      dataIndex: "snils",
      key: "snils",
      width: "20%",
      ...getColumnSearchProps("snils"),
      render: (text) => <Link to={`/abiturient/${text}`}>{text}</Link>,
    },
    {
      title: "Приоритет зачисления",
      dataIndex: "number",
      key: "number",
      width: "5%",
    },
    {
      title: "Место в списке с учетом высшего приоритета",
      dataIndex: "num",
      key: "num",
      width: "5%",
    },
    {
      title: "Cумма баллов",
      dataIndex: "sum",
      key: "sum",
      width: "10%",
    },

    {
      title: "Основа",
      children: [
        {
          title: "Бюджетная/Внебюджетная",
          dataIndex: "companyAddress",
          key: "companyAddress",
          width: "15%",
          filters: [
            {
              text: "Бюджетная",
              value: "Joe",
            },
            {
              text: "Внебюджетная",
              value: "Jim",
            },
          ],
        },
      ],
    },

    {
      title: "Документы",
      dataIndex: "companyNam",
      key: "companyNam",
      width: "10%",
    },

    //  {
    //    title: "Age",
    //    dataIndex: "age",
    //    key: "age",
    //    ...getColumnSearchProps("age"),
    //  },
    //  {
    //    title: "Address",
    //    dataIndex: "address",
    //    key: "address",
    //    ...getColumnSearchProps("address"),
    //    sorter: (a, b) => a.address.length - b.address.length,
    //    sortDirections: ["descend", "ascend"],
    //  },
  ];
  return (
    <>
      <h1 style={{ marginLeft: 10, marginTop: 10, fontSize: 30 }}>
        Cводка приема заявлений абитуриентов в 2023 году
      </h1>
      {/* <h1 style={{ marginLeft: 10, marginTop: 10, fontSize: 25 }}>
        {name.replaceAll("_", " ")}
      </h1>
      <h1 style={{ marginLeft: 10, marginTop: 10, fontSize: 25 }}>
        {nameProf.replaceAll("_", " ")}
      </h1> */}
      <Table
        columns={columns}
        dataSource={data}
        bordered
        size="small"
        style={{ margin: 10 }}
        scroll={{
          x: 1200,
          //y: 285,
        }}
      />
    </>
  );
};
export default AbiturList;
