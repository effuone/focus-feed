export interface Animation {
  type: 'fade-in' | 'slide-in' | 'zoom-in' | 'fade-out' | 'zoom-out';
  direction?: 'left' | 'right';
  durationInSeconds: number;
}

export interface Style {
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  marginBottom?: string;
  width?: string;
  maxWidth?: string;
  borderRadius?: string;
  margin?: string;
  color?: string;
}

export interface Content {
  heading?: string;
  subheading?: string;
}

export interface Scene {
  title?: string;
  description?: string;
  image?: string;
  durationInSeconds: number;
  voiceover?: string;
  animation?: Animation;
  style: {
    title?: Style;
    description?: Style;
    image?: Style;
  };
}

export interface VideoData {
  title: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  intro: {
    durationInSeconds: number;
    content: Content;
    voiceover: string;
    animation?: Animation;
    style: {
      heading: Style;
      subheading: Style;
    };
  };
  scenes: Scene[];
  outro: {
    durationInSeconds: number;
    content: Content;
    voiceover: string;
    animation?: Animation;
    style: {
      heading: Style;
      subheading: Style;
    };
  };
}

export const prompt = `You are a creative assistant tasked with transforming a chapter from a book into a detailed JSON structure that will be used to create a video. The video should include an introduction, multiple scenes, and an outro, with each scene representing a key concept or part of the chapter. Each part should include animations, voiceovers, and appropriate styles.

Given the following book chapter content:

Generate a JSON object in the following format:

{
  "title": "Title of the Video",
  "backgroundColor": "#hexcolor",
  "textColor": "#hexcolor",
  "fontFamily": "font-family-name",
  "intro": {
    "durationInSeconds": 5,
    "content": {
      "heading": "Intro Heading",
      "subheading": "Intro Subheading"
    },
    "voiceover": "Voiceover text for the intro.",
    "animation": {
      "type": "zoom-out",
      "durationInSeconds": 1
    },
    "style": {
      "heading": {
        "fontSize": "60px",
        "fontWeight": "bold",
        "textAlign": "center",
        "marginBottom": "20px"
      },
      "subheading": {
        "fontSize": "30px",
        "textAlign": "center",
        "marginBottom": "10px"
      }
    }
  },
  "scenes": [
    {
      "title": "Scene Title",
      "description": "Scene Description",
      "image": "Image URL",
      "durationInSeconds": 10,
      "voiceover": "Voiceover text for the scene.",
      "animation": {
        "type": "zoom-out",
        "durationInSeconds": 1
      },
      "style": {
        "title": {
          "fontSize": "50px",
          "fontWeight": "bold",
          "textAlign": "center",
          "marginBottom": "20px"
        },
        "description": {
          "fontSize": "30px",
          "textAlign": "center",
          "marginBottom": "20px"
        },
        "image": {
          "width": "100%",
          "maxWidth": "600px",
          "borderRadius": "10px",
          "margin": "auto"
        }
      }
    },
    // Add more scenes as necessary
  ],
  "outro": {
    "durationInSeconds": 5,
    "content": {
      "heading": "Outro Heading",
      "subheading": "Outro Subheading"
    },
    "voiceover": "Voiceover text for the outro.",
    "animation": {
      "type": "zoom-out",
      "durationInSeconds": 1
    },
    "style": {
      "heading": {
        "fontSize": "60px",
        "fontWeight": "bold",
        "textAlign": "center",
        "marginBottom": "20px"
      },
      "subheading": {
        "fontSize": "30px",
        "textAlign": "center",
        "marginBottom": "10px"
      }
    }
  }
}
Generate this JSON structure by breaking down the chapter into key scenes, summarizing the content for each scene, and suggesting animations and styles that align with the tone and message of the chapter.`;
