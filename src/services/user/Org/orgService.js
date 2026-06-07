// src/services/user/orgService.js

import { get } from "@/utils/apiHelpers.js";
import { ORG } from "@/constants/apiRoutes.js";
import publicClient from "@/services/axios/publicClient.js";

export const getOrgPublicData = (domain) =>
  get(ORG.PUBLICDATA("localhost"), {}, publicClient);