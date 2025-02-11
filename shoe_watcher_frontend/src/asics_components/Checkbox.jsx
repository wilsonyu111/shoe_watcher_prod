import React from "react"

function Checkbox(props) {
    const [checked, setChecked] = React.useState(props.value)
    const handleChange = (key) => {
        setChecked(!checked)
        props.func(key, !checked)
    }

    
        return (
        <div className="checkbox_element">

            <input type="checkbox" checked={checked} onChange={(e) => handleChange(props.label)} />
            {props.label}
        </div>
        )
}

export default Checkbox