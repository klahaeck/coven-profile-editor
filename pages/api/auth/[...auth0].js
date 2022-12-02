import {
  handleAuth,
  handleLogin
} from '@auth0/nextjs-auth0';

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
          scope: 'openid profile email offline_access read:users update:users',
        }
      })
    } catch (error) {
      res.status(error.status || 500).end(error.message);
    }
  }
});