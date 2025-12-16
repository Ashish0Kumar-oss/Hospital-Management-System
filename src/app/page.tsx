import { redirect } from 'next/navigation';

export default async function Page() {
  // Redirect directly to dashboard for testing
  // Remove auth requirement for easier testing
  redirect('/dashboard/overview');
}
