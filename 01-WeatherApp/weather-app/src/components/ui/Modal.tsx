import classes from './Modal.module.css';

const Backdrop: React.FC<{ onClick: React.MouseEventHandler }> = (props) => {
	return <div className={classes.backdrop} onClick={props.onClick}></div>;
};

const ModalOverlay: React.FC<{ children: React.ReactNode }> = (props) => {
	return <div className={classes.overlay}>{props.children}</div>;
};

const Modal: React.FC<{
	children: React.ReactNode;
	onClick: React.MouseEventHandler;
}> = (props) => {
	return (
		<>
			<Backdrop onClick={props.onClick} />
			<ModalOverlay>{props.children}</ModalOverlay>
		</>
	);
};

export default Modal;
