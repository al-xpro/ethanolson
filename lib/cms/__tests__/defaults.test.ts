import { describe, expect, it } from "vitest";
import { aboutPage, contactPage, home, legalPage, servicesPage, settings, work, worksPage } from "@/lib/cms/model";
import { defaultHome } from "@/content/defaults/home";
import { defaultAboutPage } from "@/content/defaults/about";
import { defaultServicesPage } from "@/content/defaults/services";
import { defaultWorks } from "@/content/defaults/works";
import { defaultWorksPage } from "@/content/defaults/works-page";
import { defaultContactPage } from "@/content/defaults/contact";
import { defaultPrivacy, defaultTerms } from "@/content/defaults/legal";
import { defaultSettings } from "@/content/defaults/settings";

// The defaults are what the site shows without Storyblok, and what the setup script
// uploads: they must pass the same limits a client's content has to pass.
const cases = [
  ["home", home, defaultHome],
  ["about", aboutPage, defaultAboutPage],
  ["services", servicesPage, defaultServicesPage],
  ["works page", worksPage, defaultWorksPage],
  ["contact", contactPage, defaultContactPage],
  ["privacy", legalPage, defaultPrivacy],
  ["terms", legalPage, defaultTerms],
  ["settings", settings, defaultSettings],
  ...defaultWorks.map((entry) => [`work ${entry.slug}`, work, entry] as const),
] as const;

describe("default content", () => {
  it.each(cases)("%s passes the content model", (_, def, value) => {
    const result = def.schema.safeParse(value);
    expect(result.error?.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`) ?? []).toEqual([]);
  });
});
