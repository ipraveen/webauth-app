import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { tracer } from '../telemetry/browser';

export function useRouteSpan() {
    const location = useLocation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spanRef = useRef<any | null>(null);

    useEffect(() => {
        spanRef.current?.end();
        const span = tracer.startSpan(`route:${location.pathname}`, {
            attributes: { 'component.route': location.pathname },
        });
        spanRef.current = span;

        return () => {
            span.end();
        };
    }, [location.pathname]);
}
