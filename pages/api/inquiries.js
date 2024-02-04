import { Contact } from '@/models/Contact';
import { mongooseConnect } from '@/lib/mongoose';

export default async function handle(req, res) {
  await mongooseConnect();

  if (req.method === 'GET') {
    try {
      const inquiries = await Contact.find();
      res.json(inquiries);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
