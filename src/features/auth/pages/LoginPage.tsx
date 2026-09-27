import { LayoutAuth } from '../components/LayoutAuth';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  return (
    <div className="flex flex-1">
      <LayoutAuth>
        <LoginForm></LoginForm>
      </LayoutAuth>
    </div>
  );
};
