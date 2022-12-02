import { useProfile } from '../lib/user-profile';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

export default function Home() {
  // Retrieve user profile from our custom React hook
  const { profile, isError, isLoading } = useProfile();

  // Debug statements are useful for seeing when useSWR updates the profile during mutate vs. refetch
  // console.log(profile);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{isError.message}</div>;

  if (profile) {
    return (
      <Container className="pt-3">
        <h1 className="mb-3">Your profile</h1>
        <div className="mb-3">
          <b>First Name:</b> {profile?.given_name} <br></br>
          <b>Last Name:</b> {profile?.family_name} <br></br>
        </div>
        
        <Button variant="primary" href="/edit" className="me-2">Edit profile</Button>
        <Button variant="secondary" href="/api/auth/logout">Logout</Button>
      </Container>
    );
  } else {
    return (<Button as="a" href="/api/auth/login">Login</Button>);
  }

  
}
