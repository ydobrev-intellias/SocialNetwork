import { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../../shared/InputField/InputField';
import Form from '../../shared/Form/Form';
import { AppDispatch, RootState } from '../../redux/store';
import { resetError, signUp } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import useFormState from '../../hooks/useFormState';

const initialFormState = {
  username: {
    value: '',
    error: '',
  },
  email: {
    value: '',
    error: '',
  },
  password: {
    value: '',
    error: '',
  },
  confirmPassword: {
    value: '',
    error: '',
  },
  role: {
    value: 'user',
    error: '',
  },
};

function SignUpForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const { formState, dispatch: formDispatch } = useFormState(initialFormState);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch, navigate]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    formDispatch({
      type: e.target.name,
      payload: e.target.value,
    });
    console.log(formState.role.value);
  }

  async function handleSubmit() {
    let requiredError = false;
    if (!formState.email.value?.trim()) {
      requiredError = true;
      formDispatch({ type: 'required', payload: 'email' });
    }
    if (!formState.username.value?.trim()) {
      requiredError = true;
      formDispatch({ type: 'required', payload: 'username' });
    }
    if (!formState.password.value?.trim()) {
      requiredError = true;
      formDispatch({ type: 'required', payload: 'password' });
    }
    if (!formState.confirmPassword.value?.trim()) {
      requiredError = true;
      formDispatch({ type: 'required', payload: 'confirmPassword' });
    }

    if (formState.password.value !== formState.confirmPassword.value) {
      formDispatch({ type: 'setError', payload: 'Passwords do not match' });
      return;
    }

    if (requiredError) return;

    const hasError = Object.values(formState)
      .map((field) => field.error)
      .some((error) => error !== '');
    if (hasError) return;

    const result = await dispatch(
      signUp({
        username: formState.username.value,
        password: formState.password.value,
        email: formState.email.value,
        role: formState.role.value,
      }),
    );
    console.log('Sign up dispatch result', result);

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  }

  return (
    <Form
      titleText="Sign Up"
      onSubmit={handleSubmit}
      ctaText="Already have an account?"
      ctaLink="/login"
      ctaLinkText="Sign in"
    >
      <InputField
        labelText="Username"
        name="username"
        type="text"
        onChange={handleChange}
        field={formState.username}
        placeholder="Enter your username"
      />
      <InputField
        labelText="Email"
        name="email"
        type="email"
        onChange={handleChange}
        field={formState.email}
        placeholder="Enter your email"
      />
      <InputField
        labelText="Password"
        name="password"
        type="password"
        onChange={handleChange}
        field={formState.password}
        placeholder="Enter your password"
      />
      <InputField
        labelText="Confirm Password"
        name="confirmPassword"
        type="password"
        onChange={handleChange}
        field={formState.confirmPassword}
        placeholder="Confirm your password"
      />
      <div className="mb-4">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          name="role"
          id="role"
          value={formState.role.value}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {status === 'pending' && <p>Signing up...</p>}
      {error && <p className="text-red-700">{error}</p>}
    </Form>
  );
}

export default SignUpForm;
