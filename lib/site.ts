// Single source of truth for site-wide identity. Imported by
// app/layout.tsx (metadata) and app/feed.xml/route.ts (RSS channel) so
// the two can never drift out of sync.

export const SITE_URL = "https://www.brunao.dev";
export const SITE_NAME = "bruno.dev";
export const SITE_TITLE = "Bruno Guimaraes — fullstack developer";
export const SITE_DESCRIPTION =
  "Fullstack developer. Portfolio + blog living inside a terminal-flavored tiled workspace — 20 hidden features waiting to be found.";
export const SITE_LOCALE = "en_US";
export const SITE_LANGUAGE = "en-us";

export const AUTHOR_NAME = "Bruno Guimaraes";
// RSS 2.0 <managingEditor>/<webMaster> want "email (Name)" format. Keep
// the email off a public feed on purpose — readers accept a bare name.
export const AUTHOR_BYLINE = AUTHOR_NAME;

export const FEED_PATH = "/feed.xml";
export const FEED_URL = `${SITE_URL}${FEED_PATH}`;
export const FEED_TITLE = `${SITE_NAME} — blog`;
export const FEED_DESCRIPTION =
  "Notes on building, shipping, and staying calm on-call.";
