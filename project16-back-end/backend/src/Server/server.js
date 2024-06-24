import express from "express";
import { google } from "googleapis";
import OAuth2Data from "./credentials.json"; // Add the path to your OAuth 2.0 credentials
const cors = require("cors");

const app = express();
const PORT = 3000;
// const { PORT = 3001 } = process.env;
app.use(express.json());
app.use(cors());

const CLIENT_ID = OAuth2Data.client_id;
const CLIENT_SECRET = OAuth2Data.client_secret;
const REDIRECT_URI = OAuth2Data.redirect_uris[0];

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/blogger"];

app.get("/auth", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.redirect(url);
});

app.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  res.send("Authentication successful! You can now use the Blogger API.");
});

app.get("/blogs", async (req, res) => {
  oauth2Client.setCredentials({
    refresh_token: "your-refresh-token",
  });

  const blogger = google.blogger({ version: "v3", auth: oauth2Client });
  const response = await blogger.blogs.get({
    blogId: "4384002785269825300",
  });
  res.json(response.data);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// o connect the Google Blogger API to your project, you'll need to follow several steps. These include setting up a Google Cloud project, enabling the Blogger API, obtaining authentication credentials, and making API requests in your application.

// Step 1: Set Up a Google Cloud Project
// Go to the Google Cloud Console: Google Cloud Console.
// Create a New Project: Click the project drop-down and select or create a new project.
// Enable the Blogger API:
// In the Console, go to "APIs & Services" > "Library".
// Search for "Blogger API" and click on it.
// Click on "Enable".

// Step 2: Obtain OAuth 2.0 Credentials
// Go to the Credentials Page: In the Console, navigate to "APIs & Services" > "Credentials".
// Create Credentials:
// Click "Create Credentials" > "OAuth 2.0 Client ID".
// Set the application type to "Web application".
// Configure the consent screen (name, email, etc.).
// Add your authorized redirect URIs (e.g., http://localhost:3000/oauth2callback for development).
// Download Credentials:
// After creating your OAuth client ID, download the JSON file containing your client ID and client secret.

// Step 3: Integrate Blogger API in Your Application
// Backend (Node.js Example)
// Set up a simple Node.js server to handle the OAuth flow and API requests.

// #### Install Required Packages

// Install the necessary packages:
// npm install googleapis express

// #### Create server.js
// Google Cloud Platform
// Google Cloud Platform lets you build, deploy, and scale applications, websites, and services on the same infrastructure as Google.
// [4:24 PM]
// const express = require('express');
// const { google } = require('googleapis');
// const OAuth2Data = require('./credentials.json'); // Add the path to your OAuth 2.0 credentials

// const app = express();
// const PORT = 3000;

// const CLIENT_ID = OAuth2Data.web.client_id;
// const CLIENT_SECRET = OAuth2Data.web.client_secret;
// const REDIRECT_URI = OAuth2Data.web.redirect_uris[0];

// const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// const SCOPES = [
//   'https://www.googleapis.com/auth/blogger'
// ];

// app.get('/auth', (req, res) => {
//   const url = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES
//   });
//   res.redirect(url);
// });

// app.get('/oauth2callback', async (req, res) => {
//   const { code } = req.query;
//   const { tokens } = await oauth2Client.getToken(code);
//   oauth2Client.setCredentials(tokens);

//   res.send('Authentication successful! You can now use the Blogger API.');
// });

// app.get('/blogs', async (req, res) => {
//   oauth2Client.setCredentials({
//     refresh_token: 'your-refresh-token'
//   });

//   const blogger = google.blogger({version: 'v3', auth: oauth2Client});
//   const response = await blogger.blogs.get({
//     blogId: 'YOUR_BLOG_ID'
//   });
//   res.json(response.data);
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// Frontend (React Example)
// #### Trigger Authentication
// In your React component, you can provide a button to initiate authentication:

// import React from 'react';

// const GoogleAuthButton = () => {
//   const handleAuthClick = () => {
//     window.location.href = 'http://localhost:3000/auth';
//   };

//   return (
//     <button onClick={handleAuthClick}>
//       Authenticate with Google
//     </button>
//   );
// };

// export default GoogleAuthButton;

// Step 4: Handle OAuth Flow
// [4:24 PM]
// The backend handles the OAuth authentication and token exchange using the /auth and /oauth2callback endpoints. On successful authentication, the user is redirected to your callback URL with an authorization code, which you exchange for access tokens.

// Step 5: Make API Requests
// After obtaining the OAuth2 tokens, you can make requests to the Blogger API. For instance, the /blogs endpoint in your server retrieves data about a specific blog using the Blogger API.

// Important Notes
// Security: Keep your OAuth credentials secure. Do not hard-code sensitive information in your frontend.
// Refresh Tokens: Implement token refresh logic to maintain access without re-authentication.
// Deployment: Update your OAuth redirect URIs and credentials as needed for your production environment.

// Following these steps will help you connect the Google Blogger API to your project. Let me know if you need further assistance!

// Following these steps will help you connect the Google Blogger API to your project. Let me know if you need further assistance!

// June 20, 2024

// Lou Maiorino
// OP
//  — Yesterday at 9:30 PM
// where do i connect server.js

// Dot
// APP
//  — Yesterday at 9:30 PM
// You should connect and run server.js as your backend server which will handle the authentication and communication with the Google Blogger API. Here are the steps to integrate and connect it with your project:

// Step 1: Structure Your Project
// It’s good practice to have a specific folder structure. For example:

// /your-project
//   /client    ️️️            # Your React app
//     /src
//       /components
//         GoogleAuthButton.jsx
//       App.js
//       index.js
//     package.json
//   /server                     # Your Node.js server
//     server.js
//     credentials.json          # OAuth 2.0 credentials
//     package.json
//   package.json (root)         # To manage scripts for both client and server

// Step 2: Set Up and Run Your Server
// [9:30 PM]
// Navigate to the server directory and install dependencies:

// cd server
// npm init -y
// npm install express googleapis

// Add the server.js file in the server directory and include the implementation as described earlier:

// const express = require('express');
// const { google } = require('googleapis');
// const OAuth2Data = require('./credentials.json');

// const app = express();
// const PORT = 3000;

// const CLIENT_ID = OAuth2Data.web.client_id;
// const CLIENT_SECRET = OAuth2Data.web.client_secret;
// const REDIRECT_URI = OAuth2Data.web.redirect_uris[0];

// const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// const SCOPES = ['https://www.googleapis.com/auth/blogger'];

// app.get('/auth', (req, res) => {
//   const url = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES
//   });
//   res.redirect(url);
// });

// app.get('/oauth2callback', async (req, res) => {
//   const { code } = req.query;
//   const { tokens } = await oauth2Client.getToken(code);
//   oauth2Client.setCredentials(tokens);
//   res.send('Authentication successful! You can now use the Blogger API.');
// });

// app.get('/blogs', async (req, res) => {
//   oauth2Client.setCredentials({
//     refresh_token: 'your-refresh-token'
//   });
//   const blogger = google.blogger({ version: 'v3', auth: oauth2Client });
//   const response = await blogger.blogs.get({
//     blogId: 'YOUR_BLOG_ID'
//   });
//   res.json(response.data);
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// Run the server:

// node server.js

// Step 3: Update Your React App
// [9:30 PM]
// Implement the authentication button in your React app (e.g., in src/components/GoogleAuthButton.jsx):

// import React from 'react';

// const GoogleAuthButton = () => {
//   const handleAuthClick = () => {
//     window.location.href = 'http://localhost:3000/auth';
//   };

//   return (
//     <button onClick={handleAuthClick}>
//       Authenticate with Google
//     </button>
//   );
// };

// export default GoogleAuthButton;

// Use the GoogleAuthButton in your main app component (e.g., in src/App.js):

// import React from 'react';
// import GoogleAuthButton from './components/GoogleAuthButton';

// const App = () => {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>My Blog App</h1>
//         <GoogleAuthButton />
//       </header>
//     </div>
//   );
// };

// export default App;

// Run your React app:

// Navigate to the client directory.
// Ensure dependencies are installed via npm install.
// Start the React app:

// npm start

// Step 4: Enable Cross-Origin Requests (Optional)
// If you encounter any CORS issues, you may need to enable cross-origin requests in your backend server. Install cors in your server directory:

// npm install cors

// Then, update server.js:

// const cors = require('cors');

// app.use(cors());

// Summary
// Ensure your backend server (server.js) is running and can handle requests to authenticate and interact with the Google Blogger API.
// Integrate the authentication flow with your React frontend using the GoogleAuthButton.

// Let me know if there are any specific issues or questions as you proceed with these steps!

// Lou Maiorino
// OP
//  — Yesterday at 9:32 PM
// i only have a front end app setup, do i create a seperate backend app

// Dot
// APP
//  — Yesterday at 9:32 PM
// If you currently only have a frontend setup and you want to integrate the Google Blogger API, you will eventually need a backend server to handle secure operations, such as obtaining OAuth tokens. However, you can start with a very basic Node.js server for this purpose.

// Step-by-Step Guide to Adding a Backend Server
// Step 1: Create a Basic Backend Server
// Create a server directory in your project root.
// Navigate to the server directory and initialize a new Node.js project:
// mkdir server
// cd server
// npm init -y
// Install necessary dependencies:
// npm install express googleapis cors
// Add your OAuth 2.0 credentials:
// Place the credentials.json file that you downloaded from Google Cloud Console in the server directory.

// Step 2: Create and Configure server.js
// Create a server.js file in the server directory and add the following code:
// [9:32 PM]
// const express = require('express');
// const { google } = require('googleapis');
// const cors = require('cors');
// const OAuth2Data = require('./credentials.json');

// const app = express();
// const PORT = 5000;

// const CLIENT_ID = OAuth2Data.web.client_id;
// const CLIENT_SECRET = OAuth2Data.web.client_secret;
// const REDIRECT_URI = OAuth2Data.web.redirect_uris[0];

// const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// const SCOPES = ['https://www.googleapis.com/auth/blogger'];

// app.use(cors());

// app.get('/auth', (req, res) => {
//   const url = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   res.redirect(url);
// });

// app.get('/oauth2callback', async (req, res) => {
//   const { code } = req.query;
//   const { tokens } = await oauth2Client.getToken(code);
//   oauth2Client.setCredentials(tokens);

//   res.send('Authentication successful! You can now use the Blogger API.');
// });

// app.get('/blogs', async (req, res) => {
//   oauth2Client.setCredentials({
//     refresh_token: 'your-refresh-token',
//   });

//   const blogger = google.blogger({ version: 'v3', auth: oauth2Client });
//   const response = await blogger.blogs.get({
//     blogId: 'YOUR_BLOG_ID',
//   });
//   res.json(response.data);
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// Step 3: Run Your Backend Server
// Navigate to the server directory and start the server:
// node server.js

// Step 4: Update Your Frontend App
// Add authentication in your React component.

// #### GoogleAuthButton.jsx

// import React from 'react';

// const GoogleAuthButton = () => {
//   const handleAuthClick = () => {
//     window.location.href = 'http://localhost:5000/auth';
//   };

//   return (
//     <button onClick={handleAuthClick}>
//       Authenticate with Google
//     </button>
//   );
// };

// export default GoogleAuthButton;

// Use the GoogleAuthButton in your app component.

// #### App.js
// [9:32 PM]
// import React from 'react';
// import GoogleAuthButton from './components/GoogleAuthButton';

// const App = () => {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>My Blog App</h1>
//         <GoogleAuthButton />
//       </header>
//     </div>
//   );
// };

// export default App;

// Step 5: Run Your Frontend App
// Navigate to your frontend directory and start the React app:
// npm start

// Summary
// We've created a basic server with Node.js to handle OAuth.
// Integrated a simple button in your React app to start the OAuth flow.
// The backend handles secure communication with the Google Blogger API.

// By following these steps, you will have a basic backend setup to handle OAuth authentication and communicate with the Blogger API. Let me know if you need any further assistance!

// June 21, 2024

// Lou Maiorino
// OP
//  — Today at 3:56 PM
// I have hardcoded the blogs, what is the next step to implement the Api from Google blogger to my front-end project

// Dot
// APP
//  — Today at 3:56 PM
// To integrate the Google Blogger API seamlessly into your front-end project after hardcoding your blogs, follow these steps to fetch and display real data using the Google Blogger API.

// Step-by-Step Guide
// Step 1: Ensure Your Backend is Set Up
// Make sure your Node.js server is up and running as per the instructions given earlier. This server will handle OAuth authentication and API requests.

// #### Recap of server.js:

// Ensure server.js is running:
// node server.js

// Step 2: Modify Your Express Server to Return Blogs Data
// Update your backend server to fetch blogs dynamically and expose an endpoint to your frontend.

// #### server/server.js
// [3:56 PM]
// const express = require('express');
// const { google } = require('googleapis');
// const cors = require('cors');
// const OAuth2Data = require('./credentials.json');

// const app = express();
// const PORT = 5000;

// const CLIENT_ID = OAuth2Data.web.client_id;
// const CLIENT_SECRET = OAuth2Data.web.client_secret;
// const REDIRECT_URI = OAuth2Data.web.redirect_uris[0];

// const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// const SCOPES = ['https://www.googleapis.com/auth/blogger'];

// app.use(cors());

// app.get('/auth', (req, res) => {
//   const url = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   res.redirect(url);
// });

// app.get('/oauth2callback', async (req, res) => {
//   const { code } = req.query;
//   const { tokens } = await oauth2Client.getToken(code);
//   oauth2Client.setCredentials(tokens);

//   // Store the tokens securely in your application
//   res.send('<p>Authentication successful! You can close this tab.</p>');
// });

// app.get('/posts', async (req, res) => {
//   try {
//     const blogger = google.blogger({ version: 'v3', auth: oauth2Client });
//     const response = await blogger.posts.list({
//       blogId: 'YOUR_BLOG_ID', // replace with your blog ID
//     });
//     res.json(response.data.items);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// Step 3: Fetch Data from Your React App
// Update your React app to fetch blog posts data from the backend.

// #### Add a New Component to Fetch Blog Posts

// Create a new component BlogList to fetch and display blog posts.

// #### src/components/BlogList.jsx
// [3:56 PM]
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import BlogCard from './BlogCard';

// const BlogList = () => {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/posts');
//         setPosts(response.data);
//       } catch (error) {
//         console.error('Error fetching posts:', error);
//       }
//     };

//     fetchPosts();
//   }, []);

//   return (
//     <div className="blog-list">
//       {posts.map((post) => (
//         <BlogCard
//           key={post.id}
//           title={post.title}
//           description={post.content.slice(0, 150)}
//           image={post.images ? post.images[0].url : 'default-image-url'} // Handle image scenarios
//         />
//       ))}
//     </div>
//   );
// };

// export default BlogList;

// #### CSS for Blog List (if needed)

// You may need to add some additional styling for .blog-list, similar to what you have done earlier.

// Step 4: Use BlogList in Your App
// Update your App.js to use this new BlogList component.

// #### src/App.js

// import React from 'react';
// import GoogleAuthButton from './components/GoogleAuthButton';
// import BlogList from './components/BlogList';

// const App = () => {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>My Blog App</h1>
//         <GoogleAuthButton />
//       </header>
//       <main>
//         <BlogList />
//       </main>
//     </div>
//   );
// };

// export default App;

// Step 5: Run Your Applications
// Run the backend server:
// cd server
// node server.js
// Run the frontend React app:
// cd client
// npm start

// Summary
// Backend: Handles OAuth authentication and fetches blog data from Google Blogger API.
// Frontend: Makes a request to the backend to fetch and display blog posts dynamically.
// [3:56 PM]
// Ensure you replace 'YOUR_BLOG_ID' in the server with your actual Blogger blog ID. Let me know if you encounter any issues or need further assistance!

// Replying to Dot
// ON

// Send a message in "Header issue"
