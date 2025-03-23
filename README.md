# AI Avatar Assistant for IDMS ERP

<div align="center">
  <img src="https://cdn.pixabay.com/photo/2023/01/22/13/46/machine-learning-7736623_1280.jpg" alt="AI Avatar Assistant Logo" width="300px">
  
  <p>
    <b>A next-generation AI-driven assistant with human-like avatar capabilities designed specifically for IDMS ERP support.</b>
  </p>
  
  <p>
    <a href="#key-features">Key Features</a> •
    <a href="#live-demo">Live Demo</a> •
    <a href="#screenshots">Screenshots</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#installation">Installation</a> •
    <a href="#api-reference">API Reference</a> •
    <a href="#development-workflow">Development</a> •
    <a href="#deployment">Deployment</a> •
    <a href="#troubleshooting">Troubleshooting</a>
  </p>
</div>

<hr>

## 🌟 Key Features

<div align="center">
  <img src="https://cdn.pixabay.com/photo/2022/08/05/09/05/gradient-7366403_1280.jpg" alt="Features Overview" width="90%">
</div>

The AI Avatar Assistant combines cutting-edge technologies to provide a seamless and intuitive user experience:

- **🧠 Intelligent Responses**: Leverages Google Gemini AI model to provide accurate ERP-specific information
- **👤 Realistic Avatars**: Lifelike visual representation with real-time lip-syncing and emotional expressions
- **🔊 Natural Voice Interaction**: Supports voice input and output with lifelike speech synthesis
- **🌐 Multilingual Support**: Operates in 7 languages including English, Spanish, Hindi, and more
- **💡 Context Awareness**: Maintains conversation history for contextually relevant responses
- **📊 Real-time Metrics**: Displays response time, accuracy, memory usage, and other performance indicators
- **📱 Responsive Design**: Works seamlessly across devices of all sizes
- **🔐 Secure Integration**: Safe connection to your existing IDMS ERP system

## 🎮 Live Demo

Try out the AI Avatar Assistant in our live environment:

<div align="center">
  <a href="https://ai-avatar-assistant.vercel.app" target="_blank">
    <img src="https://cdn.pixabay.com/photo/2016/12/09/04/02/presents-1893642_1280.jpg" alt="Live Demo Button" width="300px">
  </a>
</div>

