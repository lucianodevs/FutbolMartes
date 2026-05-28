import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

  :root {
    color-scheme: dark;
  }

  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
    background:
      radial-gradient(circle at top left, rgba(61, 220, 151, 0.18), transparent 26%),
      radial-gradient(circle at top right, rgba(77, 163, 255, 0.15), transparent 22%),
      linear-gradient(180deg, #06101c 0%, #081523 100%);
    color: #ecf5ff;
    min-height: 100vh;
    overflow-x: hidden;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }

  ::selection {
    background: rgba(61, 220, 151, 0.35);
  }
`;
