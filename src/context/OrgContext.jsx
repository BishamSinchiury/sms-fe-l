import { createContext, useContext, useState, useEffect } from "react";
import { getOrgPublicData } from "@/services/user/Org/orgService.js";

export const OrgContext = createContext({ org: null, loading: true, error: null });

export const useOrg = () =>  useContext(OrgContext);

export const OrgProvider = ({ children}) => {
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      // We grab the domain once — this never changes during the session
      const domain = window.location.hostname;
  
      const fetchOrgData = async () => {
        try {
          const response = await getOrgPublicData(domain);
          setOrg(response.data);
        } catch (err) {
          setError("Failed to load organization data.");
        } finally {
          setLoading(false);
        }
      };
      fetchOrgData();
    }, []);
    return (
    <OrgContext.Provider value={{ org, loading, error }}>
      {children}
    </OrgContext.Provider>
    );
}