import type { NextPage } from "next";
import { FormControl, Input, InputLabel } from "@mui/material";
import useInputState from "../hooks/useInputState";
import { ChangeEventHandler } from "react";

interface Props {
    title: string;
    value: string;
    changeHandler: (newState: string) => void;
}

const CustomInput: NextPage<Props> = ({ title, value, changeHandler }) => {
    const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
        changeHandler(event.target.value);
    };
    return (
        <FormControl variant="standard">
            <InputLabel htmlFor="component-simple">{title}</InputLabel>
            <Input id="component-simple" value={value} onChange={handleChange} />
        </FormControl>
    );
};

export default CustomInput;
