import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { useProfile } from '../lib/user-profile';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CovenLogo from '../components/CovenLogo';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import NProgress from 'nprogress';

export default function Edit() {
  const [ passwordReset, setPasswordReset ] = useState(false);
  const router = useRouter();

  // Retrieve user profile from our custom React hook
  const { profile, isError, isLoading, updateProfile } = useProfile();

  // Populate HTML form with current profile values
  const { register, handleSubmit, reset } = useForm({defaultValues: profile});

  // Update (i.e. reset) the form with the current profile values when profile eventually updates from our custom React hook useProfile()
  // Necessary since on initial React component load, the profile is 'undefined'.
  useEffect(() => {
    // Debug statements are useful for seeing when useSWR updates the profile during mutate and refetch
    // console.log('Edit Page');
    // console.log(profile); 

    reset(profile);
  }, [profile]);

  const passwordResetHandler = async () => {
    // console.log(profile.email);
    fetch('/api/auth/change_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: profile.email,
      })
    })
      .then(res => {
        if (res.status === 200) {
          // alert('Password reset email sent!');
          setPasswordReset(true);
        } else {
          alert('Error sending password reset email.');
        }
      })
      .catch(error => console.error(error));
  };
    // Debug statements are useful for seeing when useSWR updates the profile during mutate and refetch

  const onSubmit = data => {
    // console.log(data);
    var newData = {
      email: data.email,
      given_name: data.given_name,
      family_name: data.family_name
    };
    // console.log(newData);
    updateUserSessionWithoutSWR(newData);
  };

  async function updateUserSessionWithoutSWR(formData) {
    NProgress.start();
    // We must await a response since at the end of the updateProfile function, it calls /api/auth/refetch to update the local nextjs-auth0 cookie.
    await updateProfile(formData);
    NProgress.done();
    router.replace(`${process.env.NEXT_PUBLIC_MIGHTY_NETWORKS_URL}/your-settings/profile`);
  }
  
  if (isLoading) return (
    <Container className="pt-3">
      <CovenLogo />
      <h1>Loading...</h1>
    </Container>
  );
  if (isError) return (
    <Container className="pt-3">
      <CovenLogo />
      {isError.message}
    </Container>
  );

  if (profile) {
    return (
      <Container className="pt-3">
        <CovenLogo />
        <h1 className="mb-4">Update your profile</h1>
        
        <div className="mb-4">
          {!passwordReset && <Button onClick={() => passwordResetHandler()}>Click here to reset your password</Button>}
          {passwordReset && <p className="h5">A password reset email has been sent to your email address.<br />Please follow the instructions in the email.</p>}
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control {...register('email', {
              required: true,
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
            })} placeholder="Enter your email address" disabled />
          </Form.Group>

          <Form.Group className="mb-3" controlId="given_name">
            <Form.Label>First Name</Form.Label>
            <Form.Control {...register('given_name', { required: true })} placeholder="Enter your first name" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="family_name">
            <Form.Label>Last Name</Form.Label>
            <Form.Control {...register('family_name', { required: true })} placeholder="Enter your last name" />
          </Form.Group>

          <Button type="submit" variant="primary" className="me-2">Save</Button>

          <Button variant="secondary" onClick={() => {
            reset();
            router.back();
          }}>Cancel</Button>
        </Form>
      </Container>
    );
  }
  return (
    <Container className="pt-3">
      <Button href="/api/auth/login">Login to view profile</Button>
    </Container>
  );
}
