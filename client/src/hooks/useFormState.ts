import { useReducer } from 'react';
import validate from '../utils/validate';

function useFormState<
  T extends {
    password?: { error: string; value: string };
    confirmPassword?: {
      error: string;
      value: string;
    };
  },
>(initialFormState: T) {
  interface FormAction {
    type: string;
    payload: string;
  }
  const formReducer = (state: T, action: FormAction) => {
    switch (action.type) {
      case 'email':
        return {
          ...state,
          email: {
            value: action.payload,
            error: validate(action.type, action.payload),
          },
        };
      case 'username':
        return {
          ...state,
          username: {
            value: action.payload,
            error: validate(action.type, action.payload),
          },
        };
      case 'password': {
        if (state?.confirmPassword?.value) {
          return {
            ...state,
            password: {
              value: action.payload,
              error: validate(action.type, action.payload),
            },
            confirmPassword: {
              value: state?.confirmPassword.value,
              error: validate(action.type, action.payload, state.confirmPassword?.value),
            },
          };
        }
        return {
          ...state,
          password: {
            value: action.payload,
            error: validate(action.type, action.payload),
          },
        };
      }

      case 'confirmPassword':
        return {
          ...state,
          confirmPassword: {
            value: action.payload,
            error: validate(action.type, action.payload, state.password?.value),
          },
        };
      case 'role':
        return {
          ...state,
          role: {
            value: action.payload,
            error: '',
          },
        };
      case 'required': {
        return {
          ...state,
          [action.payload]: {
            value: '',
            error: `${action.payload} is required`,
          },
        };
      }
    }
    return state;
  };
  const [formState, dispatch] = useReducer(formReducer, initialFormState);

  return { formState, dispatch };
}

export default useFormState;
