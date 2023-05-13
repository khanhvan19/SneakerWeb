import { Box, useTheme } from "@mui/material";
import {
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend,
    LinearScale,
} from 'chart.js';
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale)

const bgColorChar = ['#00ab5580', '#ff563080', '#ffab0080', '#00b8d980']
const borderColorChar = ['#00ab55', '#ff5630', '#ffab00', '#00b8d9']

function PieChart({ data, labelName, valueName, tooltip }) {
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
                position: "right",
                align: "center",
                labels: {
                    color: theme.palette.text.secondary
                }
            },
        }
    }
    

    return (
        <Box>
            <Pie
                width='100%'
                data={chartData}
                options={chartOptions}
            />
        </Box>
    );
}

export default PieChart;