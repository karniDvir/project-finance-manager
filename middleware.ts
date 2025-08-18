// middleware.ts
import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/auth/signin", // where to redirect if not logged in
  },
  callbacks: {
    // Optional: custom authorization logic
    authorized: ({ token }) => {
        console.log(token?.email)
      // `token` is your JWT from callbacks.jwt()
      return !!token // only allow if user has a token
    },
  },
})

export const config = {
  matcher: ["/beneficiaries/:path*", "/api/:path*"],
}
