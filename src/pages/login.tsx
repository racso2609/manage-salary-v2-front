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
  max-width: 200px;

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
  width: 100%;
  max-width: 500px;
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

  const [error, setError] = useState("");
  const emailInput = useForm({
    type: "email",
    defaultValue: "",
    id: "email",
    placeholder: "Email",
    required: true,
  });
  const passwordInput = useForm({
    type: "password",
    defaultValue: "",
    id: "password",
    placeholder: "Password",
    required: true,
  });

  const userNameInput = useForm({
    type: "text",
    defaultValue: "",
    id: "userName",
    placeholder: "Username",
    required: true,
  });

  const { handleLogin } = useLogin({handlers:{onError: (e)=>setError(e.message)}});
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
      <button onClick={handleSubmit}>{error??"Submit"}</button>
    </Login>
  );
};

export default LoginPage;
