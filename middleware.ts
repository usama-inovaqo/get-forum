import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login",
  "/login(.*)",
  "/signup(.*)",
  "/(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const url = request.nextUrl.clone();
  const { userId } = await auth();

  // Redirect logged-in users from login page to conversations
  if (url && url.pathname === "/login" && userId) {
    return NextResponse.redirect(new URL("/conversations", request.url));
  }

  if (url && url.pathname === "/conversations" && !userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
