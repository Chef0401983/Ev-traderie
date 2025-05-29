import { authMiddleware, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/vehicles",
    "/vehicles/(.*)",
    "/about",
    "/contact",
    "/how-it-works",
    "/terms",
    "/privacy",
    "/cookies",
    "/api/vehicles",
    "/api/vehicles/(.*)",
    "/api/webhooks/(.*)",
    "/api/public/(.*)",
    "/api/debug/(.*)"
  ],
  async afterAuth(auth, req) {
    // Handle user type routing (individual vs dealership)
    if (auth.isPublicRoute) {
      return NextResponse.next();
    }

    // If user is not authenticated and tries to access a private route
    if (!auth.userId) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // For admin routes, check admin status directly from database
    if (req.nextUrl.pathname.startsWith("/admin")) {
      try {
        // Create Supabase client inside the function to avoid build-time errors
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          console.error('Missing Supabase environment variables in middleware');
          const homeUrl = new URL("/", req.url);
          return NextResponse.redirect(homeUrl);
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', auth.userId)
          .single();
        
        if (!profile?.is_admin) {
          const homeUrl = new URL("/", req.url);
          return NextResponse.redirect(homeUrl);
        }
      } catch (error) {
        console.error('Admin check failed:', error);
        const homeUrl = new URL("/", req.url);
        return NextResponse.redirect(homeUrl);
      }
    }

    // Get the user to check their metadata
    const user = await clerkClient.users.getUser(auth.userId);
    const userType = user.publicMetadata.userType as string | undefined;

    // If user has not selected a user type yet, redirect to onboarding
    if (!userType && !req.nextUrl.pathname.startsWith("/onboarding")) {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }

    // Route users to their appropriate dashboard based on user type
    if (userType === "individual" && req.nextUrl.pathname.startsWith("/dashboard/dealership")) {
      const individualDashboard = new URL("/dashboard/individual", req.url);
      return NextResponse.redirect(individualDashboard);
    }

    if (userType === "dealership" && req.nextUrl.pathname.startsWith("/dashboard/individual")) {
      const dealershipDashboard = new URL("/dashboard/dealership", req.url);
      return NextResponse.redirect(dealershipDashboard);
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
