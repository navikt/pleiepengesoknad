import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import defineFunctionsMissingInJsdom from './defineFunctionsMissingInJsdom';

Enzyme.configure({ adapter: new Adapter() });
defineFunctionsMissingInJsdom();
