import { Box } from "@mui/system";
import React from "react";
import { Quill } from "react-quill";

const CustomUndo = () => (
    <svg viewBox="0 0 18 18">
        <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
        <path
            className="ql-stroke"
            d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
        />
    </svg>
);

const CustomRedo = () => (
    <svg viewBox="0 0 18 18">
        <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
        <path
            className="ql-stroke"
            d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
        />
    </svg>
);

function undoChange() {
    this.quill.history.undo();
}
function redoChange() {
    this.quill.history.redo();
}

const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

export const modules = (props) => ({
    toolbar: {
        container: "#" + props,
        handlers: {
            undo: undoChange,
            redo: redoChange
        }
    },
    history: {
        delay: 500,
        maxStack: 100,
        userOnly: true
    }
});

export const formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "align",
    "strike",
    "script",
    "blockquote",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "code-block"
];

function QuillToolbar(props) {
    return (
        <>
            {props.toolbarId !== undefined &&
                <span id={props.toolbarId}>
                    <span className="ql-formats">
                        <select className="ql-header" defaultValue="0">
                            <option value="1">Heading 1</option>
                            <option value="2">Heading 2</option>
                            <option value="3">Heading 3</option>
                            <option value="4">Heading 4</option>
                            <option value="5">Heading 5</option>
                            <option value="6">Heading 6</option>
                            <option value="0">Normal</option>
                        </select>
                        <select className="ql-size" defaultValue="large">
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </span>
                    <span className="ql-formats">
                        <button className="ql-bold" />
                        <button className="ql-italic" />
                        <button className="ql-underline" />
                        <button className="ql-strike" />
                    </span>
                    <span className="ql-formats">
                        <button className="ql-list" value="ordered" />
                        <button className="ql-list" value="bullet" />
                        <button className="ql-indent" value="-1" />
                        <button className="ql-indent" value="+1" />
                    </span>
                    <span className="ql-formats">
                        <button className="ql-script" value="super" />
                        <button className="ql-script" value="sub" />
                        <button className="ql-blockquote" />
                    </span>
                    <span className="ql-formats">
                        <select className="ql-align" />
                        <select className="ql-color" />
                        <select className="ql-background" />
                    </span>
                    <span className="ql-formats">
                        <button className="ql-link" />
                        <button className="ql-image" />
                        <button className="ql-video" />
                    </span>
                    <span className="ql-formats">
                        <button className="ql-formula" />
                        <button className="ql-code-block" />
                    </span>
                    <span className="ql-formats">
                        <button className="ql-undo">
                            <CustomUndo />
                        </button>
                        <button className="ql-redo">
                            <CustomRedo />
                        </button>
                    </span>
                </span>
            }
        </>
    )
}

export default QuillToolbar;