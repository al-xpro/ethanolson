// Each page, from its content, one file per page. The routes in app/ import their own file
// with published content, so a page only ships its own scenes; the Visual Editor renders
// every page with the draft through this index (lib/cms/live.tsx).
export { HomePage } from "./home";
export { AboutPageView } from "./about";
export { ServicesPageView } from "./services";
export { WorksPageView } from "./works";
export { WorkPage } from "./work";
export { ContactPageView } from "./contact";
export { LegalPageView } from "./legal";
