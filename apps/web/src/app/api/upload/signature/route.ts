import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createHash } from 'crypto';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Cloudinary no configurado' }, { status: 503 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'jornadas-misioneras/events';

  // Cloudinary signature: SHA1 of sorted params + api_secret
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash('sha1')
    .update(paramsToSign + apiSecret)
    .digest('hex');

  return NextResponse.json({ signature, timestamp, cloudName, apiKey, folder });
}
