import { useNavigation } from '@remix-run/react';

function SomeComponent() {
  const navigation = useNavigation();

  // transition.submission keys are flattened onto `navigation[key]`
  navigation.formData;
  navigation.formMethod;
  navigation.formAction;

  // this key is removed
  navigation.type;
}