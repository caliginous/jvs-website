import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MagazineClient from './MagazineClient';

interface Magazine {
  id: string;
  title: string;
  date: string;
  r2_key: string;
  cover_image?: string;
  ocr_text?: string;
  summary?: string;
  pdf_url: string;
}

// Fetch magazines from the API at build time
async function getMagazines(): Promise<Magazine[]> {
  try {
    console.log('🔍 [MAGAZINE] Fetching magazines from API...');
    
    // Use the worker's API endpoint
    const response = await fetch('https://jvs-website.dan-794.workers.dev/api/list-magazines');
    
    if (!response.ok) {
      console.error('Failed to fetch magazines:', response.statusText);
      return [];
    }
    
    const magazines = await response.json();
    console.log(`🔍 [MAGAZINE] Fetched ${magazines.length} magazines`);
    return magazines;
  } catch (error) {
    console.error('Error fetching magazines:', error);
    return [];
  }
}

export default async function MagazineArchivePage() {
  const magazines = await getMagazines();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <MagazineClient initialMagazines={magazines} />
      <Footer />
    </div>
  );
} 