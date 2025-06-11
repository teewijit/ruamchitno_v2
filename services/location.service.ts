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

export const getTambonById = (tambonId: number): LocationOption => {
  const tambon = tambons.find((t) => t.id === tambonId);
  return {
    value: tambon?.id ?? 0,
    label: tambon?.name_th ?? "",
    zip_code: tambon?.zip_code ?? 0,
  };
};

export const getAmphoeById = (amphoeId: number): LocationOption => {
  const amphoe = amphoes.find((a) => a.id === amphoeId);
  return {
    value: amphoe?.id ?? 0,
    label: amphoe?.name_th ?? "",
  };
};

export const getProvinceById = (provinceId: number): LocationOption => {
  const province = provinces.find((p) => p.id === provinceId);
  return {
    value: province?.id ?? 0,
    label: province?.name_th ?? "",
  };
};

export const getFullAddress = (address: string, tambon: number, amphoe: number, province: number, zip_code: string): string => {
  let tambonLabel = '';
  let amphoeLabel = '';
  let provinceLabel = '';
  if (province === 1) {
    tambonLabel = `เขต${getTambonById(tambon).label}`;
    amphoeLabel = `แขวง${getAmphoeById(amphoe).label}`;
    provinceLabel = `${getProvinceById(province).label}`;
  } else {
    tambonLabel = `ตำบล${getTambonById(tambon).label}`;
    amphoeLabel = `อำเภอ${getAmphoeById(amphoe).label}`;
    provinceLabel = `จังหวัด${getProvinceById(province).label}`;
  }
  return `${address} ${tambonLabel} ${amphoeLabel} ${provinceLabel} ${zip_code}`;
};