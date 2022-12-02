import { UserProvider } from '@auth0/nextjs-auth0';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
  const { user } = pageProps;
  return (
    <UserProvider user={user}>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp;
