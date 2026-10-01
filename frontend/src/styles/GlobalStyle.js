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
      radial-gradient(circle at top left, rgba(255, 181, 71, 0.16), transparent 26%),
      radial-gradient(circle at top right, rgba(107, 214, 208, 0.16), transparent 22%),
      linear-gradient(180deg, #071820 0%, #081c24 100%);
    color: #f4f5ed;
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
    background: rgba(255, 181, 71, 0.35);
  }
`;
