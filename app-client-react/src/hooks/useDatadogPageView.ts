import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { datadogRum } from "@datadog/browser-rum";
import { reactPlugin } from '@datadog/browser-rum-react';

datadogRum.init({
    applicationId: 'af4c24c1-1bb6-46f3-a8e1-1fab14449bc1',
    clientToken: 'pub738b36658def3f011e0e799a2b32d55b',
    site: 'us5.datadoghq.com',
    service: 'praveen-test-app',
    env: 'prod',

    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    defaultPrivacyLevel: 'mask-user-input',
    plugins: [reactPlugin({ })],
});


export function useDatadogPageView() {
    const location = useLocation();

    useEffect(() => {
        console.log("==> Path: ", location.pathname)
        datadogRum.addAction('Page Viewed', {
            page: location.pathname,
        });
    }, [location.pathname, datadogRum]);
}
