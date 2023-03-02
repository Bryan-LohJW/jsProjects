import { useContext, createRef } from 'react';

import { LocationContext } from '@/store/location-context';

const LoginForm = () => {
	const { setUsername, toggleLogin, isLogin, toggleLocationForm } =
		useContext(LocationContext);
	const nameInputRef = createRef<HTMLInputElement>();

	const onSubmitUsername = (event: React.FormEvent) => {
		event.preventDefault();
		console.log('Submitting');
		console.log(isLogin);

		if (nameInputRef.current?.value.trim().length === 0) {
			return;
		}
		console.log('Submitted');

		setUsername(nameInputRef.current!.value);
		toggleLogin();
		toggleLocationForm();
		console.log(isLogin);
	};

	return (
		<>
			<form onSubmit={onSubmitUsername}>
				<label htmlFor="name">Welcome, tell us your name: </label>
				<input type="text" id="name" name="name" ref={nameInputRef} />
				<button type="submit">Go</button>
			</form>
		</>
	);
};

export default LoginForm;
