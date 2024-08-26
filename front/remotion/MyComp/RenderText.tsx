import React from 'react';
import { Style, Content } from './types';

const RenderText: React.FC<{
  content: Content;
  style: { heading: Style; subheading: Style };
}> = ({ content, style }) => (
  <>
    {content.heading && <h1 style={{ ...style.heading }}>{content.heading}</h1>}
    {content.subheading && (
      <h2 style={{ ...style.subheading }}>{content.subheading}</h2>
    )}
  </>
);

export { RenderText };
