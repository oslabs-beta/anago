import { useRouteError } from 'react-router-dom';

const ErrorElement = () => {
  let error = useRouteError();
  console.error(error);
  return (
    <div className='error-handler'>
      <div className='error-overlay'>
        <img src='client/assets/images/shipwreck.png' id='shipwreck' />
      </div>
      <div className='error-message'>
        <img src='client/assets/images/AnagoCrashed.png' id='error-logo' />
        <h1>Oops! Page Not Found.</h1>
      </div>
    </div>
  );
};

export default ErrorElement;
