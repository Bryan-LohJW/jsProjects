import { useContext, createRef } from 'react';
import { useRouter } from 'next/router';

import { LocationContext } from '@/store/location-context';
import classes from './LoginForm.module.css';

const LoginForm = () => {
	const { setUsername, toggleLogin, isLogin, setLocations, locations } =
		useContext(LocationContext);
	const router = useRouter();

	const nameInputRef = createRef<HTMLInputElement>();

	async function fetchData(username: string) {
		const response = await fetch(`/api/locations?user=${username}`);
		const data = await response.json();
		if (data.locationArray.length === locations.length) {
			return;
		}
		setLocations(data.locationArray);
	}

	const onSubmitUsername = async (event: React.FormEvent) => {
		event.preventDefault();

		if (nameInputRef.current?.value.trim().length === 0) {
			return;
		}

		setUsername(nameInputRef.current!.value);
		fetchData(nameInputRef.current!.value);
		toggleLogin();
		router.push('/');
	};

	return (
		<>
			<form onSubmit={onSubmitUsername} className={classes.form}>
				<label htmlFor="name" className={classes.header}>
					Welcome, what is your name:{' '}
				</label>
				<input
					type="text"
					id="name"
					name="name"
					ref={nameInputRef}
					className={classes.input}
				/>
				<button type="submit" className={classes.action}>
					Go
				</button>
			</form>
		</>
	);
};

export default LoginForm;
