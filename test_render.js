import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './src/App.jsx';

try {
  const html = ReactDOMServer.renderToString(React.createElement(App));
  console.log("SUCCESS! Rendered length:", html.length);
  console.log("HTML snippet:", html.slice(0, 300));
} catch (err) {
  console.error("RENDER ERROR:", err);
}
