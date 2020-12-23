import createContext from './createContext';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'add_error':
      return { ...state, errorMessage: action.payload };
    case 'login':
      return { errorMessage: '', token: action.payload };
    default:
      return state;
  }
};

const login = (dispatch) => async ({ email, password }) => {
  try {
    // const response = await .post('/signin', { email, password });
    // await AsyncStorage.setItem('token', response.data.token);
    // dispatch({ type: 'signin', payload: response.data.token });
    // navigate('TrackList');
  } catch (err) {
    // dispatch({
    //   type: 'add_error',
    //   payload: 'Something went wrong with sign in',
    // });
  }
};

const signout = (dispatch) => {
  return () => {
    // somehow sign out!!!
  };
};

export const { Provider, Context } = createContext(
  authReducer,
  { login },
  { token: null, errorMessage: '' }
);
