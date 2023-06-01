import { Box, useTheme } from "@mui/material";
import {
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend,
    LinearScale,
} from 'chart.js';
import { Doughnut, Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale)

const bgColorChar = ['#00ab5580', '#ff563080', '#ffab0080', '#00b8d980', '#efb0c980', '#9932cc80']
const borderColorChar = ['#00ab55', '#ff5630', '#ffab00', '#00b8d9', '#efb0c9', '#9932cc']

function DoughnutChart({ data, labelName, valueName, tooltip }) {
    const theme = useTheme()

    const chartData = {
        labels: data.map(item => item[labelName]),
        datasets: [
            {
                label: ` ${tooltip}`,
                data: data.map(item => item[valueName]),
                backgroundColor: bgColorChar.slice(0, data.length),
                borderColor: borderColorChar.slice(0, data.length),
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                align: "start",
                labels: {
                    color: theme.palette.text.secondary
                }
            },
        }
    }
    

    return (
        <Box>
            <Doughnut
                width='100%'
                data={chartData}
                options={chartOptions}
            />
        </Box>
    );
}

export default DoughnutChart;