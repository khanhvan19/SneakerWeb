import {
    Box,
    Button,
    Chip,
    IconButton,
    OutlinedInput,
    StepConnector,
    stepConnectorClasses,
    TableCell
} from "@mui/material"
import { styled } from "@mui/material/styles"

export const DROPDOWN_ARROW_MENU = {
    overflow: "visible",
    boxShadow: 24,
    mt: 2,
    "&:before": {
        content: '""',
        display: "block",
        position: "absolute",
        top: 0,
        right: 16,
        width: 10,
        height: 10,
        bgcolor: "background.paper",
        transform: "translateY(-50%) rotate(45deg)",
        zIndex: 0,
    },
}

export const ImageInput = styled(OutlinedInput)(({ width, height, shape, reviewcover }) => ({
    height: `${height}px`,
    width: width ? `${width}px` : "100%",
    justifyContent: "center",
    borderRadius: (shape === 'circle') ? "50%" : "8px",
    '& input': {
        padding: "0px",
        height: "100%",
        caretColor: "transparent",
        zIndex: 3,
        opacity: 0,
        cursor: "pointer",
        borderRadius: (shape === 'circle') ? "50%" : "8px",
    },
    '& fieldset': {
        top: 0,
        borderWidth: "2px !important",
        borderStyle: "dashed",
        '& legend': {
            display: "none"
        }
    },
    '& + label': {
        transform: "none",
        WebkitTransform: "none",
        width: width ? `${width}px` : "100%",
        height: `${height}px`,
        maxWidth: "unset",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
        '& svg': {
            fontSize: width ? `${height / 2.5}px` : `${height / 2}px`,
            lineHeight: 1,
        }
    },
    '& ~ .review-image': {
        position: "absolute",
        top: 1,
        left: 0,
        width: width ? `${width}px` : "100%",
        height: `${height}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        zIndex: reviewcover ? 4 : 2,
        border: "4px solid transparent",
        borderRadius: (shape === 'circle') ? "50%" : "8px",
        '& img': {
            height: "100%"
        }
    }
}))

export const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
    maxWidth: '25%',
    [`& .${stepConnectorClasses.line}`]: {
        borderTopWidth: 3,
        borderRadius: 1,
    },
}));

export const TableCellBorder = styled(TableCell)(({ theme }) => ({
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#959a9f',
}));

export const IconButtonContained = styled(IconButton)(({ theme }) => ({
    border: "4px solid",
    borderColor: theme.palette.background.default,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.accent,
    '&:hover': {
        backgroundColor: theme.palette.background.paper,
    }
}))

export const ButtonNav = styled(Button)(({ theme }) => ({
    position: 'relative',
    fontWeight: '600 !important',
    borderRadius: '0 !important',
    color: `${theme.palette.text.primary} !important`,
    [theme.breakpoints.up('lg')]: {
        fontSize: '15px',
    },
    '&::after': {
        content: '""',
        left: 0,
        bottom: 0,
        width: '0%',
        height: '3px',
        position: 'absolute',
        backgroundColor: theme.palette.text.primary,
    },
    '&:hover': {
        backgroundColor: 'transparent !important',
        '&::after': {
            width: '100%',
            transition: 'all 0.2s ease-in-out',
        }
    }
}))


export const SquareBlock = styled(Box)(({ w }) => ({
    width: w,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    '&::after': {
        content: "''",
        display: "block",
        paddingBottom: "100%",
    },
    '> *': {
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover"
    }
}))

export const SquareChip = styled(Chip)(({ theme }) => ({
    fontWeight: 500,
    borderWidth: 1,
    borderRadius: 'unset',
    borderColor: theme.palette.text.primary
}))

export const TOAST_DEFAULT_STYLE = {
    position: "top-right",
    autoClose: 2500,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
}

export const TOAST_NAVIGATE_STYLE = {
    position: "top-right",
    autoClose: 1500,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
}

export const TOAST_CENTER_STYLE = {
    position: "top-center",
    autoClose: 2500,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
}

export const TOAST_NAVIGATE_CENTER_STYLE = {
    position: "top-center",
    autoClose: 1500,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
}

export const negativeNumber = {
    position: 'relative',
    '&::before': {
        content: '""',
        display: 'inline-block',
        width: 5,
        height: '1.5px',
        top: '50%',
        left: '-2px',
        transform: 'translate(-100%, -50%)',
        position: 'absolute',
        bgcolor: 'text.primary'
    }
}