import { ChangeEventHandler, useState } from "react";

function useInputState(initialState: string): [string, ChangeEventHandler<HTMLInputElement>] {
    const [state, setState] = useState(initialState);
    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setState(event.target.value);
    };
    return [state, handleChange];
}

export default useInputState;
