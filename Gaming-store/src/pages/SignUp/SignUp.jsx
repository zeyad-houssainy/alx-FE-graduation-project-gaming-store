import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SignUpForm from '../../components/Auth/SignUp';

const SignUp = () => {
  return (
    <>
      <Header />
      <SignUpForm />
      <Footer />
    </>
  );
};

export default SignUp;
