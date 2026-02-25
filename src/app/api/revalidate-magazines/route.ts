import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const expected = process.env.REVALIDATE_MAGAZINES_SECRET
    if (!expected || authHeader !== `Bearer ${expected}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const slug = body?.slug?.current || body?.slug

    revalidateTag('magazines')
    revalidatePath('/magazine')
    if (slug) revalidatePath(`/magazine/${slug}`)

    return NextResponse.json({ ok: true, slug: slug || null })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 })
  }
}






















