'use server';

import { cookies } from 'next/headers';
import { AuthApiService } from '@/services/api/auth';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const data = await AuthApiService.login(email as string, password as string);
    // Persist token in httpOnly cookie for SSR support later if needed
    (await cookies()).set('token', data.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Invalid credentials' };
  }
}
