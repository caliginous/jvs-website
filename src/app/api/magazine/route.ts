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
    ocr_text: 'This is a sample OCR text for the spring 2023 issue of the Jewish Vegetarian Magazine. It contains articles about sustainable living, Jewish dietary traditions, and plant-based recipes. The magazine explores the intersection of Jewish values and environmental consciousness, featuring contributions from rabbis, scholars, and community members. Topics covered include ethical eating, seasonal recipes, and the historical connection between Judaism and vegetarianism.',
    summary: 'Spring 2023 issue featuring articles on sustainable living and Jewish dietary traditions.',
    pdf_url: '/pdf/magazine-spring-2023.pdf'
  },
  {
    id: '2',
    title: 'Jewish Vegetarian Magazine - Winter 2022',
    date: '2022-12-01',
    r2_key: 'magazine-winter-2022.pdf',
    cover_image: '/images/magazine-winter-2022.jpg',
    ocr_text: 'The winter 2022 issue of the Jewish Vegetarian Magazine focuses on the intersection of Jewish values and plant-based living. This edition includes articles on holiday recipes, environmental stewardship, and the ethical considerations of food choices. Readers will find traditional Jewish dishes reimagined with plant-based ingredients, along with discussions about how Jewish teachings support sustainable and compassionate eating practices.',
    summary: 'Winter 2022 issue exploring the intersection of Jewish values and plant-based living.',
    pdf_url: '/pdf/magazine-winter-2022.pdf'
  },
  {
    id: '3',
    title: 'Jewish Vegetarian Magazine - Autumn 2022',
    date: '2022-09-01',
    r2_key: 'magazine-autumn-2022.pdf',
    cover_image: '/images/magazine-autumn-2022.jpg',
    ocr_text: 'Autumn 2022 brings a harvest of seasonal recipes and articles on sustainable eating. This issue celebrates the bounty of fall produce while exploring Jewish agricultural traditions. Features include Sukkot recipes, discussions of food justice, and profiles of Jewish farmers and food activists. The magazine continues its mission of promoting ethical eating within the Jewish community.',
    summary: 'Autumn 2022 issue with recipes and articles on seasonal eating.',
    pdf_url: '/pdf/magazine-autumn-2022.pdf'
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Magazine ID is required' },
        { status: 400 }
      );
    }

    // Find the magazine by ID
    const magazine = mockMagazines.find(m => m.id === id);

    if (!magazine) {
      return NextResponse.json(
        { error: 'Magazine not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(magazine);
  } catch (error) {
    console.error('Error fetching magazine:', error);
    return NextResponse.json(
      { error: 'Failed to fetch magazine' },
      { status: 500 }
    );
  }
} 