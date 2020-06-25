import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import MainScreen from './components/MainScreen/MainScreen';
import SecondScreen from './components/SecondScreen/SecondScreen';

/**
 * @description Initializing the stack navigator.
 */

const AppNavigator = createStackNavigator(
  {
    MainScreen: {screen: MainScreen},
    SecondScreen: {screen: SecondScreen},
  },
  {
    navigationOptions: {
      headerBackTitle: null,
      headerStyle: {backgroundColor: '#02ADAD'},
      headerTitleStyle: {
        color: 'white',
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
      },
      headerTintColor: 'white',
    },
  },
);
export default createAppContainer(AppNavigator);
