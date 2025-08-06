import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CRMRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/crm');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to new CRM dashboard...</p>
      </div>
    </div>
  );
}