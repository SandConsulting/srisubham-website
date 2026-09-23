import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import catalog from './catalog.json';
import { slugify, uniqueSlug } from './slug';

export type Category = {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
};

export type Product = {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  image_path: string | null;
  sort_order: number;
  category_name: string;
  category_slug: string;
};

const globalForDb = globalThis as unknown as { __srisubhamDb?: Database.Database };

function seed(db: Database.Database) {
  const count = db.prepare('SELECT COUNT(*) AS c FROM categories').get() as { c: number };
  if (count.c > 0) return;

  const insertCategory = db.prepare(
    'INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)',
  );
  const insertProduct = db.prepare(
    `INSERT INTO products (category_id, name, slug, description, image_path, sort_order)
     VALUES (?, ?, ?, '', ?, ?)`,
  );

  const run = db.transaction(() => {
    const ids = new Map<string, number>();
    catalog.categories.forEach((category, index) => {
      const info = insertCategory.run(category.name, category.slug, index);
      ids.set(category.slug, Number(info.lastInsertRowid));
    });

    const used = new Set<string>();
    const perCategory = new Map<string, number>();
    for (const product of catalog.products) {
      const categoryId = ids.get(product.category);
      if (!categoryId) continue;
      const file = path.join(process.cwd(), 'public', 'products', product.image);
      const image = fs.existsSync(file) ? `/products/${product.image}` : null;
      const slug = uniqueSlug(slugify(product.name), (value) => used.has(value));
      used.add(slug);
      const order = perCategory.get(product.category) ?? 0;
      perCategory.set(product.category, order + 1);
      insertProduct.run(categoryId, product.name, slug, image, order);
    }
  });
  run();
}

