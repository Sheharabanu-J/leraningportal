# GVCC Learning Portal

A modern, full-stack educational platform built to deliver a seamless video learning experience with robust custom features like smart bookmarks, watch progress tracking, and screenshot protection.

## Features

- **Authentication System**: Secure JWT-based login and signup.
- **Custom Video Player**: Built on top of `react-player` with Picture-in-Picture, playback speed controls, and a fully custom UI.
- **Smart Bookmarks**: Users can add timestamped bookmarks to any video. Clicking a bookmark instantly seeks the player to that exact moment.
- **Continue Watching**: Progress is automatically saved every 5 seconds. Returning users are prompted to resume from where they left off.
- **Screenshot Protection**: The video player disables right-clicks, developer shortcuts, PrintScreen, copying, and blurs the video when the tab loses focus. A dynamic watermark displays the user's email and current time.
- **YouTube Related Videos**: Integrates the YouTube Data API v3 to automatically fetch and display related videos on the player page.
- **Discussion System**: A fully functional comments section for users to engage in discussions on videos.
- **Premium UI**: Utilizing modern web design principles including dark mode, glassmorphism (`glass-card`), and fluid animations with Framer Motion.

## Tech Stack

- **Frontend**: React.js (Vite), React Router DOM, Tailwind CSS, Axios, React Icons, Framer Motion, React-Toastify.
- **Backend (Optional)**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.

---

## 🚀 Running the Application

### Option A: Standalone Mock Mode (Recommended for testing without a database)
The frontend has been configured with an `axios-mock-adapter` that intercepts all API requests and perfectly simulates a backend using your browser's local storage. You do not need to start the backend or MongoDB!

1. Open a terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`. You can sign up, log in, watch videos, add bookmarks, and leave comments. Everything will persist across page reloads!

### Option B: Full-Stack Mode (Requires MongoDB)
If you want to run the actual backend server and connect it to a real MongoDB instance:

1. **Remove the Mock Adapter**: Open `frontend/src/utils/axiosConfig.js` and remove the `axios-mock-adapter` implementation, restoring it to a standard Axios instance.
2. Ensure you have MongoDB running locally on port `27017` (or provide an Atlas URI in `backend/.env`).
3. Start the backend:
   ```bash
   cd backend
   npm install
   npm run seed  # Populates dummy videos
   npm run dev
   ```
4. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Known Limitations
- **Screenshot Protection**: As browsers inherently limit control over the Operating System, the screenshot protection is a strong deterrent but cannot completely block OS-level tools like Snipping Tool or external screen recording software. We have implemented the best possible frontend measures (blur on focus loss, PrintScreen detection, disabled shortcuts, and dynamic watermarking).
- **YouTube API Quotas**: The related videos feature requires a valid YouTube Data API v3 key in your `.env` file. Be mindful of YouTube's daily quota limits.
