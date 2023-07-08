import { Button, Result } from "antd";
import { useNavigate, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate()
  console.error(error);
  return (
    <Result
      status="404"
      title="404"
      subTitle={"Страница не найдена"}
      extra={<Button type="primary" onClick={() => navigate("/")}>На главную</Button>}
    />
  );
};
export default ErrorPage;