function open() {
  const dir = path.join(process.cwd(), 'data');
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(path.join(dir, 'uploads'), { recursive: true });
  const db = new Database(path.join(dir, 'srisubham.db'));
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL REFERENCES categories(id),
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL DEFAULT '',
      image_path TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `);
  seed(db);
  return db;
}

export function getDb() {
  if (!globalForDb.__srisubhamDb) globalForDb.__srisubhamDb = open();
  return globalForDb.__srisubhamDb;
}

const productSelect = `
  SELECT p.id, p.category_id, p.name, p.slug, p.description, p.image_path, p.sort_order,
         c.name AS category_name, c.slug AS category_slug
  FROM products p
  JOIN categories c ON c.id = p.category_id
`;

export function listCategories() {
  return getDb()
    .prepare('SELECT id, name, slug, sort_order FROM categories ORDER BY sort_order, name')
    .all() as Category[];
}

export function listCategoriesWithCovers() {
  return getDb()
    .prepare(
      `SELECT c.id, c.name, c.slug, c.sort_order,
              (SELECT p.image_path FROM products p
               WHERE p.category_id = c.id AND p.image_path IS NOT NULL
               ORDER BY p.sort_order LIMIT 1) AS image_path
       FROM categories c
       ORDER BY c.sort_order, c.name`,
    )
    .all() as (Category & { image_path: string | null })[];
}

export function getCategory(id: number) {
  return getDb()
    .prepare('SELECT id, name, slug, sort_order FROM categories WHERE id = ?')
    .get(id) as Category | undefined;
}

export function categoryProductCount(id: number) {
  const row = getDb()
    .prepare('SELECT COUNT(*) AS c FROM products WHERE category_id = ?')
    .get(id) as { c: number };
  return row.c;
}

export function createCategory(name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Enter a category name.');
  const db = getDb();
  const max = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS m FROM categories').get() as { m: number };
  const slug = uniqueSlug(slugify(trimmed), (value) =>
    Boolean(db.prepare('SELECT 1 FROM categories WHERE slug = ?').get(value)),
  );
  db.prepare('INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)').run(
    trimmed,
    slug,
    max.m + 1,
  );
}

export function renameCategory(id: number, name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Enter a category name.');
  const db = getDb();
  const current = getCategory(id);
  if (!current) throw new Error('Category not found.');
  const slug = uniqueSlug(slugify(trimmed), (value) =>
    Boolean(db.prepare('SELECT 1 FROM categories WHERE slug = ? AND id != ?').get(value, id)),
  );
  db.prepare('UPDATE categories SET name = ?, slug = ? WHERE id = ?').run(trimmed, slug, id);
}

export function moveCategory(id: number, direction: 'up' | 'down') {
  const categories = listCategories();
  const index = categories.findIndex((category) => category.id === id);
  const swapWith = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= categories.length) return;
  const db = getDb();
  const current = categories[index];
  const other = categories[swapWith];
  const update = db.prepare('UPDATE categories SET sort_order = ? WHERE id = ?');
  const run = db.transaction(() => {
    update.run(other.sort_order, current.id);
    update.run(current.sort_order, other.id);
    if (current.sort_order === other.sort_order) {
      update.run(current.sort_order + (direction === 'up' ? -1 : 1), current.id);
    }
  });
  run();
}

export function deleteCategory(id: number) {
  if (categoryProductCount(id) > 0) {
    throw new Error('Move or delete the products in this category first.');
  }
  getDb().prepare('DELETE FROM categories WHERE id = ?').run(id);
}

function likePattern(query: string) {
  return `%${query.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
}

export function listProducts(filters: { category?: string; q?: string } = {}) {
  const category = filters.category?.trim() ?? '';
  const q = filters.q?.trim() ?? '';
  return getDb()
    .prepare(
      `${productSelect}
       WHERE (? = '' OR c.slug = ?)
         AND (? = '' OR p.name LIKE ? ESCAPE '\\')
       ORDER BY c.sort_order, p.sort_order, p.name`,
    )
    .all(category, category, q, q ? likePattern(q) : '') as Product[];
}

export function listProductsForAdmin() {
  return getDb()
    .prepare(`${productSelect} ORDER BY c.sort_order, p.sort_order, p.name`)
    .all() as Product[];
}

export function getProductBySlug(slug: string) {
  return getDb().prepare(`${productSelect} WHERE p.slug = ?`).get(slug) as Product | undefined;
}

export function getProductById(id: number) {
  return getDb().prepare(`${productSelect} WHERE p.id = ?`).get(id) as Product | undefined;
}

export function featuredProducts(limit = 8) {
  return getDb()
    .prepare(
      `${productSelect}
       WHERE p.id IN (
         SELECT MIN(id) FROM products GROUP BY category_id
       )
       ORDER BY c.sort_order
       LIMIT ?`,
    )
    .all(limit) as Product[];
}

export function createProduct(input: {
  name: string;
  categoryId: number;
  description: string;
  imagePath: string | null;
}) {
  const name = input.name.trim();
  if (!name) throw new Error('Enter a product name.');
  if (!getCategory(input.categoryId)) throw new Error('Choose a category.');
  const db = getDb();
  const slug = uniqueSlug(slugify(name), (value) =>
    Boolean(db.prepare('SELECT 1 FROM products WHERE slug = ?').get(value)),
  );
  const max = db
    .prepare('SELECT COALESCE(MAX(sort_order), -1) AS m FROM products WHERE category_id = ?')
    .get(input.categoryId) as { m: number };
  const info = db
    .prepare(
      `INSERT INTO products (category_id, name, slug, description, image_path, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(input.categoryId, name, slug, input.description.trim(), input.imagePath, max.m + 1);
  return Number(info.lastInsertRowid);
}

export function updateProduct(
  id: number,
  input: { name: string; categoryId: number; description: string; imagePath?: string | null },
) {
  const name = input.name.trim();
  if (!name) throw new Error('Enter a product name.');
  if (!getCategory(input.categoryId)) throw new Error('Choose a category.');
  const current = getProductById(id);
  if (!current) throw new Error('Product not found.');
  const db = getDb();
  const slug = uniqueSlug(slugify(name), (value) =>
    Boolean(db.prepare('SELECT 1 FROM products WHERE slug = ? AND id != ?').get(value, id)),
  );
  if (input.imagePath !== undefined) {
    db.prepare(
      `UPDATE products
       SET name = ?, slug = ?, category_id = ?, description = ?, image_path = ?
       WHERE id = ?`,
    ).run(name, slug, input.categoryId, input.description.trim(), input.imagePath, id);
  } else {
    db.prepare(
      `UPDATE products
       SET name = ?, slug = ?, category_id = ?, description = ?
       WHERE id = ?`,
    ).run(name, slug, input.categoryId, input.description.trim(), id);
  }
}

export function deleteProduct(id: number) {
  getDb().prepare('DELETE FROM products WHERE id = ?').run(id);
}
