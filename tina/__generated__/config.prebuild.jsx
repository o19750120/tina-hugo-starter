// tina/config.ts
import { defineConfig } from "tinacms";

// tina/collections/post.ts
var Post = {
  name: "post",
  label: "Posts",
  path: "content/posts",
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      isTitle: true,
      required: true
    },
    {
      type: "datetime",
      label: "Date",
      name: "date"
    },
    {
      type: "boolean",
      name: "draft",
      label: "Draft"
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true
    }
  ]
};
var post_default = Post;

// tina/config.ts
var config_default = defineConfig({
  clientId: process.env.TINA_CLIENT_ID,
  branch: process.env.TINA_BRANCH || // custom branch env override
  process.env.VERCEL_GIT_COMMIT_REF || // Vercel branch env
  process.env.HEAD,
  // Netlify branch env
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "static"
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "static"
    }
  },
  schema: {
    collections: [post_default]
  }
});
export {
  config_default as default
};
