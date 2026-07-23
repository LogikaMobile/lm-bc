export class AuthApiService {
  static async login(email: string, passwordRaw: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';
    const res = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, passwordRaw }),
    });

    if (!res.ok) {
      throw new Error('Invalid credentials');
    }

    return res.json();
  }
}
