import { Clear } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";

import styles from './Image.module.scss'
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function ImageCardCover({ image, name, width, height, onRemove, className }) {
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
                    size="small"
                    onClick={onRemove} 
                    sx={{
                        bgcolor: "background.glass2",
                        '&:hover': { bgcolor: "background.glass2" }
                    }}
                >
                    <Clear />
                </IconButton>
            </Box>
        </Tooltip>
    );
}

export default ImageCardCover;