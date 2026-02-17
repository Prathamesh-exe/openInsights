# openInsights

## Tagline
Real-time data visualization.

## Overview
openInsights is a full-stack application built with React 18, Vite, Express, Socket.IO, and ECharts. It provides users with dynamic visualizations and seamless interactions, making it easier to understand complex data.

## Key Features
- Multiple visualization types
- Real-time updates
- Dark mode
- Responsive design
- Fast performance
- Modern UI
- Data simulation
- Interactive charts
- Full/single report view

## Tech Stack
### Frontend
- React 18
- Vite
- Tailwind CSS
- ECharts
- Socket.IO Client
- React Icons
- React Loader Spinner

### Backend
- Express.js
- Socket.IO
- CORS
- dotenv
- Node.js

### Development Tools
- ESLint
- PostCSS
- PropTypes

## Project Structure
```
openInsights/
├── client/                 # Frontend code base
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── assets/         # Images, Fonts, etc.
│   │   ├── App.js          # Main application
│   │   └── index.js        # Entry point
│   └── public/             # Static files
├── server/                 # Backend code base
│   ├── index.js            # Entry point for server
│   └── routes/             # API routes
├── .env                    # Environment variables
└── README.md               # Documentation
```

## Getting Started
### Prerequisites
- Node.js (version X.X.X)
- NPM (version X.X.X)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Prathamesh-exe/openInsights.git
   cd openInsights
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Application
#### Development
```bash
dotenv -e .env npm run start
```
#### Production
```bash
npm run build
npm run serve
```

## Usage Guide
### Navigation
- The dashboard allows you to navigate through various visualization types.

### Data Simulation
- Data can be simulated using the built-in tools for testing and previewing.

### Supported Chart Types
- Line charts
- Bar charts
- Pie charts
- Scatter plots

### Data Format
Example JSON format:
```json
{
  "data": [
    {"x": 1, "y": 2},
    {"x": 2, "y": 3}
  ]
}
```

## API Endpoints
### HTTP
- `GET /api/data` - Fetches data for visualizations.

### WebSocket
- `ws://localhost:3000` - Connects to WebSocket for real-time data streams.

## Customization
- Users can customize visual settings via the settings menu.

## Development Commands
- Start development server: `npm run dev`
- Run tests: `npm test`

## Dependencies
- Refer to `package.json` for a complete list of dependencies.

## Troubleshooting Common Issues
- Ensure all dependencies are installed.
- Check for port conflicts.

## Contributing Guidelines
1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Submit a pull request.

## License
MIT

## Author
[Prathamesh-exe](https://github.com/Prathamesh-exe)

## Acknowledgments
- Thanks to the contributors and the open-source community.

## Support
For support, please open an issue on the GitHub repository.

---
Version 1.0.0