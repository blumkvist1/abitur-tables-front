import { Table, Tooltip } from "antd";
import { useState, useEffect } from "react";
import { Link, useLoaderData, useNavigation } from "react-router-dom";
import { Tag } from "antd";
import { fetchAllDataForEnrolle } from "../http/statementApi";

export async function loader({ params }) {
  const data = await fetchAllDataForEnrolle(
    params.snils?.includes("_")
      ? params.snils.replaceAll("_", " ")
      : params.snils
  );
  return data;
}

const UserPage = () => {
  const data = useLoaderData();
  const navigation = useNavigation();

  const [tablesData, setTablesData] = useState([]);

  useEffect(() => {
    setTablesData(data);
  }, [data]);

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
    <>
      <Table
        columns={columns}
        dataSource={tablesData}
        rowKey={(record) => record.key}
        bordered
        loading={navigation.state === "loading" ? true : false}
        pagination={false}
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
export default UserPage;
