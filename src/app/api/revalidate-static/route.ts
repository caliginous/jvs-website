import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  const expected = process.env.REVALIDATE_STATIC_SECRET;
  if (!expected || token !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const docType = body?._type || body?.type || '';
  const route: string | undefined = body?.route;
  const slug: string | undefined = body?.slug?.current || body?.slug;

  try {
    switch (docType) {
      case 'homepageSettings': {
        revalidatePath('/');
        break;
      }
      case 'staticPage': {
        if (route && route.startsWith('/')) {
          revalidatePath(route.endsWith('/') ? route : `${route}/`);
        } else {
          // Fallback: revalidate common static routes
          ['/about/', '/privacy/', '/terms/', '/resources/'].forEach((p) => revalidatePath(p));
        }
        break;
      }
      case 'article': {
        revalidateTag('articles');
        revalidatePath('/articles/');
        if (slug) revalidatePath(`/articles/${slug}/`);
        break;
      }
      case 'recipe': {
        revalidateTag('recipes');
        revalidatePath('/recipes/');
        if (slug) revalidatePath(`/recipes/${slug}/`);
        break;
      }
      case 'magazineIssue': {
        revalidateTag('magazines');
        revalidatePath('/magazine/');
        if (slug) revalidatePath(`/magazine/${slug}/`);
        break;
      }
      default: {
        // Unknown type: conservatively revalidate homepage
        revalidatePath('/');
      }
    }

    return NextResponse.json({ ok: true, type: docType, route, slug });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'revalidate error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, msg: 'Use POST with Sanity webhook.' });
}























