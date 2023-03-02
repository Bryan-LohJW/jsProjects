import classes from './Content.module.css';

const Content: React.FC<{
	children: React.ReactNode;
}> = (props) => {
	return <div className={classes.content}>{props.children}</div>;
};

export default Content;
