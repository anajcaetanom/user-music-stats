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


## Backend Architecture

The backend follows a layered architecture with clear separation of responsibilities:

- **Routes** — Define API endpoints and attach middlewares.
- **Controllers** — Handle HTTP requests/responses and call services.
- **Services** — Contain business logic and data processing.
- **Clients** — Communicate with external APIs (Spotify and Last.fm).
- **Middlewares** — Handle cross-cutting concerns such as authentication and error handling.

**Flow:**  
Route → Middleware → Controller → Service → Client → External API

**Structure:**
/src  
├── clients    
├── controllers  
├── middlewares  
├── routes
└── services


## Testing

The backend includes:
- **Unit tests** for services
- **Integration tests** for API routes

Tests are written using **Jest** and **Supertest**.


## License
Open-source project for educational and personal purposes.

