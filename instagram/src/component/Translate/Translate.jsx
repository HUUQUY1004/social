import './translate.scss';
function TranSlate({ children, minWidth, maxWidth }) {
    return (
        <div className="translate__wrapper" style={maxWidth ? { width: maxWidth } : { width: minWidth }}>
            {children}
        </div>
    );
}
export default TranSlate;
