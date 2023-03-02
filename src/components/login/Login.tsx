import { useContext } from 'react';

import Modal from '../ui/Modal';
import LoginForm from './LoginForm';
import { LocationContext } from '@/store/location-context';

const Login = () => {
	const { isLogin } = useContext(LocationContext);

	if (!isLogin) {
		return <></>;
	}

	return (
		<Modal>
			<LoginForm />
		</Modal>
	);
};

export default Login;
