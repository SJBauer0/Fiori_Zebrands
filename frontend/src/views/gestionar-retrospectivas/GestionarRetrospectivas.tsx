import Button from "@atlaskit/button";
import AddIcon from "@atlaskit/icon/glyph/add";
import { FC, useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { NuevaRetrospectiva, PanelGestionarRetro } from "../../components";
import DesignTemplate from "../../components/design-template/DesignTemplate";
import { NewRetroProvider } from "../../components/gestionar-retro/nueva-retro/local-contexts";

interface GestionarRetrospectivasProps {}

const GestionarRetrospectivas: FC<GestionarRetrospectivasProps> = ({}) => {
  const location = useLocation().pathname;
  const [isInNewRetro, setIsInNewRetro] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.includes("nueva-retrospectiva")) {
      setIsInNewRetro(true);
    } else {
      setIsInNewRetro(false);
    }
  }, [location]);

  return (
    <DesignTemplate
      buttons={
        <span className={isInNewRetro ? "hidden" : ""}>
          <Button
            appearance="primary"
            iconBefore={<AddIcon label="agregar retrospectiva" />}
            onClick={() =>
              navigate("/gestionar-retrospectivas/nueva-retrospectiva")
            }
          >
            Nueva retrospectiva
          </Button>
        </span>
      }
    >
      <Routes>
        <Route path="*" element={<Navigate to="/404" />} />
        <Route path="/" element={<PanelGestionarRetro />} />
        <Route
          path="nueva-retrospectiva"
          element={
            <NewRetroProvider>
              <NuevaRetrospectiva />
            </NewRetroProvider>
          }
        />
      </Routes>
    </DesignTemplate>
  );
};

export default GestionarRetrospectivas;
