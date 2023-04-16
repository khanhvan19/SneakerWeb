import { FormControl } from "@mui/material";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import 'assets/styles/customQuill.scss';
import QuillToolbar, { formats, modules } from "../editorToolbar";

function TextAreaField(props) {
    const {
        field, form,
        disabled,
    } = props

    const { name, value } = field;
    const { setFieldValue } = form;
    const handleChange = (value) => {
        setFieldValue(name, value)
    }

    return (  
        <FormControl fullWidth>
            <QuillToolbar toolbarId={'t1'} />
            <ReactQuill 
                theme="snow"
                modules={modules('t1')}
                formats={formats}
                value={value}
                onChange={handleChange}
                disabled={disabled}      
                style={{ height: '8em' }}          
            />
        </FormControl>
    );
}

export default TextAreaField;