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
    ocr_text: 'This is a sample OCR text for the spring 2023 issue of the Jewish Vegetarian Magazine. It contains articles about sustainable living, Jewish dietary traditions, and plant-based recipes. The magazine explores the intersection of Jewish values and environmental consciousness, featuring contributions from rabbis, scholars, and community members. Topics covered include ethical eating, seasonal recipes, and the historical connection between Judaism and vegetarianism.',
    summary: 'Spring 2023 issue featuring articles on sustainable living and Jewish dietary traditions.',
    pdf_url: '/pdf/magazine-spring-2023.pdf'
  },
  {
    id: '2',
    title: 'Jewish Vegetarian Magazine - Winter 2022',
    date: '2022-12-01',
    r2_key: 'magazine-winter-2022.pdf',
    ocr_text: 'The winter 2022 issue of the Jewish Vegetarian Magazine focuses on the intersection of Jewish values and plant-based living. This edition includes articles on holiday recipes, environmental stewardship, and the ethical considerations of food choices. Readers will find traditional Jewish dishes reimagined with plant-based ingredients, along with discussions about how Jewish teachings support sustainable and compassionate eating practices.',
    summary: 'Winter 2022 issue exploring the intersection of Jewish values and plant-based living.',
    pdf_url: '/pdf/magazine-winter-2022.pdf'
  },
  {
    id: '3',
    title: 'Jewish Vegetarian Magazine - Autumn 2022',
    date: '2022-09-01',
    r2_key: 'magazine-autumn-2022.pdf',
    ocr_text: 'Autumn 2022 brings a harvest of seasonal recipes and articles on sustainable eating. This issue celebrates the bounty of fall produce while exploring Jewish agricultural traditions. Features include Sukkot recipes, discussions of food justice, and profiles of Jewish farmers and food activists. The magazine continues its mission of promoting ethical eating within the Jewish community.',
    summary: 'Autumn 2022 issue with recipes and articles on seasonal eating.',
    pdf_url: '/pdf/magazine-autumn-2022.pdf'
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json([]);
    }

    const searchTerm = query.toLowerCase();
    const results = [];

    // Simple search through OCR text and titles
    for (const magazine of mockMagazines) {
      const searchableText = `${magazine.title} ${magazine.ocr_text} ${magazine.summary}`.toLowerCase();
      
      if (searchableText.includes(searchTerm)) {
        // Create a snippet with highlighted search term
        const snippet = magazine.ocr_text || magazine.summary || magazine.title;
        const highlightedSnippet = snippet.replace(
          new RegExp(`(${searchTerm})`, 'gi'),
          '<mark>$1</mark>'
        );

        results.push({
          id: magazine.id,
          title: magazine.title,
          date: magazine.date,
          r2_key: magazine.r2_key,
          snippet: highlightedSnippet,
          pdf_url: magazine.pdf_url
        });
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching magazines:', error);
    return NextResponse.json(
      { error: 'Failed to search magazines' },
      { status: 500 }
    );
  }
} 