import { Clear } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";

import styles from './Image.module.scss'
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function ImageCardCover({ image, name, width, height, onRemove, className, shape }) {
    return (  
        <Tooltip title={name} arrow className={className}>
            <Box
                className={cx('cover-image-container')}
                sx={{ 
                    width: width, height: height,
                    borderColor: "divider"
                }}
            >
                <img src={image} alt="" />
                <IconButton 
                    size={(shape === 'circle') ? 'large' : 'small'}
                    onClick={onRemove} 
                    sx={{
                        top: (shape === 'circle') ? '50%' : 0 , 
                        right: (shape === 'circle') ? '50%' : 0,
                        transform: (shape === 'circle') ? 'translate(50%, -50%)': 'unset',
                        bgcolor: "background.glass2",
                        '&:hover': { bgcolor: "background.glass2" }
                    }}
                >
                    <Clear 
                        fontSize={(shape === 'circle') ? 'large' : 'medium' } 
                    />
                </IconButton>
            </Box>
        </Tooltip>
    );
}

export default ImageCardCover;