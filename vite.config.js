import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
const headers={
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'strict-origin-when-cross-origin',
  'X-Frame-Options':'DENY',
  'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
};
export default defineConfig({plugins:[react()],server:{headers},preview:{headers},build:{sourcemap:false}});
