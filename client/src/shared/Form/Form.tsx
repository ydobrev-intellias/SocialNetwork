import { ReactNode, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';

interface FormProps {
  children: ReactNode;
  onSubmit: (e: MouseEvent<HTMLButtonElement>) => void;
  titleText: string;
  ctaLink: string;
  ctaLinkText: string;
  ctaText: string;
}
function Form({ children, onSubmit, titleText, ctaLink, ctaLinkText, ctaText }: FormProps) {
  return (
    <div className="w-[55%] min-w-[20rem]">
      <form className="max-w-full min-w-[12rem] rounded-2xl bg-white p-8 flex flex-col gap-7">
        <h1 className="font-bold text-2xl text-center">{titleText}</h1>
        {children}
        <p className="mt-1">
          {ctaText}{' '}
          <Link to={ctaLink} className="font-bold ml-1">
            {ctaLinkText}
          </Link>
        </p>
        <Button type="button" className="cursor-pointer" onClick={onSubmit}>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Form;
