import { FC, useState } from "react";
import useLogin from "../hooks/auth/useLogin";
import useSignup from "../hooks/auth/useSignup";
import useForm from "../hooks/forms/useForms";
import styled from "styled-components";
import { Input } from "../components/Inputs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faLock } from "@fortawesome/free-solid-svg-icons";

const TypeSwitcher = styled.div`
  padding: 4px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  border-radius: 8px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;

  span {
    font-weight: 600;
    padding: 12px 16px;
    text-align: center;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s ease;
    color: #666;
    font-size: 16px;
  }

  span:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }

  [data-selected="true"] {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;

  @media (max-width: 600px) {
    padding: 10px;
  }
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 500px;
  gap: 20px;
  display: grid;
  padding: 40px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;

  @media (max-width: 600px) {
    padding: 20px;
    gap: 15px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 12px;
    color: #999;
    font-size: 18px;
    z-index: 1;
  }

  input {
    padding-left: 48px;
  }
`;

const StyledButton = styled.button`
  min-height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  background: #ffeaea;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 12px;
  font-size: 14px;
  text-align: center;
`;

const LoginInputs = styled.div`
  gap: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr;

  &[data-type="login"] {
    grid-template-columns: 1fr;
    #userName {
      display: none;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    #userName {
      display: block;
    }
  }
`;

// type LoginPage = {};

const LoginPage: FC = () => {
  const [type, setType] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

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

  const { handleLogin } = useLogin({
    handlers: { onError: (e: any) => setError(e.message) },
  });
  const { handleSignup } = useSignup({
    handlers: { onError: (e: any) => setError(e.message) },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const email = emailInput.value;
    const password = passwordInput.value;
    const userName = userNameInput.value;

    try {
      if (type === "login") {
        await handleLogin({ email, password });
      } else {
        await handleSignup({ email, password, userName });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <LoginForm onSubmit={handleSubmit}>
        <TypeSwitcher>
          <span
            data-selected={type === "login"}
            onClick={() => setType("login")}
          >
            Login
          </span>
          <span
            data-selected={type === "register"}
            onClick={() => setType("register")}
          >
            Signup
          </span>
        </TypeSwitcher>
        <LoginInputs data-type={type}>
          <InputWrapper>
            <FontAwesomeIcon icon={faEnvelope} />
            <Input {...emailInput} />
          </InputWrapper>
          <InputWrapper id="userName">
            <FontAwesomeIcon icon={faUser} />
            <Input {...userNameInput} />
          </InputWrapper>
          <InputWrapper>
            <FontAwesomeIcon icon={faLock} />
            <Input {...passwordInput} />
          </InputWrapper>
        </LoginInputs>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <StyledButton type="submit" disabled={loading}>
          {loading ? "Loading..." : type === "login" ? "Login" : "Sign Up"}
        </StyledButton>
      </LoginForm>
    </PageContainer>
  );
};

export default LoginPage;
