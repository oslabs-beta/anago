import React from 'react';

const SetUp = () => {
  return (
    <div id='setup-page'>
      <div id='setup-title'>
        <h1 id='welcome'>Welcome to Anago!</h1>
        <p>
          An extensive tutorial for DevOps teams new to Kubernetes can be found
          at our <a href='https://github.com/oslabs-beta/anago'>GitHub</a>. If
          you have an existing cluster with Prometheus available, this set-up
          walks through the swift installation and configuration of Anago.
        </p>
      </div>
      <div id='setuplist'>
        <div className='individSetup'>
          <p> Follow these steps exactly:</p>
          <p>
            1. Clone the{' '}
            <a href='https://github.com/oslabs-beta/anago'>Anago respository</a>{' '}
            locally and install required modules:
          </p>
          <h4 className='npm'>npm install</h4>
        </div>
        <div className='individSetup' id='middle'>
          <p>
            2. Modify the{' '}
            <a href='https://github.com/oslabs-beta/anago/blob/dev/user-config.ts'>
              user-config.ts
            </a>{' '}
            file to point to access your Prometheus instance and Alertmanager.
            For example, forward these services to the default ports (9090 and
            9093):
          </p>
          <h4 className='npm'>
            kubectl port-forward svc/[service-name] -n [namespace] 9090
          </h4>
          <h4 className='npm'>
            kubectl port-forward svc/[service-name] -n [namespace] 9093
          </h4>
        </div>
        <div className='individSetup'>
          <p>3. Launch Anago from the command line:</p>
          <h4 className='npm'>npm run dev</h4>
        </div>
      </div>
      <div id='localAccess'>
        <p>
          Navigate to the local access point for Vite (by default,{' '}
          <a href='/'>http://locahost:5173</a>), and you should see a default
          Anago dashboard populated with a suite of common metrics!
        </p>
        <p>
          {' '}
          <strong>
            All set?{' '}
            <a href='/'>
              Explore your new dashboard and gain insight in your Kubernetes
              cluster!
            </a>
          </strong>
        </p>
      </div>
    </div>
  );
};

export default SetUp;
