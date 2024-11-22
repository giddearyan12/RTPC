import Conversations from "./Conversations";
import SearchInput from "./SearchInput";
import './Sidebar.css'

const Sidebar = () => {
	return (
		<div className='custom-sidebar'>
			<SearchInput />
			<div className='.custom-divide'></div>
			<Conversations />
		</div>
	);
};
export default Sidebar;