# Guide: Updating the Sitemap When Modifying Pages or URLs

This guide explains the steps to keep the sitemap up to date when adding, modifying, or removing a page or URL on the Dying Star website.

## 1. Adding a New Page or URL

- **Define the route** in the link configuration file (`@feat/navigation/Links`).
- **Create a generator function** in `app/sitemap.tsx` for this new page, following the model of existing functions (`generateHomePageEntries`, etc.).
- **Add a call** to this function in the main `sitemap` function to include the new page in the sitemap.
- **Check language handling**: use `createSitemapEntries` to generate localized URLs.

## 2. Modifying a Page or URL

- **Update the route** in `@feat/navigation/Links` and everywhere it is used.
- **Adapt the corresponding generator function** in `app/sitemap.tsx` if the path or logic changes.
- **Check alternates** (multilingual links) to ensure they point to the correct paths.
- **Test the sitemap** to ensure the modified page appears correctly.

## 3. Removing a Page or URL

- **Remove the corresponding generator function** in `app/sitemap.tsx`.
- **Delete the route** in `@feat/navigation/Links` if it is no longer used.
- **Check the main `sitemap` function** to remove any call to the deleted function.
- **Ensure the sitemap no longer references the old page**.

## 4. Best Practices

- Always check the generated sitemap after each change (e.g., `/sitemap.xml`).
- Maintain consistency of alternates for multilingual SEO.
- Document any important changes in the `app/sitemap.md` file.

## 5. Difference between `createSitemapEntry` and `createSitemapEntries`

- **`createSitemapEntry`** is a utility function that creates a single sitemap entry for a specific URL. It allows you to specify the URL, last modification date, change frequency, and optionally alternate language links for that entry.

- **`createSitemapEntries`** is a higher-level function that generates an array of sitemap entries for all supported locales for a given path. It uses `createSitemapEntry` internally for each locale, ensuring that each localized version of the page is included in the sitemap, along with the appropriate alternate language links.

In summary, use `createSitemapEntry` for a single URL, and `createSitemapEntries` to automatically handle all locales for a given route.

---

By following this guide, the sitemap will remain up to date and accurately reflect the site structure, which is essential for SEO and user navigation.
