# HelpingHand

This project is a web application that allows non-profit organizations to manage and optimize their volunteer activities. The application lets administrators create events, match volunteers to events, and manage notifications, while volunteers can view event details, manage their profiles, and see their participation history.

## Getting Started

You can either visit our website at [https://helpinghand-t7.vercel.app/](https://helpinghand-t7.vercel.app/) or follow the steps below to clone the repository and run the application locally.

1. **Clone the repository**:  
   ```bash
   # HTTPS
   git clone https://github.com/richerduong/helpinghand.git
   # or SSH
   git clone git@github.com:richerduong/helpinghand.git
   ```
2. **Navigate to the project directory**:  
   ```bash
   cd helpinghand
   ```
3. **Install dependencies**:  
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```
4. **Set up environment variables**:  
   Create a `.env` file in the root of your project and add the following environment variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://sjmgjdezmeywsmjrpcuc.supabase.co
   NEXT_PUBLIC_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqbWdqZGV6bWV5d3NtanJwY3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyNDU5MzMsImV4cCI6MjA0MzgyMTkzM30.zkcmloC9aMf5-UXtwfdKJZB6EYc6LWzDv6-pyXWZyO8
   ```
5. **Run the development server**:  
   ```bash
   npm run dev
   ```
6. **Open your browser**:  
   Visit http://localhost:3000 in your browser to access the application

## Testing
- To execute the test suite, run:
   ```
   npm run test
   ```
   ![image](https://github.com/user-attachments/assets/d91ae44e-d265-4ce2-af73-3e07ab6e6331)
