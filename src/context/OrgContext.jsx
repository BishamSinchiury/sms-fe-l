import { createContext, useContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getOrgPublicData } from "@/services/user/Org/orgService.js";
import { applyOrgTheme } from "@/utils/applyOrgTheme"

export const OrgContext = createContext({ org: null, loading: true, error: null });

export const useOrg = () => useContext(OrgContext);

export const OrgProvider = () => {
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const domain = window.location.hostname;
    const fetchOrgData = async () => {
      try {
        const response = await getOrgPublicData(domain);
        setOrg(response.data);
        applyOrgTheme(response.data)
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
      <Outlet />
    </OrgContext.Provider>
  );
}