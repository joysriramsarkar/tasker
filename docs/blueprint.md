# **App Name**: টাস্কার

## Core Features:

- Firebase Authentication: Secure user authentication using Google, Facebook, Microsoft, and Apple.
- Task Input and Display (Bengali): Input fields and display lists with full Bengali localization, including date formatting.
- Timer and Duration Tracking: Start, pause, and resume timer to track task duration; modal for capturing actual time spent, editable by user.
- Firestore Integration: Saving and fetching tasks to/from Firestore, ensuring user-specific data storage in the `/users/{userId}/tasks` collection.
- Completed Tasks History: Display list of completed tasks from Firestore, grouped by date and fully localized in Bengali.
- Dashboard Visualizations: Display weekly productivity, task distribution, and completion analysis using Chart.js with Bengali labels.
- AI-Powered Task Report (Bengali): Use Gemini to analyze incomplete tasks and provide personalized, actionable productivity advice in Bengali. The model will be used as a tool for motivational coaching.

## Style Guidelines:

- Primary color: Deep sky blue (#00BFFF) to evoke a sense of focus and serenity, conducive to productivity.
- Background color: Light gray (#F0F8FF), providing a neutral backdrop that ensures readability.
- Accent color: Coral (#FF8066), used sparingly for important interactive elements.
- Font: 'PT Sans', sans-serif, to display both headings and body text; a font for a modern and easily readable feel in Bengali.
- Code font: 'Source Code Pro' for displaying code snippets.
- Fully responsive design using Tailwind CSS, ensuring optimal viewing experience across all devices. The layout must feature high information density and readability, especially considering the use of the Bengali script.
- Clean and consistent icons representing common task management actions and statuses.
- Subtle transitions and animations for a polished user experience; loading indicators in key AI actions, like loading report for user.