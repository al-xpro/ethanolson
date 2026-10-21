import "server-only";
import { Fragment } from "react";
import { storyblokInit } from "@storyblok/react/rsc";
import * as model from "./model.ts";
import type { ComponentDef } from "./fields.ts";
import { defaults, fromStory, loadWorks } from "./load";
import { fingerprint } from "./editable";
import { ContentIssues } from "@/components/cms/ContentIssues";
import {
  AboutPageView,
  ContactPageView,
  HomePage,
  LegalPageView,
  ServicesPageView,
  WorkPage,
  WorksPageView,
} from "@/components/cms/pages";

// The Visual Editor (draft mode) renders each story through Storyblok's SDK, which re-renders
// the page with the draft as it's edited. Each content type maps to the same page component
// the published route uses, after the same validation; problems are listed on the page.
// Every edit remounts the page (key): its animations split text into spans, which React
// can't update in place.

type Blok = Record<string, unknown> & { component: string };

function live<T>(def: ComponentDef, fallback: T, render: (content: T) => Promise<React.ReactNode> | React.ReactNode, title?: string) {
  return async function Live({ blok }: { blok: Blok }) {
    const { content, issues } = await fromStory<T>(def, blok, fallback);
    return (
      <>
        <Fragment key={fingerprint(content)}>{await render(content)}</Fragment>
        <ContentIssues issues={issues} title={title} />
      </>
    );
  };
}

async function LiveWork({ blok, slug }: { blok: Blok; slug: string }) {
  const { works } = await loadWorks();
  const fallback = defaults.works.find((entry) => entry.slug === slug);
  const { content, issues } = await fromStory<model.Work | undefined>(model.work, blok, fallback);
  const index = Math.max(0, works.findIndex((entry) => entry.slug === slug));
  const next = works[(index + 1) % works.length];
  return (
    <>
      {content ? (
        <Fragment key={fingerprint(content)}>
          <WorkPage work={{ ...content, slug }} next={next} />
        </Fragment>
      ) : (
        <p className="px-5 pt-40 pb-24 text-white">This work can&apos;t be shown until the fields below follow the rules.</p>
      )}
      <ContentIssues issues={issues} title="Work" />
    </>
  );
}

async function LiveLegal({ blok, slug }: { blok: Blok; slug: string }) {
  const fallback = slug === "terms" ? defaults.terms : defaults.privacy;
  const { content, issues } = await fromStory<model.LegalPage>(model.legalPage, blok, fallback);
  return (
    <>
      <Fragment key={fingerprint(content)}>
        <LegalPageView content={content} />
      </Fragment>
      <ContentIssues issues={issues} title="Legal" />
    </>
  );
}

storyblokInit({
  components: {
    [model.home.name]: live(model.home, defaults.home, async (content) => (
      <HomePage content={content} works={(await loadWorks()).works} />
    ), "Home"),
    [model.aboutPage.name]: live(model.aboutPage, defaults.about, (content) => <AboutPageView content={content} />, "About"),
    [model.servicesPage.name]: live(model.servicesPage, defaults.services, (content) => <ServicesPageView content={content} />, "Services"),
    [model.worksPage.name]: live(model.worksPage, defaults.worksPage, async (content) => (
      <WorksPageView content={content} works={(await loadWorks()).works} />
    ), "Works"),
    [model.work.name]: LiveWork,
    [model.contactPage.name]: live(model.contactPage, defaults.contact, (content) => <ContactPageView content={content} />, "Contact"),
    [model.legalPage.name]: LiveLegal,
  },
});

export { StoryblokStory } from "@storyblok/react/rsc";
