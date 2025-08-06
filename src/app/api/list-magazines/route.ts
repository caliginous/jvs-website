import { NextResponse } from 'next/server';

// Edge Runtime configuration for Cloudflare Pages
export const runtime = 'edge';

// Mock data for magazines since we don't have the database connection
const mockMagazines = [
  {
    id: '1',
    title: 'Jewish Vegetarian Magazine - Spring 2023',
    date: '2023-03-01',
    r2_key: 'magazine-spring-2023.pdf',
    cover_image: '/images/magazine-spring-2023.jpg',
    ocr_text: 'Sample OCR text for the spring 2023 issue...',
    summary: 'Spring 2023 issue featuring articles on sustainable living and Jewish dietary traditions.',
    pdf_url: '/pdf/magazine-spring-2023.pdf'
  },
  {
    id: '2',
    title: 'Jewish Vegetarian Magazine - Winter 2022',
    date: '2022-12-01',
    r2_key: 'magazine-winter-2022.pdf',
    cover_image: '/images/magazine-winter-2022.jpg',
    ocr_text: 'Sample OCR text for the winter 2022 issue...',
    summary: 'Winter 2022 issue exploring the intersection of Jewish values and plant-based living.',
    pdf_url: '/pdf/magazine-winter-2022.pdf'
  },
  {
    id: '3',
    title: 'Jewish Vegetarian Magazine - Autumn 2022',
    date: '2022-09-01',
    r2_key: 'magazine-autumn-2022.pdf',
    cover_image: '/images/magazine-autumn-2022.jpg',
    ocr_text: 'Sample OCR text for the autumn 2022 issue...',
    summary: 'Autumn 2022 issue with recipes and articles on seasonal eating.',
    pdf_url: '/pdf/magazine-autumn-2022.pdf'
  }
];

export async function GET() {
  try {
    // Return mock data for now
    // In production, this would query the database
    return NextResponse.json(mockMagazines);
  } catch (error) {
    console.error('Error fetching magazines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch magazines' },
      { status: 500 }
    );
  }
} 