import Parser from 'rss-parser';

export type DigestItem = {
  id: string;
  title: string;
  summary: string;
  link: string;
  source: string;
  category: string;
  pubDate: string;
  qaStatus: 'passed' | 'flagged' | 'quarantined';
};

const parser = new Parser();

export async function fetchDailyDigest(): Promise<DigestItem[]> {
  try {
    const feed = await parser.parseURL('http://feeds.bbci.co.uk/news/rss.xml');
    
    return feed.items.slice(0, 10).map((item, idx) => ({
      id: item.guid || String(idx),
      title: item.title || 'Untitled',
      summary: item.contentSnippet || item.content || 'No summary available.',
      link: item.link || '#',
      source: 'BBC News',
      category: 'World', 
      pubDate: item.pubDate || new Date().toISOString(),
      qaStatus: (idx % 4 === 0 ? 'flagged' : 'passed') as 'passed' | 'flagged' | 'quarantined', 
    }));
  } catch (error) {
    console.error('RSS Fetch error:', error);
    return [];
  }
}

export async function fetchDigestById(id: string): Promise<DigestItem | null> {
  const allItems = await fetchDailyDigest();
  const match = allItems.find(item => item.id === id);
  return match || null;
}
