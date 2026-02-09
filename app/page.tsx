import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LandingPage from "./landing/page";

export default async function Home() {
  const { userId } = await auth();

  // If authenticated, redirect to workflow builder
  if (userId) {
    redirect('/workflow');
  }

  // If not authenticated, show landing page
  return <LandingPage />;
}
