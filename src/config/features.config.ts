export type Feature = Readonly<{
  description: string;
  package_name?: string;
}>;

export const Features: Feature[] = [
  {
    description: 'Прикрутили авторизацию и регистрацию'
  },
  {
    description: 'Научились создавать комнаты для презентаций'
  },
  {
    description: 'Научились загружать pdf презентации',
    // package_name: 'react-helmet-async'
  },
  {
    description: 'Сделали возможным подключение к демонстрации',
    // package_name: 'react-ga'
  },
  {
    description: 'Адаптивность! Мы доступны на телефонах!',
    // package_name: 'react-snap'
  }
];