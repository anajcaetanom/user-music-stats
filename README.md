# Music Stats Dashboard

This project is a React application that lets you view your personal music statistics from Spotify and Last.fm. You can choose the source, select categories and time periods to see your most listened artists, tracks, and albums.

## Features

- Integration with Spotify and Last.fm
- OAuth authentication for Spotify
- Select time range for statistics:
  - **Spotify:** Last month, 6 months, Last year
  - **Last.fm:** Last week, Last month, 6 months, Last year
- Select category:
  - **Spotify:** Top Tracks, Top Artists
  - **Last.fm:** Top Tracks, Top Artists, Top Albums
- Data visualization in charts and lists
- Responsive and simple interface, inspired by Windows 98


## Technologies Used

- React (Hooks, Context API)
- Axios for HTTP requests
- Spotify API
- Last.fm API
- Custom CSS + 98.css for a Windows 98-style interface


## Project Structure

- `/src/components` — React UI components
- `/src/context` — Contexts for global state
- `/src/App.js` — Main component
- `/src/App.css` — Main styles

## How to run locally

1. Clone the repository:

  ```bash
  git clone https://github.com/your-user/your-repo.git
  ```

1. Navigate to the backend folder:

  ```bash
  cd user-music-stats/backend
  ```

1. Create the `.env` file and fill in the required fields:

  ```bash
  cp .env.example .env
  ```

1. Install backend dependencies:

  ```bash
  npm install
  ```

1. Repeat the same steps in the frontend folder:

  ```bash
  cd ../frontend
  cp .env.example .env
  npm install
  npm run dev
  ```



## License
Open-source project for educational and personal purposes.

