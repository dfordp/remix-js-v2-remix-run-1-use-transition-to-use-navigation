import { useTransition } from '@remix-run/react';

function SomeComponent() {
  const transition = useTransition();
  transition.submission.formData;
  transition.submission.formMethod;
  transition.submission.formAction;
  transition.type;
}