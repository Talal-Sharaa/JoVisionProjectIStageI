module.exports = function (plop) {
    plop.setGenerator('component', {
      description: 'Create a new React Native component',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'Component name:',
        },
      ],
      actions: [
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.js',
          templateFile: 'plop-templates/Component.js.hbs',
        },
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.styles.js',
          templateFile: 'plop-templates/Component.styles.js.hbs',
        },
      ],
    });
  };
  