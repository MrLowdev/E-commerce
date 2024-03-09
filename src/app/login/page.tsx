import Container from "@/components/Container";
import FormWrap from "@/components/FormWrap";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <Container>
      <FormWrap>
        <LoginForm />
      </FormWrap>
    </Container>
  );
};

export default Login;
