import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VisitorChart = ({ visitorData = [] }) => { // Provide a default empty array
    // Check if visitorData is not undefined and is an array
    if (!Array.isArray(visitorData) || visitorData.length === 0) {
        // Return null or some other placeholder content if visitorData is not valid
        return <p>No visitor data available.</p>;
    }

    const data = {
        labels: visitorData.map((_, index) => `Day ${index + 1}`), // Replace with actual date labels if available
        datasets: [
            {
                label: 'Visitors',
                data: visitorData,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    return <Line data={data} />;
};

export default VisitorChart;
