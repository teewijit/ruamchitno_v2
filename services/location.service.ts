import provinces from '@/lib/thailand-province-data/provinces.json';
import amphoes from '@/lib/thailand-province-data/amphoes.json';
import tambons from '@/lib/thailand-province-data/tambons.json';

export type LocationOption = {
  value: number;
  label: string;
  zip_code?: number;
};

export const getAllProvinces = (): LocationOption[] => {
  return provinces.map((p) => ({
    value: p.id,
    label: p.name_th,
  }));
};

export const getAmphoesByProvinceId = (provinceId: number): LocationOption[] => {
  return amphoes
    .filter((a) => a.province_id === provinceId)
    .map((a) => ({
      value: a.id,
      label: a.name_th,
    }));
};

export const getTambonsByAmphoeId = (amphoeId: number): LocationOption[] => {
  return tambons
    .filter((t) => t.amphoe_id === amphoeId)
    .map((t) => ({
      value: t.id,
      label: t.name_th,
      zip_code: t.zip_code,
    }));
};

export const getZipCodeByTambonId = (tambonId: number): string => {
  const tambon = tambons.find((t) => t.id === tambonId);
  return tambon?.zip_code?.toString() ?? "";
};
