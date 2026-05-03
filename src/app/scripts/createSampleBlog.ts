import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const sampleBlog = {
  id: 'global-textile-trends-2026',
  title: 'Global Textile Trends: What to Expect in 2026',
  excerpt: 'As the textile industry shifts towards sustainability, India is emerging as a leader in organic cotton and recycled fabrics. Discover the key trends shaping the future of exports.',
  content: `
    <h2>The Rise of Sustainable Textiles</h2>
    <p>The global textile market is undergoing a massive transformation. With increasing consumer awareness about environmental impact, brands are shifting their sourcing strategies towards eco-friendly materials.</p>
    
    <h3>India's Competitive Advantage</h3>
    <p>India, being one of the largest producers of cotton in the world, has a unique advantage. The integration of traditional craftsmanship with modern sustainable practices is making Indian textiles highly sought after in European and American markets.</p>
    
    <h3>Key Trends to Watch</h3>
    <ul>
      <li><strong>Organic Cotton:</strong> Significant growth in demand for GOTS-certified fabrics.</li>
      <li><strong>Recycled Polyester:</strong> Innovations in textile-to-textile recycling.</li>
      <li><strong>Natural Dyes:</strong> A return to plant-based dyeing processes.</li>
    </ul>
    
    <p>At ABC International, we are committed to helping our partners navigate these shifts by providing reliable sourcing and quality assurance for the next generation of textiles.</p>
  `,
  image: 'https://images.unsplash.com/photo-1558444479-c8485183056e?auto=format&fit=crop&q=80&w=1200',
  author: 'Sourcing Expert',
  is_visible: true
};

async function createSample() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from('blogs')
    .upsert(sampleBlog)
    .select();

  if (error) {
    console.error('Error creating sample blog:', error);
  } else {
    console.log('Sample blog created successfully:', data);
  }
}

createSample();
