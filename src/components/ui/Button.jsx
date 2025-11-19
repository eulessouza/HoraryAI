function Button({ onClick, children, type = "button", style = {} }) {
    return (
        <button className="btn" type={type} onClick={onClick} style={style}>
            {children}
        </button>
    )
}

export default Button;