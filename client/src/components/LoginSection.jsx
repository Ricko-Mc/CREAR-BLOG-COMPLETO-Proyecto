import backLogin from '../assets/back-login.jpg';

const LoginSection = ({ children }) => {
  return (
    <div
      className="login-wrapper"
      style={{
        backgroundImage: `url(${backLogin})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        isolation: 'isolate',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity:10
      }}
    >

        {children}

    </div>
  );
};

export default LoginSection;
