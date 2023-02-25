import Link from 'next/link';
import Image from 'next/image';
import { Dispatch, SetStateAction, useContext } from 'react';

import classes from './MainNavigation.module.css';
import { LocationContext } from '@/store/location-context';

const MainNavigation = () => {
	const { username, toggleLocationForm } = useContext(LocationContext);

	return (
		<header className={classes.header}>
			<Image
				src="/logo.png"
				width={120}
				height={0}
				alt="web logo"
				className={classes.logo}
			/>
			<nav>
				<ul>
					{username.trim().length > 0 && <li>Welcome {username}.</li>}
					<li>
						<Link href={'/'} className={classes.action}>
							Home
						</Link>
					</li>
					<li>
						<div
							className={classes.action}
							onClick={toggleLocationForm}
						>
							New Location
						</div>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default MainNavigation;
