import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import Layout from '@/components/layout/Layout';

import LocationContextProvider from '@/store/location-context';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<LocationContextProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</LocationContextProvider>
	);
}
