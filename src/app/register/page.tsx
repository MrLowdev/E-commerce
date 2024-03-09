import { getCurrentUser } from "@/actions/getCurrentUser";
import Container from "@/components/Container";
import FormWrap from "@/components/FormWrap";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = async () => {
  const currentUser = await getCurrentUser();
  return (
    <Container>
      <FormWrap>
        <RegisterForm currentUser={currentUser} />
      </FormWrap>
    </Container>
  );
};

export default Register;
