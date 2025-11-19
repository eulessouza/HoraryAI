function Sidebar( {children, style = {}} ) { 
    return (
        <div className="sidebar" style={style}>
            <aside>{children}</aside>
        </div>
    )
}

export default Sidebar; 