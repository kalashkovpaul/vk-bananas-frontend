import type { FunctionComponent } from 'react';
import { APP_NAME } from '../config/env.config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';

const Footer: FunctionComponent = () => {
  const location = useLocation();
  if (location.pathname.includes("demonstration")) {
    return null;
  }
  return (
    <footer className="footer">
      <div className="buttons">
        <a
          target="_blank"
          aria-label="GitHub"
          rel="noopener noreferrer"
          className="button is-medium"
          href="https://github.com/kalashkovpaul"
        >
          <FontAwesomeIcon icon={["fab", "github"]} />
        </a>
        {/* <a
          href="#/"
          aria-label="Twitter"
          className="button is-medium"
        >
          <FontAwesomeIcon icon={["fab", "twitter"]} />
        </a>
        <a
          href="#/"
          aria-label="Medium"
          className="button is-medium"
        >
          <FontAwesomeIcon icon={["fab", "etsy"]} />
        </a> */}
      </div>
      <div className="content has-text-centered">
        {`Copyright © ${new Date().getFullYear()} ${APP_NAME}`}
      </div>
    </footer>
  );
}

export default Footer;
