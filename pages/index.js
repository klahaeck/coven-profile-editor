import { useProfile } from '../lib/user-profile';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

export default function Home() {
  // Retrieve user profile from our custom React hook
  const { profile, isError, isLoading } = useProfile();

  // Debug statements are useful for seeing when useSWR updates the profile during mutate vs. refetch
  // console.log(profile);

  if (isLoading) return <Container className="pt-3"><h1>Loading...</h1></Container>;
  if (isError) return <Container className="pt-3">{isError.message}</Container>;

  if (profile) {
    return (
      <Container className="pt-3">
        <h1 className="mb-3">Your profile</h1>
        <div className="mb-3">
          <p><b>Email:</b> {profile?.email}</p>
          <p><b>First Name:</b> {profile?.given_name}</p>
          <p><b>Last Name:</b> {profile?.family_name}</p>
        </div>
        
        <Button variant="primary" href="/edit" className="me-2">Edit profile</Button>
        <Button variant="secondary" href="/api/auth/logout">Logout</Button>
      </Container>
    );
  } else {
    return (
      <Container className="pt-3">
        <Button as="a" href="/api/auth/login">Login</Button>
      </Container>
    );
  }

  
}
