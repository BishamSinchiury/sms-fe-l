import { get, post, patch, del } from '@/utils/apiHelpers';
import publicClient from '@/services/axios/publicClient';
import { AUTH, ACADEMICS } from '@/constants/apiRoutes';

// Student CRUD (sysadmin)
export const listStudents    = (params) => get(ACADEMICS.STUDENTS, params);
export const createStudent   = (data)   => post(ACADEMICS.STUDENTS, data);
export const updateStudent   = (uuid, data) => patch(ACADEMICS.STUDENT_DETAIL(uuid), data);
export const deleteStudent   = (uuid)   => del(ACADEMICS.STUDENT_DETAIL(uuid));

// Public lookup
export const lookupStudent   = async (studentId) => {
  const res = await publicClient.get(`${AUTH.STUDENT_LOOKUP}?student_id=${studentId}`);
  return res.data;
};

// Claims (sysadmin)
export const listClaims      = () => get(ACADEMICS.CLAIMS);
export const approveClaim    = (uuid) => post(ACADEMICS.CLAIM_APPROVE(uuid));
export const rejectClaim     = (uuid, reason) => post(ACADEMICS.CLAIM_REJECT(uuid), { reason });
