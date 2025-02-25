import { FC, useState } from "react";
import useLogin from "../hooks/auth/useLogin";
import useSignup from "../hooks/auth/useSignup";
import useForm from "../hooks/forms/useForms";
import styled from "styled-components";
import { Input } from "../components/Inputs";

const TypeSwitcher = styled.div`
  padding: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  border: 2px solid white;

  width: 100%;
  min-width: 200px;

  span {
    font-weight: bold;
    padding: 3px 2px;
    text-align: center;
  }

  [data-selected="true"] {
    background-color: white;
    color: black;
  }
}
`;

const Login = styled.section`
  min-width: 500px;
  gap: 10px;
  display: grid;
`;

const LoginForm = styled.form`
  gap: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr;

  &[data-type="login"] {
    grid-template-columns: 1fr;
    #userName {
      display: none;
    }
  }
`;

// type LoginPage = {};

const LoginPage: FC = () => {
  const [type, setType] = useState<"login" | "register">("login");

  const emailInput = useForm({
    type: "email",
    defaultValue: "",
    id: "email",
    placeholder: "Email",
  });
  const passwordInput = useForm({
    type: "password",
    defaultValue: "",
    id: "password",
    placeholder: "Password",
  });

  const userNameInput = useForm({
    type: "text",
    defaultValue: "",
    id: "userName",
    placeholder: "Username",
  });

  const { handleLogin } = useLogin();
  const { handleSignup } = useSignup();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    const userName = userNameInput.value;

    if (type === "login") return handleLogin({ email, password });

    return handleSignup({ email, password, userName });
  };

  return (
    <Login>
      <TypeSwitcher>
        <span data-selected={type === "login"} onClick={() => setType("login")}>
          Login
        </span>
        <span
          data-selected={type === "register"}
          onClick={() => setType("register")}
        >
          Signup
        </span>
      </TypeSwitcher>
      <LoginForm data-type={type} onSubmit={handleSubmit}>
        <Input {...emailInput} />
        <Input {...userNameInput} />
        <Input {...passwordInput} />
      </LoginForm>
      <button onClick={handleSubmit}>Submit</button>
    </Login>
  );
};

export default LoginPage;
