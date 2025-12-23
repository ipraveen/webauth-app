// import { datadogLogs } from '@/telemetry/datadog';

const Dashboard = () => {
    const handleClick = () => {
        console.log('==> Sending datyadog logs');
        // datadogLogs.logger.info('Button clicked', { name: 'buttonName', id: 123 });
    };

    return (
        <main>
            <h1>👩‍🏫 Dashboard</h1>

            <h2>Logs</h2>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={handleClick}
            >
                Log
            </button>
        </main>
    );
};

export default Dashboard;
