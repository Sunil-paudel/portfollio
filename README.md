
# Sunil Paudel (Sunny) - Full-Stack Developer Portfolio

This repository contains the source code for the personal portfolio website of Sunil Paudel (Sunny), a Full-Stack Developer graduate. The portfolio showcases projects, skills, and professional experience.

The application is built with Next.js, React, TypeScript, Tailwind CSS, ShadCN UI components, and uses Genkit for AI-powered features (when enabled).

## Features

*   **Responsive Design**: Adapts to various screen sizes (desktop, tablet, mobile).
*   **Dynamic Content**: Portfolio data (name, title, about me, skills, projects) is managed via `src/lib/default-portfolio-data.ts` and can be updated.
*   **Project Showcase**: Displays projects with descriptions, images, and links.
*   **Skills Section**: Lists technical and soft skills.
*   **Contact Form**: Allows visitors to send messages (requires email sending setup).
*   **SEO Optimized**: Basic on-page SEO practices implemented for better search engine visibility.
*   **(Previously) AI Chatbot**: Functionality for an AI-powered chatbot to answer questions about the portfolio (currently removed, can be re-added).
*   **(Previously) Resume Parsing**: Functionality to extract data from a resume to pre-fill profile information (currently uses a static file `public/sunil resume final.txt`).

## Getting Started

To get started with this project locally:

1.  **Clone the repository**:
    ```bash
    git clone [repository-url]
    cd portfolio # or your project directory name
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env` file in the root of the project and add necessary environment variables. At a minimum, for AI features (if re-enabled) and potentially for the contact form:
    ```env
    # For Genkit AI features (if used)
    GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY

    # For Nodemailer (contact form) - GMAIL EXAMPLE
    GOOGLE_EMAIL=your-email@gmail.com
    GOOGLE_PASSWORD=your-gmail-app-password 
    # Note: For Gmail, you'll likely need to generate an "App Password"
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:9002`.

5.  **(If AI features are used) Run the Genkit development server** (in a separate terminal):
    ```bash
    npm run genkit:dev
    ```

## Deployment

This Next.js application can be deployed to various platforms like Vercel, Netlify, or Firebase App Hosting.

For Firebase App Hosting, an `apphosting.yaml` is provided.

## Customization

*   **Portfolio Content**: Modify `src/lib/default-portfolio-data.ts` to update your personal information, skills, and projects.
*   **Styling**: Customize Tailwind CSS and ShadCN UI components. The theme is primarily configured in `src/app/globals.css`.
*   **Images**: Replace placeholder images and the profile picture in the `public` folder or update URLs in `default-portfolio-data.ts`. Update `data-ai-hint` attributes on images if you use AI to find replacements.

## SEO Notes

*   The `src/app/layout.tsx` file contains important `<meta>` tags for SEO.
*   **Update `NEXT_PUBLIC_SITE_URL`**: You'll need to set this environment variable (or update it directly in `src/app/layout.tsx`) to your actual deployed domain for Open Graph image URLs and canonical URLs to work correctly.
*   A basic `public/robots.txt` is included. Consider generating and linking a `sitemap.xml` for larger sites.

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
# portfolio
