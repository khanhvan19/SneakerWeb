import { StepConnector, stepConnectorClasses } from "@mui/material";
import { styled } from "@mui/material/styles"

export const ReadOnlyStepConnector = styled(StepConnector)(({ theme }) => ({
    [`& .${stepConnectorClasses.line}`]: {
        borderLeftWidth: 4,
        borderRadius: 0,
        borderColor: theme.palette.background.secondary
    },
}));

const ReadOnlyStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: 'transparent',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
        color: '#00ab5540',
    }),
    '+ *': {
        color: 'red',
    },
    '& .readOnlyStepIcon-circle': {
        width: 24,
        height: 24,
        borderRadius: '50%',
        transform: 'translateX(2px)',
        backgroundColor: 'currentColor',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        '& .readOnlyStepIcon-child-circle': {
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: theme.palette.background.secondary,
            ...(ownerState.active && {
                backgroundColor: theme.palette.text.accent,
            }),
        }
    },
}));

function ReadOnlyStepIcon(props) {
    const { active, className } = props;

    return (
        <ReadOnlyStepIconRoot ownerState={{ active }} className={className}>
            <div className="readOnlyStepIcon-circle">
                <div className="readOnlyStepIcon-child-circle"></div>
            </div>
        </ReadOnlyStepIconRoot>
    );
}

export default ReadOnlyStepIcon;