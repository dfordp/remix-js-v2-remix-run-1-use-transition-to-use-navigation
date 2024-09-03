This hook is now called useNavigation to avoid confusion with the recent React hook by the same name. It also no longer has the type field and flattens the submission object into the navigation object itself.

### Before

```ts
import { useTransition } from '@remix-run/react';

function SomeComponent() {
  const transition = useTransition();
  transition.submission.formData;
  transition.submission.formMethod;
  transition.submission.formAction;
  transition.type;
}
```

### After

```ts
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
```

