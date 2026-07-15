import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const api = axios.create({
  baseURL: '/api',
});

// Setup mock adapter
const mock = new MockAdapter(api, { delayResponse: 500 }); // simulate network delay

// Initial Data
const dummyVideos = [
  {
    _id: 'v1',
    title: 'Introduction to React',
    description: 'Learn the basics of React.js including components, props, and state.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
    duration: '09:56',
    category: 'React',
  },
  {
    _id: 'v2',
    title: 'Modern JavaScript (ES6+)',
    description: 'Master JavaScript concepts required for modern web development.',
    thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=jS4aFq5-91M',
    duration: '10:53',
    category: 'JavaScript',
  },
  {
    _id: 'v3',
    title: 'Node.js Backend Architecture',
    description: 'Build robust scalable backends with Node.js and Express.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeEQ',
    duration: '00:15',
    category: 'Node.js',
  },
  {
    _id: 'v4',
    title: 'MongoDB Schema Design',
    description: 'Learn how to design effective NoSQL databases and relationships.',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=pWbMrx5rVBE',
    duration: '00:15',
    category: 'Database',
  }
];

// Helper to get from local storage
const getStorage = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};
const setStorage = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// --- Auth Endpoints ---
mock.onPost('/auth/signup').reply((config) => {
  const { name, email, password } = JSON.parse(config.data);
  const users = getStorage('mock_users', []);
  if (users.find(u => u.email === email)) {
    return [400, { message: 'User already exists' }];
  }
  const newUser = { _id: Date.now().toString(), name, email, password };
  users.push(newUser);
  setStorage('mock_users', users);
  return [201, { _id: newUser._id, name: newUser.name, email: newUser.email, token: 'mock-jwt-token' }];
});

mock.onPost('/auth/login').reply((config) => {
  const { email, password } = JSON.parse(config.data);
  const users = getStorage('mock_users', []);
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    return [200, { _id: user._id, name: user.name, email: user.email, token: 'mock-jwt-token' }];
  }
  return [401, { message: 'Invalid email or password' }];
});

// --- Video Endpoints ---
mock.onGet('/videos').reply(200, dummyVideos);

mock.onGet(/\/videos\/.+/).reply((config) => {
  // Check if it's the youtube related endpoint
  if (config.url.includes('/youtube/related/')) {
    const mockYoutube = [
      {
        id: { videoId: 'v1' },
        snippet: { title: 'Introduction to React', channelTitle: 'GVCC Channel', thumbnails: { medium: { url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&q=80' } } }
      },
      {
        id: { videoId: 'v3' },
        snippet: { title: 'Node.js Backend Architecture', channelTitle: 'GVCC Channel', thumbnails: { medium: { url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&q=80' } } }
      }
    ];
    return [200, mockYoutube];
  }

  const id = config.url.split('/').pop();
  const video = dummyVideos.find(v => v._id === id);
  if (video) return [200, video];
  return [404, { message: 'Video not found' }];
});

// --- Bookmark Endpoints ---
mock.onPost('/bookmarks').reply((config) => {
  const data = JSON.parse(config.data);
  const bookmarks = getStorage('mock_bookmarks', []);
  const newBookmark = { _id: Date.now().toString(), ...data };
  bookmarks.push(newBookmark);
  setStorage('mock_bookmarks', bookmarks);
  return [201, newBookmark];
});

mock.onGet('/bookmarks/all').reply(() => {
  const bookmarks = getStorage('mock_bookmarks', []);
  return [200, bookmarks];
});

mock.onGet(/\/bookmarks\/video\/.+/).reply((config) => {
  const videoId = config.url.split('/').pop();
  const bookmarks = getStorage('mock_bookmarks', []).filter(b => b.videoId === videoId);
  return [200, bookmarks];
});

mock.onPut(/\/bookmarks\/.+/).reply((config) => {
  const id = config.url.split('/').pop();
  const data = JSON.parse(config.data);
  let bookmarks = getStorage('mock_bookmarks', []);
  let updated = null;
  bookmarks = bookmarks.map(b => {
    if (b._id === id) {
      updated = { ...b, bookmarkName: data.bookmarkName };
      return updated;
    }
    return b;
  });
  setStorage('mock_bookmarks', bookmarks);
  return [200, updated];
});

mock.onDelete(/\/bookmarks\/.+/).reply((config) => {
  const id = config.url.split('/').pop();
  let bookmarks = getStorage('mock_bookmarks', []);
  bookmarks = bookmarks.filter(b => b._id !== id);
  setStorage('mock_bookmarks', bookmarks);
  return [200, { message: 'Deleted' }];
});

// --- Comments Endpoints ---
mock.onPost('/comments').reply((config) => {
  const data = JSON.parse(config.data);
  const comments = getStorage('mock_comments', []);
  const newComment = { 
    _id: Date.now().toString(), 
    ...data,
    createdAt: Date.now()
  };
  comments.push(newComment);
  setStorage('mock_comments', comments);
  return [201, newComment];
});

mock.onGet(/\/comments\/video\/.+/).reply((config) => {
  const videoId = config.url.split('/').pop();
  const comments = getStorage('mock_comments', []).filter(c => c.videoId === videoId);
  // Sort descending by date
  comments.sort((a, b) => b.createdAt - a.createdAt);
  return [200, comments];
});

// --- Progress Endpoints ---
mock.onPost('/progress').reply((config) => {
  const data = JSON.parse(config.data);
  let progressList = getStorage('mock_progress', []);
  let existing = progressList.find(p => p.videoId === data.videoId);
  
  if (existing) {
    existing.lastPosition = data.lastPosition;
    if (data.completed !== undefined) existing.completed = data.completed;
    existing.updatedAt = Date.now();
  } else {
    existing = { _id: Date.now().toString(), videoId: data.videoId, lastPosition: data.lastPosition, completed: data.completed, updatedAt: Date.now() };
    progressList.push(existing);
  }
  
  setStorage('mock_progress', progressList);
  return [200, existing];
});

mock.onGet('/progress/recent').reply((config) => {
  const progressList = getStorage('mock_progress', []);
  // Sort by updatedAt descending
  progressList.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  // Populate video details
  const recent = progressList.slice(0, 10).map(p => ({
    ...p,
    videoId: dummyVideos.find(v => v._id === p.videoId) || p.videoId
  }));
  return [200, recent];
});

mock.onGet(/\/progress\/.+/).reply((config) => {
  // If the url ends with recent, this shouldn't catch it because it was defined above
  const videoId = config.url.split('/').pop();
  const progress = getStorage('mock_progress', []).find(p => p.videoId === videoId);
  return [200, progress || { lastPosition: 0, completed: false }];
});

export default api;
