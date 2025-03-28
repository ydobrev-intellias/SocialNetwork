import { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../../shared/InputField/InputField';
import Form from '../../shared/Form/Form';
import useFormState from '../../hooks/useFormState';
import { AppDispatch, RootState } from '../../redux/store';
import { resetError, signIn } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const initialFormState = {
  email: {
    value: '',
    error: '',
  },
  password: {
    value: '',
    error: '',
  },
};

function SignInForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const { formState, dispatch: formDispatch } = useFormState(initialFormState);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch, navigate]);
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    formDispatch({
      type: e.target.name,
      payload: e.target.value,
    });
  }

  async function handleSubmit() {
    let requiredError = false;

    if (!formState.email.value?.trim()) {
      requiredError = true;
      formDispatch({ type: 'required', payload: 'email' });
    }

    if (!formState.password.value?.trim()) {
      requiredError = true;
      formDispatch({ type: 'required', payload: 'password' });
    }

    if (requiredError) return;

    const hasError = Object.values(formState)
      .map((field) => field.error)
      .some((error) => error !== '');
    if (hasError) return;

    const result = await dispatch(
      signIn({ email: formState.email.value, password: formState.password.value }),
    );
    console.log('Sign in dispatch result ', result);

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  }

  return (
    <>
      <Form
        titleText="Sign In"
        onSubmit={handleSubmit}
        ctaLink="/register"
        ctaLinkText="Sign up"
        ctaText="Don't have an account?"
      >
        <InputField
          labelText="Email"
          field={formState.email}
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Enter your email"
        />
        <InputField
          labelText="Password"
          field={formState.password}
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Enter your password"
        />
        {status === 'pending' && <p>Signing in...</p>}
        {error && <p className="text-red-700">{error}</p>}
      </Form>
    </>
  );
}

export default SignInForm;
