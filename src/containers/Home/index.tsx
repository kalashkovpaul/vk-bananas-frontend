import Feature from './Feature';
import Package from './Package';
import './home.css';
import { MetaInfo } from '../../components';
import { FunctionComponent, useContext } from 'react';
import { Features } from '../../config/features.config';
import { Packages } from '../../config/packages.config';
import { getRouteMetaInfo } from '../../config/routes.config';
import UploadFileButton from '../../components/uploadFileButton/UploadFileButton';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../../App';

const LOREM_IPSUM_TEXT = `
  Lorem ipsum dolor sit amet, alia appareat usu id, has legere facilis in. Nam inani malorum epicuri
  id, illud eleifend reformidans nec cu. Stet meis rebum quo an, ad recusabo praesent reprimique duo,
  ne delectus expetendis philosophia nam. Mel lorem recusabo ex, vim congue facilisis eu, id vix oblique
  mentitum. Vide aeterno duo ei. Qui ne urbanitas conceptam deseruisse, commune philosophia eos no. Id
  ullum reprimique qui, vix ei malorum assueverit contentiones. Nec facilis dignissim efficiantur ad,
  tantas tempor nam in. Per feugait atomorum ut. Novum appareat ei usu, an usu omnium concludaturque.
  Et nam latine mentitum, impedit explicari ullamcorper ut est, vis ipsum viderer ei. Porro essent eu
  per, ut tantas dissentias vim. Dicant regione argumentum vis id, adipisci accusata postulant at vix.
  Adipisci vituperata ea duo, eu summo detracto mei, et per option periculis. Eos laudem vivendo ex.
`;

const Home: FunctionComponent = () => {
  const {userData, setUserData} = useContext(UserContext);

  return (
  <div className="view-wrapper">
    <MetaInfo {...getRouteMetaInfo('Home')} />
    <section className="hero">
      <div className="hero-body">
        <div className="container has-text-centered">
          <div className="mainPageTitle">
            Добавьте опросы и квизы в свои презентации
          </div>
          <div className="mainPageShortDescription">
            Взаимодействуйте со своей аудиторией при помощи опросов в реальном времени, вопросов из зала и реакций.
          </div>
          {userData?.username ?
              <UploadFileButton/> :
              <NavLink to="/register" className="mainPageSignup">Зарегистрироваться</NavLink>
          }
        </div>
      </div>
    </section>
    <section className="container previewContainer">
      <div className="laptopPreview">
        <img
          className="laptopPreviewImg"
          alt="Экран демонстрирующего"
          src="https://kindaslides.ru/static/main/laptopPreview.png"
        />
      </div>
      <div className="phonePreview">
        <img
          className="phonePreviewImg"
          alt="Экран зрителя"
          src="https://kindaslides.ru/static/main/phonePreview.jpg"
        />
      </div>
    </section>
    <section className="container worksWith">
      <div className="mainPageWorksWithTitle">
        Поддерживает
      </div>
      <div className="worksWithTools">
        <div className="worksWithSingleTool">
          <img
            width="100"
            height="80"
            src="https://kindaslides.ru/static/main/googleslides.svg"
            alt="google slides"
            loading="lazy"
          />
          <div className="worksWithSingleToolTitle">Google Слайды</div>
        </div>
        <div className="worksWithSingleTool">
          <img
            width="100"
            height="80"
            src="https://kindaslides.ru/static/main/powerpoint.svg"
            alt="power point"
            loading="lazy"
          />
          <div className="worksWithSingleToolTitle">Power Point</div>
        </div>
        <div className="worksWithSingleTool">
          <img
            // width="100"
            height="80"
            src="https://kindaslides.ru/static/main/pdf.png"
            alt="pdf"
            loading="lazy"
          />
          <div className="worksWithSingleToolTitle">PDF</div>
        </div>
      </div>
    </section>
  </div>
  );
}

export default Home;
