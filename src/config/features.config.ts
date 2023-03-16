export type Feature = Readonly<{
  description: string;
  package_name?: string;
}>;

export const Features: Feature[] = [
  {
    description: 'Собрали команду'
  },
  {
    description: 'Придумали классное название'
  },
  {
    description: 'Сделали первую страничку с редактированием презентации',
    // package_name: 'react-helmet-async'
  },
  {
    description: 'Научились загружать pptx презентации',
    // package_name: 'react-ga'
  },
  {
    description: 'Научились отображать опросы',
    // package_name: 'react-snap'
  }
];