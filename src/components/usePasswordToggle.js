import React, { useState } from "react";
import {ReactComponent as CustomIcon} from "../icons/eye-regular.svg"

const usePasswordToggle = () => {
    const [visible, setVisiblity] = useState(false);

    const Icon = (
        <CustomIcon
        className="passwordIcon"
            icon = {visible ? "eye-slash" : "eye-regular"}
            onClick={() => setVisiblity(visiblity => !visiblity)}
        />
    );

    const InputType = visible ? "text" : "password";

    return [InputType, Icon];
};

export default usePasswordToggle;