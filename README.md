# EMORA - Emoji Generator

**Live Demo**: [https://emoraa.vercel.app/](https://emoraa.vercel.app/)

EMORA is a modern, fast, and interactive web application that allows users to quickly generate and discover emojis based on text prompts. Built with React and Vite, the application features a sleek, responsive user interface and seamless integrations with powerful emoji-generation APIs.

---

## 🚀 Features

- **Instant Emoji Generation**: Convert textual descriptions into high-quality emojis in seconds.
- **Trending & Discovery**: Browse global trending emojis and popular searches directly from the home page.
- **Search History**: Automatically saves your most recent searches and generated emojis locally for quick access.
- **One-Click Copy & Export**: Easily copy emojis to your clipboard or download them as image files.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.

## 💻 Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```text
frontend/
├── public/                 # Static assets
├── src/
│   ├── lib/                # Utility functions (e.g., tailwind merge)
│   ├── services/           # API integration (emoji generation logic)
│   ├── App.jsx             # Main application component and routing
│   ├── index.css           # Global stylesheets and Tailwind configurations
│   └── main.jsx            # Application entry point
├── package.json            # Project dependencies and scripts
└── vite.config.js          # Vite build configuration
```

## 🛠️ Installation & Setup

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/mdjameee400/EMORA.git
cd EMORA/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the project.
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
