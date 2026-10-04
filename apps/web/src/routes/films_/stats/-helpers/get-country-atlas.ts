import landAtlasJson from 'world-atlas/land-110m.json';
import { feature } from 'topojson-client';
import { isRecord } from '~/shared';
import type { ExtendedFeature, GeoGeometryObjects, GeoSphere } from 'd3-geo';

type AtlasTopology = Parameters<typeof feature>[0];
export type CountryGeometry = Extract<GeoGeometryObjects, { type: 'Polygon' | 'MultiPolygon' }>;

export interface CountryProperties {
  name: string;
}

export type CountryFeature = ExtendedFeature<CountryGeometry, CountryProperties>;
export type LandFeature = ExtendedFeature<CountryGeometry, Record<never, never>>;

const isCountryGeometry = (geometry: GeoGeometryObjects): geometry is CountryGeometry => {
  return geometry.type === 'Polygon' || geometry.type === 'MultiPolygon';
};

const isAtlasTopology = (value: unknown): value is AtlasTopology => {
  return (
    isRecord(value) &&
    value.type === 'Topology' &&
    Array.isArray(value.arcs) &&
    isRecord(value.objects)
  );
};

const atlasTopology = (value: unknown, label: string): AtlasTopology => {
  if (!isAtlasTopology(value)) {
    throw new TypeError(`${label} is not valid TopoJSON`);
  }
  return value;
};

const convertLand = (value: unknown, label: string): LandFeature => {
  const topology = atlasTopology(value, label);
  const landObject = topology.objects.land;
  if (!landObject) {
    throw new TypeError(`${label} is missing land`);
  }

  const converted = feature(topology, landObject);
  const land = converted.type === 'FeatureCollection' ? converted.features[0] : converted;
  if (!land || land.type !== 'Feature' || !isCountryGeometry(land.geometry)) {
    throw new TypeError(`${label} did not produce polygon geometry`);
  }

  return {
    type: 'Feature',
    geometry: land.geometry,
    properties: {},
  };
};

export const getWorldLand = () => convertLand(landAtlasJson, 'world-atlas land-110m');
export const getWorldSphere = (): GeoSphere => ({ type: 'Sphere' });
