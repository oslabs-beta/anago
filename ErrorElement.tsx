import { useRouteError } from 'react-router-dom';

const ErrorElement = () => {
  let error = useRouteError();
  console.error(error);
  return (
    <div className='error-handler'>
      <img src='client/assets/images/anago.png' id='error-logo' />
      <h1>Oops! Page Not Found.</h1>
    </div>
  );
};

export default ErrorElement;
