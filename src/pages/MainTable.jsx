import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Radio } from "antd";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
const data = [
  {
    key: "1",
    name: "01.03.04 Прикладная математика",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "09.03.01 Информатика и вычислительная техника",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "09.03.03 Прикладная информатика",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
  {
    key: "4",
    name: "11.03.04 Электроника и наноэлектроника",
    age: 32,
    address: "London No. 2 Lake Park",
  },
  {
    key: "5",
    name: "13.03.01 Теплоэнергетика и теплотехника",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "6",
    name: "13.03.02 Электроэнергетика и электротехника",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
  {
    key: "7",
    name: "13.03.03 Энергетическоемашиностроение",
    age: 32,
    address: "London No. 2 Lake Park",
  },
  {
    key: "8",
    name: "14.05.02 Атомные станции: проектирование, эксплуатация и инжиниринг",
    age: 32,
    address: "London No. 2 Lake Park",
  },
  {
    key: "9",
    name: "15.03.04 Автоматизация технологических процессов и производств",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "10",
    name: "15.03.06 Мехатроника и робототехника",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
  {
    key: "11",
    name: "20.03.01 Техносферная безопасность",
    age: 32,
    address: "London No. 2 Lake Park",
  },
  {
    key: "12",
    name: "35.03.08 Водные биоресурсы и аквакульутра",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
  {
    key: "13",
    name: "38.03.01 Экономика",
    age: 32,
    address: "London No. 2 Lake Park",
  },
  {
    key: "14",
    name: "38.03.02 Менеджмент",
    age: 32,
    address: "London No. 2 Lake Park",
  },
  {
    key: "15",
    name: "39.03.01 Социология",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "16",
    name: "42.03.01 Реклама и связи с общественностью",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
];
const MainTable = () => {
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
      title: "Код и наименование направления",
      dataIndex: "name",
      key: "name",
      width: "auto",
      ...getColumnSearchProps("name"),
      render: (text) => (
        <Link to={`/program/${text.replaceAll(" ", "_")}`}>{text}</Link>
      ),
    },
    {
      title: "Федеральный бюджет",
      children: [
        {
          title: "План",
          dataIndex: "companyAddress",
          key: "companyAddress",
          width: "10%",
        },
        {
          title: "Всего",
          dataIndex: "companyName",
          key: "companyName",
          width: "10%",
        },
        {
          title: "Оригинал и приоритет",
          dataIndex: "companyNam",
          key: "companyNam",
          width: "10%",
        },
        {
          title: "В т.ч. Целев.",
          dataIndex: "companyNa",
          key: "companyNa",
          width: "10%",
        },
        {
          title: "В т.ч. Льгот.",
          dataIndex: "companyN",
          key: "companyN",
          width: "10%",
        },
      ],
    },
    {
      title: "Внебюджет",
      children: [
        {
          title: "Всего",
          dataIndex: "companyName",
          key: "companyName",
          width: "10%",
        },
        {
          title: "Оригинал и приоритет",
          dataIndex: "companyNam",
          key: "companyNam",
          width: "10%",
        },
      ],
    },

  ];
  return (
    <>
      <h1 style={{ marginLeft: 10, marginTop: 10, fontSize: 30 }}>
        Cводка приема заявлений абитуриентов в 2023 году
      </h1>
      <div style={{ marginLeft: 10, fontWeight: "bold" }}>
        Уровень образования:
        <Radio.Group
          defaultValue="a"
          buttonStyle="solid"
          size="middle"
          style={{ margin: 10 }}
        >
          <Radio.Button value="a">Бакалавриат/специалитет</Radio.Button>
          <Radio.Button value="b">Магистратура</Radio.Button>
          <Radio.Button value="c">СПО</Radio.Button>
          <Radio.Button value="d">Аспирантура</Radio.Button>
        </Radio.Group>
      </div>
      <div style={{ marginLeft: 10, fontWeight: "bold" }}>
        Форма обучения:
        <Radio.Group
          defaultValue="a"
          buttonStyle="solid"
          size="middle"
          style={{ margin: 10 }}
        >
          <Radio.Button value="a">Очная</Radio.Button>
          <Radio.Button value="b">Очно-заочная</Radio.Button>
          <Radio.Button value="c">Заочная</Radio.Button>
        </Radio.Group>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
        size="small"
        scroll={{
          x: 1200,
          //y: 285,
        }}
      />
    </>
  );
};
export default MainTable;
