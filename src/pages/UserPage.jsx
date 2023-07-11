import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table} from "antd";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link, useParams } from "react-router-dom";
import {
	Layout,
	theme,


 } from "antd";
 const { Header, Content, Footer } = Layout;
const { Search } = Input;

const data = [
	{
	  key: "1",
	  name: "",
	  age: 32,
	  address: "New York No. 1 Lake Park",
	},
	{
	  key: "2",
	  name: "",
	  age: 42,
	  address: "London No. 1 Lake Park",
	},
	{
	  key: "3",
	  name: "",
	  age: 32,
	  address: "Sydney No. 1 Lake Park",
	},
 ];
const UserPage = () => {  const {
	token: { colorBgContainer },
 } = theme.useToken();


  let { snils } = useParams();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [loading, setLoading] = useState(false);

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
      dataIndex: "name",
      key: "name",
      width: "20%",
      ...getColumnSearchProps("name"),
      render: (text) => <Link to={`direction/${text}`}>{text}</Link>,
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
      title: "Институт",
      dataIndex: "inst",
      key: "inst",
      width: "10%",
    },
    {
      title: "Специальность",
      dataIndex: "spec",
      key: "spec",
      width: "20%",
    },
    {
      title: "Прием ФБ",
      dataIndex: "ins",
      key: "ins",
      width: "5%",
    },
    {
      title: "Дата заявления",
      dataIndex: "date",
      key: "date",
      width: "10%",
    },

    {
      title: "Форма/Основа",
      dataIndex: "companyAddress",
      key: "companyAddress",
      width: "10%",
    },

    {
      title: "Документы (оригинал?)",
      dataIndex: "companyNam",
      key: "companyNam",
      width: "20%",
    },

    {
      title: "Профиль",
      dataIndex: "companyAddss",
      key: "companyAddss",
      width: "10%",
    },
    {
      title: "Зачисление",
      dataIndex: "coanyAddss",
      key: "comnyAddss",
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
		 onSearch={() => {}}
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
			Cводка заявлений абитуриента {snils} в 2023 году
		 </h1>
		 
		 
		
		 <>
			<Table
			  columns={columns}
			  dataSource={data}
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
