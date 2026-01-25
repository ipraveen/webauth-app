// import { datadogLogs } from '@/telemetry/datadog';

import { StoreHome } from '@/features/store';
import { Cart } from '@/features/shopping-cart';

export function Store() {
    return (
        <main>
            <StoreHome />
            <Cart />
        </main>
    );
}
