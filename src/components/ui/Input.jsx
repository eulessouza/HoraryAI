function Input({ value, onChange, type = "text", placeholder = "", style = {} }) {
    return (
        <input className="input" type={type} value={value} onChange={onChange} placeholder={placeholder} style={style} />
    )
}

export default Input;