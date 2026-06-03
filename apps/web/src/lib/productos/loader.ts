/**
 * Loader de configuración YAML por producto · Campus v2 (Opción B).
 *
 * Lee `apps/web/src/config/productos/<id>.yaml` y devuelve un ProductoConfig
 * tipado. Cache en memoria para no leer disco en cada request server-side.
 *
 * NOTA: este loader es SERVER-ONLY. No se importa desde Client Components
 * (usa `fs` y `path`). Para exponer la config al cliente, pasa el ProductoConfig
 * como prop desde un Server Component.
 */

import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

import {
  isProductoConfig,
  PRODUCTO_IDS,
  type ProductoConfig,
  type ProductoId,
} from './types';

const PRODUCTOS_DIR = path.join(process.cwd(), 'src/config/productos');

const cache: Map<ProductoId, ProductoConfig> = new Map();

/**
 * Carga la configuración YAML de un producto.
 * Tira si el archivo no existe o el YAML no cumple el schema mínimo.
 */
export function getProducto(id: ProductoId): ProductoConfig {
  const hit = cache.get(id);
  if (hit) return hit;

  const file = path.join(PRODUCTOS_DIR, `${id}.yaml`);
  if (!fs.existsSync(file)) {
    throw new Error(`[productos/loader] YAML no encontrado: ${file}`);
  }

  const raw = fs.readFileSync(file, 'utf-8');
  const parsed = yaml.load(raw);

  if (!isProductoConfig(parsed)) {
    throw new Error(
      `[productos/loader] El YAML ${id}.yaml no cumple el schema ProductoConfig.`
    );
  }
  if (parsed.producto.id !== id) {
    throw new Error(
      `[productos/loader] Mismatch en producto.id ("${parsed.producto.id}" != "${id}").`
    );
  }

  cache.set(id, parsed);
  return parsed;
}

/**
 * Lista los 8 productos (todos los YAML en la carpeta) en el orden canónico
 * definido en types.ts (PRODUCTO_IDS).
 */
export function listProductos(): ProductoConfig[] {
  return PRODUCTO_IDS.map((id) => getProducto(id));
}

/**
 * Versión segura: devuelve undefined en vez de tirar si el ID no es válido.
 * Útil para parámetros de URL que pueden ser arbitrarios.
 */
export function getProductoSafe(id: string): ProductoConfig | undefined {
  if (!(PRODUCTO_IDS as string[]).includes(id)) return undefined;
  try {
    return getProducto(id as ProductoId);
  } catch {
    return undefined;
  }
}

/** Solo para tests · limpia la cache. */
export function _clearCache(): void {
  cache.clear();
}
