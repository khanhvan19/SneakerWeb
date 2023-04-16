import { useMemo } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'

const lightThemeColor = {
    text: {
        primary: "#212b36",
        secondary: "#637381",
        disabled: "#919eabe6",
        accent: "#00ab55"
    },
    divider: "#919eab99",
    background: {
        paper: "#fff",
        default: "#fff",
        highlight: "#f4f6f8",
        accent: "#00ab5514",
        glass: "#ffffffcc",
        glass2: "#20212499"
    },
}

const darkThemeColor = {
    text: {
        primary: "#fff",
        secondary: "#919eab",
        disabled: "#919eab80",
        accent: "#5be584"
    },
    divider: "#919eab66",
    background: {
        paper: "#212b36",
        default: "#161c24",
        highlight: "#919eab29",
        accent: "#00ab5529",
        glass: "#161c24cc",
        glass2: "#00000099"
    },
}

function Theme({ children, mode }) {
    const theme = useMemo(() => createTheme({
        palette: {
            mode: mode,
            ...(mode === 'light'
            ? lightThemeColor
            : darkThemeColor
            ),
            headerGlass: {
                main: '#ffffffcc',
                contrastText: '#212b36',
            },
            chipSuccess: {
                main: '#00ab5529',
                contrastText: '#00ab55'
            },
            chipError: {
                main: '#ff563029',
                contrastText: '#ff5630'
            },
            chipWarning: {
                main: '#ffab0029',
                contrastText: '#ffab00'
            },
            chipInfo: {
                main: '#00b8d929',
                contrastText: '#00b8d9'
            },
            chipGray: {
                main: '#6c757d29',
                contrastText: '#6c757d'
            },
            btnOutlinedDark: {
                main: '#212b36',
                light: '#212b36',
                dark: '#212b36',
                contrastText: '#212b36'
            },
            btnDark: {
                main: '#212b36',
                light: '#212b36',
                dark: '#212b36',
                contrastText: '#fff'
            },
            btnSuccess: {
                main: '#00ab55',
                light: '#007b55',
                dark: '#007b55',
                contrastText: '#fff'
            },
            btnGlassSuccess: {
                main: '#00ab55bf',
                light: '#007b55bf',
                dark: '#007b55bf',
                contrastText: '#fff'
            },
            btnWarning: {
                main: '#ffab00',
                light: '#ffdb00',
                dark: '#ffdb00',
                contrastText: '#212b36'
            },
            btnError: {
                main: '#ff5630',
                light:'#b71d18',
                dark: '#b71d18',
                contrastText: '#fff'
            },
            btnInfo: {
                main: '#00b8d9',
                light: '#00b8d9',
                dark: '#00b8d9',
                contrastText: '#212b36'
            },
            btnGray: {
                main: '#6c757d',
                light: '#5c636a',
                dark: '#5c636a',
                contrastText: '#fff'
            },
            btnGlassGray: {
                main: '#6c757d29',
                light: '#5c636a29',
                dark: '#5c636a29',
                contrastText: '#212b36'
            },
        },
        shape: {
            borderRadius: 8,
        },
        typography: {
            fontFamily: 'inherit',
            h6: {
                ...this,
                fontWeight: 500,
                fontSize: '1.125rem',
            },
            h5: {
                ...this,
                fontWeight: 600,
                fontSize: '1.375rem',
            },
            h4: {
                ...this,
                fontWeight: 600,
                fontSize: '1.625rem',
            },
            h3: {
                ...this,
                fontWeight: 700,
                fontSize: '2rem',
            }
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    outlined: {
                        fontWeight: 600,
                        textTransform: 'none',
                    },
                    contained: {
                        fontWeight: 600,
                        textTransform: 'none',
                    }
                },
            },
            MuiPaper: {
                styleOverrides: {
                    elevation24: {
                        backgroundImage: 'none'
                    }
                }
            }
        },
    }), [mode])

    return ( 
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

export default Theme;
