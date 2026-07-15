const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Video = require('./models/Video');
const User = require('./models/User');

dotenv.config();

const dummyVideos = [
  {
    title: 'Introduction to React',
    description: 'Learn the basics of React.js',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=640&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Dummy video
    duration: '03:32',
    category: 'React',
  },
  {
    title: 'Advanced Tailwind CSS',
    description: 'Master Tailwind CSS for modern web design',
    thumbnail: 'https://images.unsplash.com/photo-1627398240309-08a9a27d2c36?q=80&w=640&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '03:32',
    category: 'CSS',
  },
  {
    title: 'Node.js Backend Architecture',
    description: 'Build robust scalable backends with Node.js',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=640&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '03:32',
    category: 'Node.js',
  },
  {
    title: 'MongoDB Schema Design',
    description: 'Learn how to design effective NoSQL databases',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=640&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '03:32',
    category: 'Database',
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');

    await Video.deleteMany();
    await Video.insertMany(dummyVideos);
    console.log('Dummy videos inserted successfully!');
    
    process.exit();
  } catch (error) {
    console.error('Error with data import', error);
    process.exit(1);
  }
};

importData();
