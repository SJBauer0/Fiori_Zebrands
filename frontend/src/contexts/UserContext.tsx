import React, { FC, createContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import axios, { AxiosError } from 'axios';

const SECRET_KEY_1 =
  import.meta.env.VITE_APP_COOKIE_KEY_1 || 'secret1';
const SECRET_KEY_2 =
  import.meta.env.VITE_APP_COOKIE_KEY_2 || 'secret2';

const URI_LOGOUT = `${import.meta.env.VITE_APP_BACKEND_URI}/logout`;
const URI_LOGIN = `${import.meta.env.VITE_APP_BACKEND_URI}/user`;

export interface UserType {
  correo: string;
  foto: string;
  id_jira: string | number | null;
  id_rol: number;
  id_usuario: number;
  nombre: string;
}

interface ContextProps {
  user: UserType | null;
  setUser: (data: UserType | null) => void;
  hasAttemptedFetch: boolean;
  setHasAttemptedFetch: (attempted: boolean) => void;
  getUser: () => void;
  sessionExpired: boolean;
  setSessionExpired: (expired: boolean) => void;
}

export const userDataContext = createContext<ContextProps>({
  user: null,
  setUser: (data: UserType | null) => {},
  hasAttemptedFetch: false,
  setHasAttemptedFetch: (attempted: boolean) => {},
  getUser: () => {},
  sessionExpired: false,
  setSessionExpired: (expired: boolean) => {},
});

// Enfoque de cifrado en cascada, en el que los datos se cifran con varias claves de cifrado en secuencia.
const encryptData = (
  data: string,
  key1: string,
  key2: string
): string => {
  const encryptedData1 = CryptoJS.AES.encrypt(data, key1).toString();
  const encryptedData2 = CryptoJS.AES.encrypt(
    encryptedData1,
    key2
  ).toString();
  return encryptedData2;
};

const decryptData = (
  encryptedData: string,
  key1: string,
  key2: string
) => {
  const decryptedBytes1 = CryptoJS.AES.decrypt(encryptedData, key2);
  const decryptedData1 = decryptedBytes1.toString(CryptoJS.enc.Utf8);
  const decryptedBytes2 = CryptoJS.AES.decrypt(decryptedData1, key1);
  const decryptedData2 = JSON.parse(
    decryptedBytes2.toString(CryptoJS.enc.Utf8)
  );
  return decryptedData2;
};

let sessionTimer: ReturnType<typeof setTimeout>;

interface UserContextProps {
  children: React.ReactNode;
}

const UserContext: FC<UserContextProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null!);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [sessionExpired, setSessionExpired] =
    useState<boolean>(false);

  const setEncryptedUserCookie = (userData: UserType) => {
    const encryptedData = encryptData(
      JSON.stringify(userData),
      SECRET_KEY_1,
      SECRET_KEY_2
    );
    Cookies.set('user', encryptedData, { expires: 1 });
  };

  const getUser = async () => {
    try {
      const response = await axios.get(`${URI_LOGIN}/auth/`, {
        withCredentials: true,
      });

      if (response && response.data) {
        if (Cookies.get('user')) {
          Cookies.remove('user');
        }
        setSessionExpired(false);
        setUser(response.data);
        setEncryptedUserCookie(response.data);
      }
    } catch (error: unknown) {
      if (
        error &&
        (error as AxiosError).response &&
        (error as AxiosError).response!.status === 401
      ) {
        setSessionExpired(true);
        Cookies.remove('user');
        setUser(null);
      } else if (hasAttemptedFetch) {
        console.log('No se autenticó correctamente');
      }
    } finally {
      setHasAttemptedFetch(true);
    }
  };

  const getDecryptedUserFromCookie = (): UserType | null => {
    const storedEncryptedUser = Cookies.get('user');
    if (storedEncryptedUser) {
      const decryptedUser = decryptData(
        storedEncryptedUser,
        SECRET_KEY_1,
        SECRET_KEY_2
      );
      return decryptedUser;
    }
    return null;
  };

  useEffect(() => {
    const decryptedUser = getDecryptedUserFromCookie();
    if (decryptedUser) {
      getUser();
      setUser(decryptedUser);
    }
  }, []);

  const handleSessionExpired = async () => {
    try {
      await axios.get(`${URI_LOGOUT}`, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    } finally {
      Cookies.remove('user');
    }
  };

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(sessionTimer);
      sessionTimer = setTimeout(() => {
        setSessionExpired(true);
        handleSessionExpired();
      }, 60 * 60 * 1000); // 1 hora
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, []);

  return (
    <userDataContext.Provider
      value={{
        user,
        setUser,
        hasAttemptedFetch,
        setHasAttemptedFetch,
        getUser,
        sessionExpired,
        setSessionExpired,
      }}
    >
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;
