import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import defineFunctionsMissingInJsdom from './defineFunctionsMissingInJsdom';

Enzyme.configure({ adapter: new Adapter() });
defineFunctionsMissingInJsdom();
