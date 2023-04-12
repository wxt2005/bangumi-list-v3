import Layout from '../components/layout/Layout';
import { UserProvider } from '../contexts/userContext';
import { PreferenceProvider } from '../contexts/preferenceContext';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import Core from '../components/Core';
import '../styles/variables.css';
import '../styles/reset.css';
import '../styles/layout.css';

export default function MyApp({
  Component,
  pageProps,
}: {
  Component: React.ElementType;
  pageProps: Record<string, unknown>;
}): JSX.Element | null {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_ID || '';

  return (
    <>
      <UserProvider>
        <PreferenceProvider>
          <Core>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Core>
        </PreferenceProvider>
      </UserProvider>
      {gaMeasurementId && (
        <GoogleAnalytics trackPageViews gaMeasurementId={gaMeasurementId} />
      )}
    </>
  );
}
