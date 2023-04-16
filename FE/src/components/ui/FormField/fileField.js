import { useEffect, useState } from "react";
import { 
    Box, 
    FormControl, 
    FormHelperText, 
    InputLabel, 
    Typography
} from "@mui/material";
import { AddAPhotoOutlined, ReportOutlined } from "@mui/icons-material";

import { ImageInput } from "assets/styles/constantsStyle";
import ImageCardInfo from "../Image/imageCardInfo";
import ImageCardCover from "../Image/imageCardCover";

function FileField(props) {
    const {
        field, form,
        label, insideLabel, disabled, width, height, shape,
    } = props

    const { name, value, onBlur } = field;
    const { errors, touched, setFieldValue, initialValues } = form;
    const showError = errors[name] && touched[name];

    const [image, setImage] = useState()

    useEffect(() => {
        if(value instanceof File) {
            setImage({
                link: URL.createObjectURL(value),
                path: value.name, size: value.size,
            })
        } else {
            setImage({ link: value.link,  path: value.path })
        }
        URL.revokeObjectURL(value);
    }, [value])

    const handleChangeImage = (e) => {
        if(e.target.files[0]) {
            setFieldValue(name, e.target.files[0])
        }
    }  

    const handleRemoveImage = (e) => {
        setFieldValue(name, initialValues[name])
    }

    const handleRemoveCoverImage = (e) => {
        setFieldValue(name, '')
    }

    return (  
        <>
            {label && 
                <Box 
                    position="absolute"
                    top={16} left={16}
                    lineHeight={1}
                    color="text.secondary" 
                >
                    {label}
                </Box>
            }
            <FormControl
                variant="outlined" margin="none" color="success" fullWidth={!width}
                error={showError}
            >
                <Box position="relative">
                    <ImageInput
                        type='file'
                        name={name}
                        onChange={handleChangeImage}
                        onBlur={onBlur}
                        disabled={disabled}
                        width={width}
                        height={height}
                        shape={shape}
                        reviewcover={insideLabel}
                    />
                    <InputLabel>
                        <AddAPhotoOutlined />
                        {insideLabel && 
                            <Typography variant="overline" fontWeight={600}>
                                {insideLabel}
                            </Typography>}
                    </InputLabel>
                    {label && typeof image?.link === 'string' && (
                        <Box className="review-image">
                            <img src={image?.link} alt="" />
                        </Box>
                    )}
                    {insideLabel && typeof image?.link === 'string' && (
                        <ImageCardCover 
                            className="review-image"
                            image={image.link}
                            name={image.path}
                            onRemove={handleRemoveCoverImage}
                        />
                    )}
                </Box>
                {showError && (
                    <FormHelperText className='content-left-center' sx={{ mx: 0 }}>
                        <ReportOutlined sx={{ fontSize: "1rem", lineHeight: 1, mr: 0.5 }} />
                        {errors[name]}
                    </FormHelperText>
                )}
            </FormControl>
            {!insideLabel && value instanceof File && typeof image?.link === 'string' && (
                <ImageCardInfo 
                    src={image?.link}
                    name={image?.path}
                    size={image?.size || ''}
                    onRemove={handleRemoveImage}
                />
            )}
        </>
    );
}

export default FileField;