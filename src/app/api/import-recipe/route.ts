import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { put } from '@vercel/blob';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';

export const runtime = 'nodejs';

function corsHeaders(origin?: string) {
  const allowed = process.env.SANITY_STUDIO_ORIGIN || 'https://jvscontent.sanity.studio';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '600',
  } as Record<string, string>;
}

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, rawText, imageId } = body || {};
    if (!url && !rawText) {
      return new NextResponse(JSON.stringify({ message: 'Either a URL or raw text is required.' }), { status: 400, headers: corsHeaders(request.headers.get('origin') || undefined) });
    }

    let textToProcess = '';
    if (rawText && typeof rawText === 'string') {
      textToProcess = rawText;
    } else if (url && typeof url === 'string') {
      const { data: html } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15'
        },
        timeout: 15000,
      });
      const $ = cheerio.load(html);
      $('script, style, nav, footer, header, aside').remove();
      textToProcess = $('body').text().replace(/\s\s+/g, ' ').trim();
    }

    if (!textToProcess || textToProcess.length < 50) {
      return new NextResponse(JSON.stringify({ message: 'Could not extract sufficient content.' }), { status: 400, headers: corsHeaders(request.headers.get('origin') || undefined) });
    }

    // Map to our actual Sanity recipe schema
    const systemPrompt = `You are an expert culinary assistant. Parse raw text from a recipe and convert it into a structured JSON object that matches our exact Sanity.io schema. Your response MUST be only the JSON object. Do not include code fences.

Schema to follow (must match exactly these keys and types):
{
  "title": "string",
  "slug": { "current": "string" },
  "content": [ { "_type": "block", "style": "normal", "children": [ { "_type": "span", "text": "string" } ] } ],
  "ingredients": [ "string" ],
  "instructions": [ "string" ],
  "servings": 1,
  "preparationTime": 0,
  "cookTime": 0,
  "difficulty": "easy|medium|hard",
  "categories": [ "string" ],
  "tags": [ "string" ]
}`;

    const userPrompt = `Extract and normalize the recipe into the schema above. Prefer UK units where possible. Keep steps concise. Title must be present. Generate a reasonable slug.current from title if not obvious. Text to parse:\n\n${textToProcess.slice(0, 16000)}`;

    const client = getOpenAI();
    if (!client) {
      return new NextResponse(JSON.stringify({ message: 'OPENAI_API_KEY not configured' }), { status: 500, headers: corsHeaders() });
    }
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');

    // Attach image reference if provided
    if (imageId) {
      parsed.featuredImage = {
        _type: 'image',
        asset: { _type: 'reference', _ref: imageId },
      };
    }

    // Mirror image to Vercel Blob if an http(s) imageUrl is present
    if (parsed.imageUrl && typeof parsed.imageUrl === 'string' && /^https?:\/\//.test(parsed.imageUrl)) {
      try {
        const res = await fetch(parsed.imageUrl);
        const arrayBuffer = await res.arrayBuffer();
        const fileName = `recipes/${parsed.slug?.current || Date.now()}.jpg`;
        const blob = await put(fileName, Buffer.from(arrayBuffer), { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN });
        parsed.externalImageUrl = blob.url;
      } catch (e) {
        // ignore mirror failures
      }
    }

    // Ensure PT blocks and spans have _key
    const uid = () => Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
    if (Array.isArray(parsed?.content)) {
      parsed.content = parsed.content.map((block: any) => {
        const b = { ...block };
        if (!b._key) b._key = uid();
        if (Array.isArray(b.children)) {
          b.children = b.children.map((child: any) => ({ ...child, _key: child?._key || uid() }));
        }
        return b;
      });
    }

    // Ensure minimal required fields
    if (!parsed.title) parsed.title = 'Untitled Recipe';
    if (!parsed.slug || !parsed.slug.current) {
      parsed.slug = { current: parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') };
    }

  return new NextResponse(JSON.stringify(parsed), { status: 200, headers: corsHeaders() });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ message: 'Failed to import recipe.', details: error?.message || String(error) }), { status: 500, headers: corsHeaders() });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}


