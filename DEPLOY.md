# Deploy Gratis

Project ini bisa di-host gratis dengan kombinasi:

- Vercel untuk Next.js frontend, API routes, dan middleware.
- Neon atau Supabase PostgreSQL untuk database Prisma.

## Environment Variables

Set variable berikut di Vercel Project Settings:

```env
DATABASE_URL="postgresql://..."
ADMIN_SESSION_SECRET="isi-dengan-string-panjang-random"
ADMIN_COOKIE_SECURE="true"
UPLOAD_STORAGE="data-url"

GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
ADMIN_GOOGLE_EMAIL="email-admin@gmail.com"
```

`UPLOAD_STORAGE="data-url"` membuat upload gambar admin tetap persisten di hosting serverless gratis dengan menyimpan data gambar ke database lewat field konten.

## Database

Setelah mendapatkan `DATABASE_URL` production, jalankan dari lokal:

```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy
DATABASE_URL="postgresql://..." npx prisma db seed
```

## Vercel

1. Import repository GitHub `ibrahim742/portofolio`.
2. Framework preset: Next.js.
3. Build command: `npm run build`.
4. Install command: `npm install`.
5. Tambahkan environment variables di atas.
6. Deploy.

## Google OAuth

Tambahkan Authorized redirect URI di Google Cloud:

```text
https://DOMAIN-VERCEL-KAMU.vercel.app/api/admin/google/callback
```

