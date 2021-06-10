import React, { PureComponent, useContext, createContext, useState } from 'react';

import request from '~/util/request';

const withAuth = WrappedComponent =>
  class withAuth extends PureComponent {
    constructor(props) {
      super(props);

      this.state = {
        user: localStorage.getItem('user'),
        token: localStorage.getItem('jwt'),
      };

      this.signin = this.signin.bind(this);
      this.signout = this.signout.bind(this);
    }

    async signin({ email, password }, callback) {
      const data = new ArrayBuffer(password.length);
      for (let i = 0; i < password.length; i++) {
        data[i] = password[i];
      }
      let hashVal = 0n;
      const hashedBuf = new Uint8Array(await crypto.subtle.digest('SHA-256', data));

      for (const value of hashedBuf) {
        hashVal <<= 8n;
        hashVal |= BigInt(value);
      }

      const hashed = hashVal.toString(16);

      const response = await request({ route: `login`, body: { email, password: hashed } });

      if (response?.token) {
        localStorage.setItem('user', email);
        localStorage.setItem('jwt', response.token);
        this.setState({ user: email, token: response.token });
        if (callback) {
          callback();
        }
      }
    }

    async signout(event, callback) {
      this.setState({ user: null, token: null });
      localStorage.removeItem('user');
      localStorage.removeItem('jwt');
      if (callback) {
        callback();
      }
    }

    render() {
      const { token, user } = this.state;
      return (
        <WrappedComponent
          auth={{ signin: this.signin, signout: this.signout, token, user }}
          {...this.props}
        />
      );
    }
  };

export default withAuth;
