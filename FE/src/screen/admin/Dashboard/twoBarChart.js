import { Box, useTheme } from "@mui/material";
import {
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend,
    CategoryScale, 
    BarElement,
} from 'chart.js';
import { Bar } from "react-chartjs-2";
import { formatLocalDate } from "utils/formatters";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, BarElement);

const bgColorChar = ['#00ab5580', '#ff563080', '#ffab0080', '#00b8d980']
const borderColorChar = ['#00ab55', '#ff5630', '#ffab00', '#00b8d9']

function TwoBarChar(props) {
    const { 
        data, labelName,  isDate, 
        fristValueName, fristTooltip, secondValueName, secondTooltip 
    } = props;
    const theme = useTheme();
        
    const chartData = {
        labels: data?.map(item => {
            if(isDate) return formatLocalDate(item[labelName])
            else return item[labelName]
        }),
        datasets: [
            {
                label: ` ${fristTooltip}`,
                data: data.map(item => item[fristValueName]),
                backgroundColor: bgColorChar[0],
                borderColor: borderColorChar[0],
                borderWidth: 1,
                yAxisID: fristValueName
            },
            {
                label: ` ${secondTooltip}`,
                data: data.map(item => item[secondValueName] ),
                backgroundColor: bgColorChar[1],
                borderColor: borderColorChar[1],
                borderWidth: 1,
                yAxisID: secondValueName
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: {
                ticks: {
                    color: theme.palette.text.secondary
                }
            },
            [fristValueName]: {
                type: 'linear',
                position: 'left',
                ticks: {
                    color: theme.palette.text.secondary
                }
            },
            [secondValueName]: {
                type: 'linear',
                position: 'right',
                grid: { 
                    display: false 
                },
                ticks: {
                    color: theme.palette.text.secondary
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: theme.palette.text.secondary
                }
            },
        }
    }

    return (
        <Box>
            <Bar
                data={chartData}
                options={chartOptions}
            />
        </Box>
    );
}

export default TwoBarChar;