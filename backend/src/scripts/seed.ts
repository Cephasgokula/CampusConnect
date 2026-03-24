import 'dotenv/config';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

const run = async (): Promise<void> => {
  await connectDB();

  await Promise.all([User.deleteMany({}), Event.deleteMany({})]);

  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@cems.local';
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123';

  const admin = await User.create({
    name: 'CEMS Admin',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
    department: 'Administration'
  });

  const now = new Date();
  const events = [
    {
      title: 'AI Hackathon Sprint',
      description: '24-hour coding challenge focused on AI-driven campus solutions.',
      category: 'technical',
      date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      venue: 'Innovation Lab - Block A',
      capacity: 150,
      organizer: admin._id,
      banner: 'https://picsum.photos/seed/cems-ai-hackathon/1200/700',
      tags: ['tech', 'ai', 'hackathon', 'coding']
    },
    {
      title: 'Open Source Contribution Workshop',
      description: 'Learn Git workflows, PR etiquette, and real-world open-source collaboration.',
      category: 'workshop',
      date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      venue: 'Computer Lab 2',
      capacity: 100,
      organizer: admin._id,
      banner: 'https://picsum.photos/seed/cems-open-source/1200/700',
      tags: ['github', 'open-source', 'workshop', 'development']
    },
    {
      title: 'Cybersecurity Awareness Bootcamp',
      description: 'Practical session on phishing defense, password security, and safe browsing.',
      category: 'technical',
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      venue: 'Seminar Hall - C Block',
      capacity: 180,
      organizer: admin._id,
      banner: 'https://picsum.photos/seed/cems-cybersecurity/1200/700',
      tags: ['cybersecurity', 'security', 'tech']
    },
    {
      title: 'Cloud Computing Fundamentals',
      description: 'Beginner-friendly introduction to cloud architecture and deployment workflows.',
      category: 'seminar',
      date: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
      venue: 'Main Auditorium',
      capacity: 220,
      organizer: admin._id,
      banner: 'https://picsum.photos/seed/cems-cloud/1200/700',
      tags: ['cloud', 'aws', 'devops', 'seminar']
    },
    {
      title: 'UI/UX Design Jam',
      description: 'Rapid design challenge for building intuitive app interfaces.',
      category: 'workshop',
      date: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000),
      venue: 'Design Studio',
      capacity: 90,
      organizer: admin._id,
      banner: 'https://picsum.photos/seed/cems-uiux/1200/700',
      tags: ['ui', 'ux', 'design', 'prototype']
    },
    {
      title: 'Leadership Seminar 2026',
      description: 'Interactive seminar on leadership and communication.',
      category: 'seminar',
      date: new Date(now.getTime() + 13 * 24 * 60 * 60 * 1000),
      venue: 'Conference Hall',
      capacity: 200,
      organizer: admin._id,
      banner: 'https://picsum.photos/seed/cems-leadership/1200/700',
      tags: ['leadership', 'career']
    },
    {
      title: 'Annual Sports Fest',
      description: 'Inter-department sports competition and activities.',
      category: 'sports',
      date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      venue: 'College Ground',
      capacity: 300,
      organizer: admin._id,
      banner: 'https://picsum.photos/seed/cems-sports-fest/1200/700',
      tags: ['sports', 'fitness', 'competition']
    },
    {
      title: 'Cultural Night: Rhythm & Roots',
      description: 'Music, dance, and theatre performances by student clubs.',
      category: 'cultural',
      date: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000),
      venue: 'Open Air Theatre',
      capacity: 350,
      organizer: admin._id,
      banner: 'https://picsum.photos/seed/cems-cultural-night/1200/700',
      tags: ['cultural', 'music', 'dance', 'theatre']
    },
    {
      title: 'Entrepreneurship Meet-up',
      description: 'Startup founders and alumni share funding, product, and hiring insights.',
      category: 'seminar',
      date: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000),
      venue: 'Business School Auditorium',
      capacity: 170,
      organizer: admin._id,
      banner: 'https://picsum.photos/seed/cems-entrepreneurship/1200/700',
      tags: ['startup', 'business', 'entrepreneurship']
    },
    {
      title: 'Community Service Drive',
      description: 'Volunteer activity focused on literacy and community outreach.',
      category: 'other',
      date: new Date(now.getTime() + 24 * 24 * 60 * 60 * 1000),
      venue: 'NSS Office',
      capacity: 140,
      organizer: admin._id,
      banner: 'https://picsum.photos/seed/cems-community-service/1200/700',
      tags: ['volunteer', 'social', 'community']
    },
    {
      title: 'Inter-College Debate Championship',
      description: 'Competitive debate rounds judged by faculty and invited speakers.',
      category: 'cultural',
      date: new Date(now.getTime() + 26 * 24 * 60 * 60 * 1000),
      venue: 'Humanities Hall',
      capacity: 130,
      organizer: admin._id,
      banner: 'https://picsum.photos/seed/cems-debate/1200/700',
      tags: ['debate', 'public-speaking', 'culture']
    },
    {
      title: 'Wellness & Yoga Morning',
      description: 'Mindfulness, breathing, and yoga practices for stress relief.',
      category: 'sports',
      date: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000),
      venue: 'Indoor Sports Complex',
      capacity: 110,
      organizer: admin._id,
      banner: 'https://picsum.photos/seed/cems-yoga/1200/700',
      tags: ['wellness', 'yoga', 'health']
    },
    {
      title: 'Film Appreciation Evening',
      description: 'Screening and panel discussion on contemporary cinema.',
      category: 'cultural',
      date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      venue: 'Media Center',
      capacity: 160,
      organizer: admin._id,
      banner: 'https://picsum.photos/seed/cems-film-club/1200/700',
      tags: ['film', 'cinema', 'arts']
    }
  ];

  await Event.insertMany(events);

  // eslint-disable-next-line no-console
  console.log('Seed completed successfully');
  // eslint-disable-next-line no-console
  console.log(`Admin credentials: ${adminEmail} / ${adminPassword}`);

  process.exit(0);
};

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Seed failed', error);
  process.exit(1);
});
