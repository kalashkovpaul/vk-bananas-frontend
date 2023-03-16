import Feature from './Feature';
import Package from './Package';
import './home.css';
import { MetaInfo } from '../../components';
import type { FunctionComponent } from 'react';
import { Features } from '../../config/features.config';
import { Packages } from '../../config/packages.config';
import { getRouteMetaInfo } from '../../config/routes.config';

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

const Home: FunctionComponent = () => (
  <div className="view-wrapper">
    <MetaInfo {...getRouteMetaInfo('Home')} />
    <section className="hero is-dark">
      <div className="hero-body">
        <div className="container has-text-centered">
          <div className="is-flex is-horizontal-center">
              <div className='rotateLogo'/>
              {/* <ReactIcon /> */}
          </div>
          <h1 className="title">Бананчики</h1>
          <hr />
          {Features.map((feat, idx) => <Feature key={idx} {...feat} />)}
        </div>
      </div>
    </section>
    <section className="container dashboard-content">
      <div className="columns">
      <div className="bar-button addPresentation" onClick={() => {

        }}>
            <div className="addFileIcon"/>
            Прикрепить презентацию
        </div>
        {/* {Packages.map((pkg, idx) => <Package key={idx} {...pkg} />)} */}
      </div>
      <hr />
      <div className="columns">
        <div className="column">
          <p className="title">lorem ipsum</p>
          <div className="content">{LOREM_IPSUM_TEXT}</div>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
