import { redirect } from "next/navigation";
import { routing } from "../../i18n/routing";

/**
 * Root page — hard redirects to the default locale.
 * Middleware also handles this, but having an explicit page guarantees
 * `/` is never a 404 on any host or routing setup.
 */
export default function Root() {
  redirect(`/${routing.defaultLocale}`);
}
