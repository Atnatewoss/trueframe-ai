# TrueFrame AI - Frontend Client

This directory contains the frontend for TrueFrame AI, a deepfake detection platform. The client is built using [Next.js](https://nextjs.org/) (App Router), React, and Tailwind CSS.

## Features

- **Video Upload**: An intuitive interface for users to upload videos for analysis.
- **Real-time API Integration**: Connects with the FastAPI backend to provide predictions.
- **Analysis Dashboard**: Displays deepfake probability and insights.

## Directory Structure

```text
client/
├── app/                  # Next.js App Router (pages and layouts)
│   ├── globals.css       # Global Tailwind styles
│   ├── layout.tsx        # Root layout wrapper
│   └── page.tsx          # Main landing/upload page
├── components/           # Reusable React UI components
├── public/               # Static assets
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS settings
└── package.json          # Node.js dependencies and scripts
```

## Getting Started

### Prerequisites

You need Node.js (version 18+ recommended) and `npm` installed.

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page will automatically reload if you make edits.

## Connecting to the Backend

By default, the client expects the backend API to be running on `http://127.0.0.1:8000`. Make sure to start the FastAPI server in the `../server` directory before attempting to upload videos for analysis.