- [Frontend Demo](https://ai-avatar-assistant.vercel.app)
- [Backend API](https://ai-avatar-assistant-backend.railway.app)

## 📸 Screenshots

<div align="center">
  <img src="https://cdn.pixabay.com/photo/2019/06/17/19/48/source-4280758_1280.jpg" alt="AI Avatar Interface" width="90%">
  <p><i>The main avatar interface showing the interactive visualization</i></p>
  
  <br>
  
  <div>
    <img src="https://cdn.pixabay.com/photo/2018/05/04/20/01/website-3374825_1280.jpg" alt="Chat Interface" width="48%">
    <img src="https://cdn.pixabay.com/photo/2020/01/26/21/57/computer-4796017_1280.jpg" alt="Mobile View" width="48%">
  </div>
  <p><i>The chat interface (left) and responsive mobile view (right)</i></p>
</div>

## 🏗️ Architecture

<div align="center">
  <img src="https://cdn.pixabay.com/photo/2019/06/13/11/28/team-4271642_1280.jpg" alt="System Architecture" width="90%">
</div>

The AI Avatar Assistant uses a microservices architecture with:

### 🧩 Components

- **Frontend (Next.js)**: Handles UI rendering, user interactions, and avatar visualization
- **Backend (Node.js)**: Manages API requests, AI processing, and database interactions
- **AI Services**: Connects to Google Gemini for natural language understanding
- **Voice Services**: Utilizes ElevenLabs for realistic speech synthesis
- **Avatar Services**: Integrates with D-ID for realistic avatar animations
- **Vector Database**: Uses Pinecone for efficient knowledge retrieval

### ⚙️ Data Flow

<div align="center">
  <img src="https://cdn.pixabay.com/photo/2018/02/09/19/39/flow-chart-3142180_1280.jpg" alt="Data Flow Diagram" width="80%">
</div>

```mermaid
graph LR
    User([User]) -->|Text/Voice Input| Frontend
    Frontend -->|WebSocket| Backend
    Backend -->|Query| AI[AI Services]
    Backend -->|Speech Request| Voice[Voice Services]
    Backend -->|Animation Request| Avatar[Avatar Services]
    Backend -->|Vector Search| DB[Vector Database]
    AI -->|Response| Backend
    Voice -->|Audio| Backend
    Avatar -->|Animation Data| Backend
    DB -->|Knowledge| Backend
    Backend -->|Response Data| Frontend
    Frontend -->|Display/Audio/Animation| User
```

1. User inputs text or voice through the frontend
2. Request is sent to backend via Socket.io for real-time communication
3. Backend processes request and interacts with AI services
4. Response is generated and sent back to frontend
5. Frontend displays text response and animates avatar accordingly

## 🚀 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- API keys for:
  - [Google Gemini API](https://ai.google.dev/)
  - [ElevenLabs](https://elevenlabs.io/)
  - [D-ID](https://www.d-id.com/)
  - [Pinecone](https://www.pinecone.io/)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/AI-Avatar-Assistant.git
cd AI-Avatar-Assistant

# Install dependencies for both frontend and backend
cd frontend && npm install
cd ../backend && npm install

# Set up environment variables
# Frontend (.env.local)
cp frontend/.env.example frontend/.env.local
# Backend (.env)
cp backend/.env.example backend/.env

# Start both services (from project root)
npm run dev
```

### Environment Configuration

#### Backend (.env)

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
DID_API_KEY=your_did_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX=your_pinecone_index_name
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_DID_CLIENT_KEY=your_did_client_key_here
NEXT_PUBLIC_DID_AGENT_ID=your_did_agent_id_here
```

## 📚 API Reference

<div align="center">
  <img src="https://cdn.pixabay.com/photo/2017/06/14/16/20/network-2402637_1280.jpg" alt="API Reference Overview" width="80%">
</div>

The backend provides several API endpoints to support the AI Assistant functionality:

### Chat Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Send a message to the AI assistant |
| `/api/chat/history` | GET | Retrieve chat history |
| `/api/chat/reset` | POST | Reset the conversation |

### Voice Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/voice/synthesize` | POST | Convert text to speech |
| `/api/voice/transcribe` | POST | Convert speech to text |

### Avatar Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/avatar/animate` | POST | Generate avatar animation |
| `/api/avatar/customize` | POST | Customize avatar appearance |

### Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `user-message` | Client → Server | Send user message |
| `ai-response` | Server → Client | Receive AI response |
| `bot-message` | Server → Client | Receive avatar speaking text |
| `error` | Server → Client | Error notification |

## 👨‍💻 Development Workflow

<div align="center">
  <img src="https://cdn.pixabay.com/photo/2018/04/06/13/46/poly-3295856_1280.jpg" alt="Development Workflow" width="80%">
</div>

```mermaid
flowchart TD
    subgraph Development
        FrontEnd[Frontend Development]
        BackEnd[Backend Development]
        FullStack[Full-Stack Testing]
        
        FrontEnd --> FullStack
        BackEnd --> FullStack
    end
    
    subgraph CI/CD
        Lint[Linting & Style Check]
        Test[Automated Tests]
        Build[Build Process]
        Deploy[Deployment]
        
        Lint --> Test
        Test --> Build
        Build --> Deploy
    end
    
    Development --> CI/CD
```

### Frontend Development

```bash
cd frontend
npm run dev
```

This starts the Next.js development server with hot reloading at `http://localhost:3000`.

### Backend Development

```bash
cd backend
npm run dev
```

This starts the Express server with nodemon for auto-reloading at `http://localhost:5000`.

### Full-Stack Development

For convenience, you can start both services simultaneously:

```bash
# From project root
npm run dev
# Or use the provided script
./start-all.bat
```

### Testing

```bash
# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend && npm test

# Run e2e tests
npm run test:e2e
```

### Code Style

This project uses ESLint and Prettier for code formatting. Run linting with:

```bash
# Frontend
cd frontend && npm run lint

# Backend
cd backend && npm run lint

# Fix issues
npm run lint:fix
```

## 🚢 Deployment

<div align="center">
  <img src="https://cdn.pixabay.com/photo/2018/03/15/16/11/background-3228704_1280.jpg" alt="Deployment Overview" width="90%">
</div>

```mermaid
graph TD
    Dev[Development] -->|Push to GitHub| GitHub[GitHub Repository]
    
    GitHub -->|Frontend Deployment| Vercel
    GitHub -->|Backend Deployment| Railway
    
    Vercel -->|Environment Setup| VercelEnv[Environment Variables]
    Railway -->|Environment Setup| RailwayEnv[Environment Variables]
    
    VercelEnv -->|Configure Endpoints| FrontendURL[Frontend URL]
    RailwayEnv -->|Configure Services| BackendURL[Backend URL]
    
    FrontendURL --> Production[Production Environment]
    BackendURL --> Production
```

### Frontend (Vercel)

1. Fork/clone this repository to your GitHub account
2. Sign up for [Vercel](https://vercel.com)
3. Create a new project and import your GitHub repository
4. Configure the project:
   - Root Directory: `/frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables from your `.env.local` file
6. Deploy and get your production URL

<div align="center">
  <img src="https://cdn.pixabay.com/photo/2018/04/17/11/03/database-3327251_1280.jpg" alt="Vercel Deployment" width="70%">
</div>

### Backend (Railway)

1. Sign up for [Railway](https://railway.app)
2. Create a new project from your GitHub repository
3. Configure the project:
   - Root Directory: `/backend`
   - Start Command: `npm start`
4. Add all required environment variables
5. Deploy and get your production URL
6. Update your frontend's `NEXT_PUBLIC_BACKEND_URL` to point to your Railway URL

<div align="center">
  <img src="https://cdn.pixabay.com/photo/2018/05/16/18/16/cloud-3406627_1280.jpg" alt="Railway Deployment" width="70%">
</div>

## 🧩 Project Structure

```
AI-Avatar-Assistant/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   │   ├── page.tsx      # Main application page
│   │   │   └── layout.tsx    # Application layout
│   │   ├── components/       # React components
│   │   │   ├── MessageBubble.tsx     # Chat message component
│   │   │   ├── VoiceInput.tsx        # Voice input component
│   │   │   └── BackgroundEffects.tsx # UI background effects
│   │   ├── lib/              # Utility functions and services
│   │   └── styles/           # CSS files
│   │       └── globals.css   # Global styles
│   ├── public/               # Static assets
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                  # Express backend application
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   │   ├── ai.service.ts        # AI processing service
│   │   │   ├── avatar.service.ts    # Avatar generation service
│   │   │   ├── voice.service.ts     # Voice synthesis service
│   │   │   └── knowledge.service.ts # Knowledge base service
│   │   └── index.ts          # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                     # Documentation
├── scripts/                  # Utility scripts
│   └── start-all.bat         # Script to start both services
├── package.json              # Root package.json for workspaces
└── README.md                 # This file
```

## 🔧 Troubleshooting

<div align="center">
  <img src="https://cdn.pixabay.com/photo/2019/09/23/09/15/technical-support-4497754_1280.jpg" alt="Troubleshooting Guide" width="80%">
</div>

```mermaid
flowchart TD
    Issue[Issue Detected] --> CheckEnv{Check Environment Variables}
    CheckEnv -->|Incorrect| FixEnv[Fix Environment Variables]
    CheckEnv -->|Correct| CheckConn{Check Connectivity}
    
    CheckConn -->|Failed| FixConn[Check Network/Firewall]
    CheckConn -->|OK| CheckBrowser{Check Browser Compatibility}
    
    CheckBrowser -->|Incompatible| ChangeBrowser[Try Different Browser]
    CheckBrowser -->|Compatible| CheckLogs{Check Console Logs}
    
    CheckLogs --> OpenIssue[Open GitHub Issue]
```

### Common Issues

#### D-ID Integration Issues

If the avatar is not appearing:

1. Check that your D-ID API key is valid
2. Ensure the agent ID is correctly set in the environment variables
3. Check browser console for any CORS-related errors
4. Try refreshing the page or clearing cache

#### Socket Connection Issues

If real-time communication is not working:

1. Verify that your backend is running and accessible
2. Check that the `NEXT_PUBLIC_BACKEND_URL` is correctly set
3. Ensure no firewall is blocking WebSocket connections
4. Try using polling transport as a fallback

#### Voice Recognition Issues

If voice input is not working:

1. Make sure you've granted microphone permissions in your browser
2. Check that your browser supports the Web Speech API
3. Ensure you're in a quiet environment for better recognition
4. Try speaking clearly and at a moderate pace

### Debug Mode

Enable debug mode to see additional information:

```javascript
// In frontend/.env.local
NEXT_PUBLIC_DEBUG_MODE=true
```

This will display additional debugging information in the browser console and UI.

## 📊 Performance Optimization

<div align="center">
  <img src="https://cdn.pixabay.com/photo/2016/10/30/23/05/graphs-1784620_1280.png" alt="Performance Metrics" width="80%">
</div>

The AI Avatar Assistant is optimized for performance:

- **Lazy Loading**: Components and resources load only when needed
- **Caching**: Frequent queries are cached to reduce API calls
- **Compression**: Assets are compressed for faster loading
- **Code Splitting**: Only essential JavaScript is loaded initially
- **WebSocket**: Real-time communication minimizes latency
- **Optimized Animations**: UI animations are hardware-accelerated

## 📌 Roadmap

<div align="center">
  <img src="https://cdn.pixabay.com/photo/2019/09/22/16/20/road-4496437_1280.jpg" alt="Project Roadmap" width="90%">
</div>

```mermaid
gantt
    title AI Avatar Assistant Roadmap
    dateFormat  YYYY-MM-DD
    
    section Current
    Enhanced UI & UX      :done, UI1, 2023-12-01, 2024-01-15
    D-ID Integration      :done, DID1, 2023-12-15, 2024-01-30
    
    section Q1 2024
    Enhanced Facial Expressions  :active, EFE, 2024-01-15, 2024-03-01
    Multi-Avatar Support         :active, MAS, 2024-02-01, 2024-03-15
    
    section Q2 2024
    API Gateway                  :APG, after MAS, 45d
    Analytics Dashboard          :ADA, after APG, 30d
    
    section Q3 2024
    Extended Language Support    :ELS, 2024-07-01, 60d
    Mobile Apps Development      :MAD, 2024-08-01, 90d
```

### Upcoming Features

- **Enhanced Facial Expressions**: More realistic emotion display
- **Multi-Avatar Support**: Switch between different avatar personalities
- **API Gateway**: Simplified integration with enterprise systems
- **Analytics Dashboard**: Track usage and performance metrics
- **Extended Language Support**: Additional languages and dialects
- **Mobile Apps**: Native iOS and Android applications

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See our [Contributing Guide](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Google Gemini API](https://ai.google.dev/) for advanced language processing
- [ElevenLabs](https://elevenlabs.io/) for realistic voice synthesis
- [D-ID](https://www.d-id.com/) for avatar generation
- [Pinecone](https://www.pinecone.io/) for vector database capabilities
- [Next.js](https://nextjs.org/) and [React](https://reactjs.org/) for the frontend framework
- [Express](https://expressjs.com/) for the backend API
- [Socket.io](https://socket.io/) for real-time communication
- [Tailwind CSS](https://tailwindcss.com/) for UI styling

---

<div align="center">
  <p>Built with ❤️ by the AI Avatar Assistant Team</p>
  <p>
    <a href="https://github.com/yourusername/AI-Avatar-Assistant/issues">Report Bug</a> •
    <a href="https://github.com/yourusername/AI-Avatar-Assistant/issues">Request Feature</a>
  </p>
</div> 
