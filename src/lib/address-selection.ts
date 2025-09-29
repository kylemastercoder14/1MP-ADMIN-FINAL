import { useState, useEffect } from "react";
import {
  getRegions,
  getProvinces,
  getMunicipalities,
  getBarangays,
} from "@/constants";

export const useAddressData = (
  selectedRegionName: string,
  selectedProvinceName: string,
  selectedMunicipalityName: string
) => {
  const [regionId, setRegionId] = useState<number | null>(null);
  const [provinceId, setProvinceId] = useState<number | null>(null);
  const [municipalityId, setMunicipalityId] = useState<number | null>(null);

  const [regionOptions, setRegions] = useState<string[]>([]);
  const [provinceOptions, setProvinces] = useState<string[]>([]);
  const [municipalityOptions, setMunicipalities] = useState<string[]>([]);
  const [barangayOptions, setBarangays] = useState<string[]>([]);

  useEffect(() => {
    const regionsData = getRegions();
    setRegions(regionsData.map((item) => item.region_description));
  }, []);

  useEffect(() => {
    const selectedRegion = getRegions().find(
      (region) => region.region_description === selectedRegionName
    );
    setRegionId(selectedRegion?.region_id || null);
  }, [selectedRegionName]);

  useEffect(() => {
    const selectedProvince = getProvinces(regionId).find(
      (province) => province.province_name === selectedProvinceName
    );
    setProvinceId(selectedProvince?.province_id || null);
  }, [selectedProvinceName, regionId]);

  useEffect(() => {
    const selectedMunicipality = getMunicipalities(provinceId).find(
      (municipality) =>
        municipality.municipality_name === selectedMunicipalityName
    );
    setMunicipalityId(selectedMunicipality?.municipality_id || null);
  }, [selectedMunicipalityName, provinceId]);

  useEffect(() => {
    if (regionId !== null) {
      const provincesData = getProvinces(regionId);
      setProvinces(provincesData.map((item) => item.province_name));
    } else {
      setProvinces([]);
      setMunicipalities([]);
      setBarangays([]);
    }
  }, [regionId]);

  useEffect(() => {
    if (provinceId !== null) {
      const municipalityData = getMunicipalities(provinceId);
      setMunicipalities(municipalityData.map((item) => item.municipality_name));
    } else {
      setMunicipalities([]);
      setBarangays([]);
    }
  }, [provinceId]);

  useEffect(() => {
    if (municipalityId !== null) {
      const barangayData = getBarangays(municipalityId);
      setBarangays(barangayData.map((item) => item.barangay_name));
    } else {
      setBarangays([]);
    }
  }, [municipalityId]);

  return {
    regionOptions,
    provinceOptions,
    municipalityOptions,
    barangayOptions,
  };
};
