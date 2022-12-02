export default async function change_password(req, res) {
  const { email } = req.body;
  try {
    await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/dbconnections/change_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        email,
        connection: 'Username-Password-Authentication'
      })
    });
    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}