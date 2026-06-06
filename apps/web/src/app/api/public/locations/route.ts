import { NextRequest, NextResponse } from 'next/server';
import { getPublicLocations } from '@/lib/queries/public-locations';

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const countryId = searchParams.get('countryId');
  const provinceId = searchParams.get('provinceId');

  const data = await getPublicLocations({
    countryId: countryId ? parseInt(countryId, 10) : undefined,
    provinceId: provinceId ? parseInt(provinceId, 10) : undefined,
  });

  return NextResponse.json(
    { data },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  );
}
