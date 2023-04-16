import { Clear } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";

import styles from './Image.module.scss'
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function ImageCardInfo({ src, name, size, onRemove }) {
    return (  
        <Box className={cx('info-image-container')}>
            <Box className={cx('content')}>
                <img alt="" src={src} style={{ backgroundColor: '#fff' }}/>
                <Box ml={1}>
                    <Typography  
                        variant="body2"
                        className="text-eclipse one-line"
                    >
                        <span>{name} </span>
                    </Typography>
                    {size !== '' && (<Typography variant="caption">{size} B</Typography>)}
                </Box>
            </Box>
            <IconButton size="small" onClick={onRemove}>
                <Clear fontSize="small"/>
            </IconButton>
        </Box>

    );
}

export default ImageCardInfo;