import { storyblokInit } from "@storyblok/react/rsc";
import { StoryblokWork } from "@/components/storyblok/StoryblokWork";

// No API plugin: content is fetched in lib/storyblok/client.ts, on the server. The SDK only
// maps Storyblok components to React ones and runs live editing in the Visual Editor.
storyblokInit({ components: { work: StoryblokWork } });
