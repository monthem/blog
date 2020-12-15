type CustomComponent<P = {}> = 
  ((props: P) => JSX.Element)
  | ((props: P) => React.ReactElement)

type StoryDefinition = {
  title: string;
  component: React.ComponentClass | React.FunctionComponent | CustomComponent;
}

export const defineStory = (definition: StoryDefinition) => {
  return definition;
}

type TemplateComponent<P> = React.ComponentClass<P> | React.FunctionComponent<P> | CustomComponent<P>

export const defineTemplate
: <P>(Component: TemplateComponent<P>) => React.FC<P> 
= (Component) => (args) => <Component {...args}/>

export const defineModule: <P>(
  Template: React.FC<P>,
  args: P
  ) => React.FC<P> = (
    Template,
    args
    ) => {
  const Module = Template.bind({});
  Module.args = args;
  return Module;
}