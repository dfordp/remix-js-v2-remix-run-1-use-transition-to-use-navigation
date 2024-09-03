export default function transform(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let dirtyFlag = false;

  // Replace useTransition with useNavigation in import statement
  root.find(j.ImportDeclaration, { source: { value: '@remix-run/react' } })
    .find(j.ImportSpecifier, { imported: { name: 'useTransition' } })
    .replaceWith(() => {
      dirtyFlag = true;
      return j.importSpecifier(j.identifier('useNavigation'));
    });

  // Replace transition variable with navigation and update its usage
  root.find(j.VariableDeclarator, { id: { name: 'transition' }, init: { callee: { name: 'useTransition' } } })
    .forEach(path => {
      dirtyFlag = true;
      path.node.id.name = 'navigation';
      path.node.init.callee.name = 'useNavigation';
    });

  // Update property access on navigation
  root.find(j.MemberExpression, { object: { name: 'transition' } })
    .forEach(path => {
      dirtyFlag = true;
      path.node.object.name = 'navigation';
      if (path.node.property.name === 'submission') {
        const parent = path.parent.node;
        if (j.MemberExpression.check(parent) && ['formData', 'formMethod', 'formAction'].includes(parent.property.name)) {
          path.replace(j.memberExpression(j.identifier('navigation'), parent.property));
        }
      }
    });

  // Remove access to navigation.type
  root.find(j.MemberExpression, { object: { name: 'navigation' }, property: { name: 'type' } })
    .forEach(path => {
      dirtyFlag = true;
      j(path).remove();
    });

  // Remove any nested formData, formMethod, formAction access
  root.find(j.MemberExpression, { object: { name: 'navigation' } })
    .forEach(path => {
      if (['formData', 'formMethod', 'formAction'].includes(path.node.property.name)) {
        const parent = path.parent.node;
        if (j.MemberExpression.check(parent) && parent.object === path.node) {
          dirtyFlag = true;
          j(path.parent).replaceWith(path.node);
        }
      }
    });

  return dirtyFlag ? root.toSource() : undefined;
}