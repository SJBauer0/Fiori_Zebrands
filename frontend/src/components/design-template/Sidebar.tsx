import Avatar from '@atlaskit/avatar';
import SignOutIcon from '@atlaskit/icon/glyph/sign-out';
import axios from 'axios';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import zebrandsLogo from '../../assets/zebrandsLogo.svg';
import { userDataContext } from '../../contexts';
import { categories } from '../../utils/templateData';
import ConfirmLink from './ConfirmLink';

const URI = `${import.meta.env.VITE_APP_BACKEND_URI}/logout`;

const buttonActiveStyles =
  'bg-[#E9F2FF] px-[2vmin] py-[0.8vmin] flex justify-start w-full items-center rounded-md gap-5';
const buttonStyles =
  'px-[2vmin] py-[0.8vmin] flex justify-start w-full items-center rounded-md gap-5 hover:bg-[#E9F2FF]';
const textStyle = 'link font-medium text-[0.85rem]';
const textNotActiveStyles = `${textStyle} text-paragraph`;
const textActiveStyles = `${textStyle} text-selectBold`;

const Sidebar = ({}) => {
  const { user, setUser } = useContext(userDataContext);
  const navigate = useNavigate();
  const idRol = user?.id_rol || -1;
  const location = useLocation();
  const pColor = '#44546F';
  const sColor = '#0C66E4';
  const iconSize = 'medium';

  const getUserPhoto = useMemo(() => {
    return user?.foto || undefined;
  }, [user]);

  const onProtectedRoute = (path: string) => {
    const protectedRoutes = [
      '/mis-retrospectivas/responder/:id/preguntas/',
      '/gestionar-retrospectivas/nueva-retrospectiva',
    ];

    return protectedRoutes.some((route) => {
      const routeMatcher = new RegExp(
        route.replace(/:[^\s/]+/g, '([\\w-]+)')
      );
      return routeMatcher.test(path);
    });
  };
  const isOnProtectedRoute = onProtectedRoute(location.pathname);

  const parseName = (): string => {
    if (!user) return 'Usuario';
    const parsedName = user?.nombre.split(' ');
    if (parsedName.length > 2) {
      let firstName = parsedName[0];
      let middleName = parsedName[1];
      let finalName = [firstName, middleName].join(' ');
      return finalName;
    } else {
      return user?.nombre;
    }
  };

  const name = parseName();

  const handleLogout = async () => {
    await axios.get(URI, {
      withCredentials: true,
    });
    setUser(null);
    Cookies.remove('user');
    navigate('/login');
  };

  const sidebarVariants = {
    hovered: {
      width: '21vw',
    },
    collapsed: { width: '6vw' },
  };

  const linksVariants = {
    hovered: {
      opacity: 1,
      display: 'block',
    },
    collapsed: { opacity: 0, display: 'none' },
  };

  return (
    <>
      <motion.div
        layout
        initial="collapsed"
        whileHover="hovered"
        transition={{ type: 'spring', stiffness: 50 }}
        variants={sidebarVariants}
        className={`invisible overflow-hidden whitespace-nowrap flex flex-col bg-white h-[100vh] items-center drop-shadow py-12 fixed left-0 lg:visible top-0 z-50`}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="flex items-center justify-center gap-3 border-gray-100 border-solid border-2 bg-white rounded-full py-[0.2vmin] w-full">
            <Avatar
              src={getUserPhoto}
              appearance="circle"
              name={name}
            />
            <motion.p
              className={textNotActiveStyles}
              variants={linksVariants}
            >
              {name && name}
            </motion.p>
          </div>

          <div className="flex flex-col justify-center items-center gap-7 w-full">
            {categories.map((category, i) => {
              const Icon = category.icon;
              const isActive = location.pathname.includes(
                `/${category.path}`
              );

              const textStyles = isActive
                ? textActiveStyles
                : textNotActiveStyles;
              const activeStyles = isActive
                ? buttonActiveStyles
                : buttonStyles;
              const iconStyles = isActive ? sColor : pColor;
              const showLink =
                !category.roleIds || category.roleIds.includes(idRol);

              return showLink ? (
                <ConfirmLink
                  className={activeStyles}
                  to={`/${category.path}`}
                  message={
                    isOnProtectedRoute
                      ? '¿Estás seguro de que deseas salir? Perderás los cambios no guardados.'
                      : ''
                  }
                  key={i}
                >
                  <Icon
                    label={category.name}
                    primaryColor={iconStyles}
                    size={iconSize}
                  />
                  <motion.p
                    className={textStyles}
                    variants={linksVariants}
                  >
                    {category.name}
                  </motion.p>
                </ConfirmLink>
              ) : null;
            })}
          </div>

          <button
            className={`${buttonStyles} justify-center`}
            onClick={handleLogout}
          >
            <SignOutIcon
              label="cerrar sesión"
              primaryColor={pColor}
              size={'small'}
            />
            <motion.p
              className="link font-medium text-[1.7vmin] text-[#44546F]"
              variants={linksVariants}
            >
              Cerrar sesión
            </motion.p>
          </button>
        </div>

        <img
          src={zebrandsLogo}
          alt="zebrands"
          className="w-16 mt-8 opacity-60"
        />
      </motion.div>
    </>
  );
};

export default Sidebar;
