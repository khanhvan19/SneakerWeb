import { useEffect, useState } from "react";
import { 
    Box, 
    FormControl,
    FormHelperText, 
    InputLabel,
} from "@mui/material";
import { AddAPhotoOutlined, ReportOutlined } from "@mui/icons-material";

import { ImageInput } from "assets/styles/constantsStyle";
import ImageCardCover from "../Image/imageCardCover";

function MultipleFileField(props) {
    const {
        field, form,
        label, disabled, limit, height, width,
    } = props

    const { name, value, onBlur } = field;
    const { errors, touched, setFieldValue } = form;
    const showError = errors[name] && (!!touched[name]);

    const [images, setImages] = useState([])

    useEffect(() => {
        var arrUrl = [];
        value.forEach(file => {
            if(file instanceof File) {
                arrUrl.push({link: URL.createObjectURL(file), path: file.name})
            } else {
                arrUrl.push({link: file.link, path: file.path})
            }
        });
        setImages(arrUrl);
        value.map((file) => URL.revokeObjectURL(file))
    }, [value])

    const handleChangeImage = (e) => {
        if(e.target.files) {
            const files = e.target.files;
            setFieldValue(name, [...value, ...files])
        }
    }  

    const handleRemoveImage = (idx) => {
        setFieldValue(name, value.filter((file, i) => i !== idx))
    }

    return (  
        <>
            <Box color="text.secondary" mb={1}>{label}</Box>
            <FormControl
                variant="outlined" margin="none" color="success"
                error={showError}
            >
                <Box display="flex"  flexWrap="wrap">
                    {(images.length > 0) && images.map((item, idx) => (
                        <ImageCardCover 
                            key={idx}
                            image={item.link}
                            name={item.path}
                            width={width}
                            height={height}
                            onRemove={() => handleRemoveImage(idx)}
                        />
                    ))} 
                    <Box position="relative" mb={1}>
                        {(images.length < limit) && (
                            <ImageInput
                                type="file" 
                                name={name}
                                onChange={handleChangeImage}
                                onBlur={onBlur}
                                disabled={disabled}
                                width={width}
                                height={height}
                                inputProps={{
                                    multiple: true
                                }}
                            />
                        )}
                        <InputLabel><AddAPhotoOutlined /></InputLabel>
                    </Box>
                </Box>
                {showError && (
                    <FormHelperText className='content-left-center' sx={{ mx: 0 }}>
                        <ReportOutlined sx={{ fontSize: "1rem", lineHeight: 1, mr: 0.5 }} />
                        {errors[name]}
                    </FormHelperText>
                )}
            </FormControl>
        </>
    );
}

export default MultipleFileField;