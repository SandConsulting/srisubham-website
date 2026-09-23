import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const origin = 'https://www.srisubham.com/';

const categories = [
  { name: 'Groceries', slug: 'groceries' },
  { name: 'Biscuits', slug: 'biscuits' },
  { name: 'Drinks', slug: 'drinks' },
  { name: 'Dairy and Bakery', slug: 'dairy-and-bakery' },
  { name: 'Cooking Essentials', slug: 'cooking-essentials' },
  { name: 'Rice', slug: 'rice' },
  { name: 'Packaged Foods', slug: 'packaged-foods' },
  { name: 'Home Care', slug: 'home-care' },
  { name: 'Textiles', slug: 'textiles' },
  { name: 'Herbal', slug: 'herbal' },
  { name: 'Kumbam Prayer Items', slug: 'kumbam-prayer-items' },
];

const products = [
  ['Sunfeast Dark Fantasy', 'groceries', 'sunfeast-dark-fantasy.webp', 'img/our-p/sunfeast-dark-fantasy.webp'],
  ['Continental XTRA', 'groceries', 'continental-xtra.webp', 'img/ct-xtra.webp'],
  ['Green Tea', 'groceries', 'green-tea.jpg', 'img/nutrovally-lemonm.jpg'],
  ['Liquid Detergent', 'groceries', 'liquid-detergent.webp', 'img/ibf.webp'],
  ['Hey Grain Cookies', 'groceries', 'hey-grain-cookies.webp', 'img/hey-grain-cookies.webp'],
  ['Nutella & Go with Breadsticks', 'groceries', 'nutella-go.jpg', 'img/nutrellabd.jpg'],
  ['California Almonds', 'groceries', 'california-almonds.jpg', 'img/almondss.jpg'],
  ['Apple Cider Vinegar', 'groceries', 'apple-cider-vinegar.jpg', 'img/our-p/apple-cider-vinegar-01.jpg'],
  ['Baidyanath Honey', 'groceries', 'baidyanath-honey.webp', 'img/our-p/baidyanath-honey-01.webp'],
  ['VMS Careline', 'groceries', 'vms-careline.webp', 'img/our-p/vms-careline-01.webp'],
  ['Sandpuppy', 'groceries', 'sandpuppy.webp', 'img/our-p/vms-careline-02.webp'],
  ['Parle-G Original Biscuits', 'biscuits', 'parle-g.webp', 'img/parle-g-original-glucose-biscuits.webp'],
  ['Good Day Biscuits', 'biscuits', 'good-day.jpg', 'img/goodday.jpg'],
  ['Hupseng Biscuits', 'biscuits', 'hupseng.jpeg', 'img/hu.jpeg'],
  ['Britannia Tiger', 'biscuits', 'britannia-tiger.jpg', 'img/britannia-tiger-glucose.jpg'],
  ["Julie's Biscuits", 'biscuits', 'julies.jpg', 'img/jul.jpg'],
  ['Sunquick', 'drinks', 'sunquick.jpg', 'img/sunquick.jpg'],
  ['100+', 'drinks', '100-plus.jpg', 'img/hud+.jpg'],
  ['F & N', 'drinks', 'f-and-n.jpg', 'img/f&n.jpg'],
  ['Maaza Mango Drink 600 ml', 'drinks', 'maaza.webp', 'img/maaza-mango-drink.webp'],
  ['Bournvita Chocolate Nutrition Drink', 'drinks', 'bournvita.webp', 'img/bournvita.webp'],
  ['Cadbury Dairy Milk Chocolate', 'dairy-and-bakery', 'dairy-milk.webp', 'img/cadbury-dairy-milk-home-treats-chocolate.webp'],
  ['Mister Potato Chips', 'dairy-and-bakery', 'mister-potato.jpg', 'img/mrpotato.jpg'],
  ['Farm Fresh', 'dairy-and-bakery', 'farm-fresh.jpg', 'img/farmfresh.jpg'],
  ['McCain French Fries', 'dairy-and-bakery', 'mccain-fries.webp', 'img/mccain-french-fries.webp'],
  ['GRB Ghee', 'dairy-and-bakery', 'grb-ghee.jpg', 'img/grbghee.jpg'],
  ['Buruh Refined Oil 5kg', 'cooking-essentials', 'buruh-oil.webp', 'img/buruh-refined-oil-5kg-wm-fa.webp'],
  ['Knife Cooking Oil 5kg', 'cooking-essentials', 'knife-oil.jpg', 'img/knife-cooking-oil-5kg-1700121217295.jpg'],
  ['Serimurni Cooking Oil 5kg', 'cooking-essentials', 'serimurni.webp', 'img/serimurni.webp'],
  ['Idhayam Sesame Oil', 'cooking-essentials', 'idhayam.jpg', 'img/idhayam.jpg'],
  ['Aashirwaad Aata 5KG', 'cooking-essentials', 'aashirwaad.webp', 'img/aashirwad.webp'],
  ['Pillsbury Aata 5KG', 'cooking-essentials', 'pillsbury.jpg', 'img/pillsbury.jpg'],
  ['3 Roses Tea', 'cooking-essentials', '3-roses.jpg', 'img/3roses.jpg'],
  ['Taj Mahal Tea', 'cooking-essentials', 'taj-mahal.jpg', 'img/tajmahal.jpg'],
  ['Nescafe Sunrise Coffee', 'cooking-essentials', 'nescafe.jpg', 'img/nescafe.jpg'],
  ['Tata Agni Tea', 'cooking-essentials', 'tata-agni.jpg', 'img/tata-agni-tea.jpg'],
  ['Kissan Fresh Tomato Ketchup', 'cooking-essentials', 'kissan.jpg', 'img/kissan-fresh-tomato-ketchup.jpg'],
  ['Rajabogam Rice 25Kg', 'rice', 'rajabogam.jpg', 'img/rajabhogam.jpg'],
  ['Soan Papdi', 'packaged-foods', 'soan-papdi.webp', 'img/soan-papdi.webp'],
  ['Maggi 2-Minute Masala Noodles', 'packaged-foods', 'maggi.webp', 'img/maggi-2-minute-masala-noodles.webp'],
  ['KitKat Chocolate', 'packaged-foods', 'kitkat.webp', 'img/kit-kat-dessert-delight-truffle-chocolate-50-g-product-images-o491376008-p590034262-0-202402081834.webp'],
  ['Bhujia Sev', 'packaged-foods', 'bhujia.webp', 'img/bhujia.webp'],
  ["Haldiram's Navaratna Mix", 'packaged-foods', 'navaratna.webp', 'img/hr-navratan_mix_200g_1.webp'],
  ['Harpic Power Plus', 'home-care', 'harpic.jpg', 'img/harpic-power-plus.jpg'],
  ['Surf Excel Easy Wash', 'home-care', 'surf-excel.webp', 'img/surf-excel-easy-wash.webp'],
  ['Good Knight Gold', 'home-care', 'good-knight.webp', 'img/good-knight-gold.webp'],
  ['Comfort Desire', 'home-care', 'comfort.webp', 'img/comfort-desire.webp'],
  ['Odonil', 'home-care', 'odonil.jpg', 'img/odonil-mix-air.jpg'],
  ['Lizol Citrus Disinfectant', 'home-care', 'lizol.webp', 'img/lizol-citrus-disinfectant.webp'],
  ['Nippo LED Bulb 9W', 'home-care', 'nippo-led.webp', 'img/nippo-led-blub-9-w.webp'],
  ['Shree Carpet', 'textiles', 'shree-carpet.png', 'img/our-p/Synthetic-Textiles-industry-01.png'],
  ['Georgette Sarees', 'textiles', 'georgette-sarees.webp', 'img/our-p/ganesh-textiles-02.webp'],
  ['Waving Carpet', 'textiles', 'waving-carpet.jpg', 'img/fr-hutt.jpg'],
  ['Polyster Carpet', 'textiles', 'polyster-carpet.webp', 'img/ply-crpt.webp'],
  ['Kanjeepuram Saree', 'textiles', 'kanjeepuram-saree.jpg', 'img/ocean-saree.jpg'],
  ['Partywear Saree', 'textiles', 'partywear-saree.webp', 'img/partywearsaree.webp'],
  ['Dabur Honey', 'herbal', 'dabur-honey.jpg', 'img/daburhoney.jpg'],
  ['Sukku Malli', 'herbal', 'sukku-malli.jpg', 'img/sukkumalli.jpg'],
  ['Hydrating Cream', 'herbal', 'hydrating-cream.webp', 'img/ay1.webp'],
  ['Chyawanprash', 'herbal', 'chyawanprash.webp', 'img/chawan.webp'],
  ['Black Sesame Seeds', 'herbal', 'black-sesame.webp', 'img/sesameseeds.webp'],
  ['Amrithnoni', 'herbal', 'amrithnoni.webp', 'img/amrithnoni.webp'],
  ['Amla Juice', 'herbal', 'amla-juice.webp', 'img/amlajuice.webp'],
  ['Camphor Tablets', 'kumbam-prayer-items', 'camphor.jpeg', 'img/pooja/pj1.jpeg'],
  ['Saffron', 'kumbam-prayer-items', 'saffron.jpeg', 'img/pooja/pj2.jpeg'],
  ['Kumbam Special Items', 'kumbam-prayer-items', 'kumbam-special.jpeg', 'img/pooja/pj3.jpeg'],
  ['Incense Sticks', 'kumbam-prayer-items', 'incense-sticks.jpeg', 'img/pooja/pj4.jpeg'],
  ['Ayya Homam', 'kumbam-prayer-items', 'ayya-homam.jpeg', 'img/pooja/pj5.jpeg'],
  ['Sambrani', 'kumbam-prayer-items', 'sambrani.jpeg', 'img/pooja/pj7.jpeg'],
  ['Sandal Powder', 'kumbam-prayer-items', 'sandal-powder.jpeg', 'img/pooja/pj11.jpeg'],
  ['Crochet Cotton', 'kumbam-prayer-items', 'crochet-cotton.jpeg', 'img/pooja/pj12.jpeg'],
  ['Ayya Sambrani', 'kumbam-prayer-items', 'ayya-sambrani.jpeg', 'img/pooja/pj13.jpeg'],
  ['Subham Pooja Items', 'kumbam-prayer-items', 'subham-pooja.jpeg', 'img/pooja/pj14.jpeg'],
  ['Thirunur', 'kumbam-prayer-items', 'thirunur.jpeg', 'img/pooja/pj18.jpeg'],
  ['Champa Sambrani', 'kumbam-prayer-items', 'champa-sambrani.jpeg', 'img/pooja/pj19.jpeg'],
  ['Kumbam Special Sambrani', 'kumbam-prayer-items', 'kumbam-sambrani.jpeg', 'img/pooja/pj20.jpeg'],
  ['Smokeless Camphor', 'kumbam-prayer-items', 'smokeless-camphor.jpeg', 'img/pooja/pj21.jpeg'],
  ["Kreyam's Agarbatti", 'kumbam-prayer-items', 'kreyam-agarbatti.webp', 'img/kreyam-s-agarbatti.webp'],
];

const galleryPrefixes = {
  pr: 'perai',
  bw: 'butterworth',
  nt: 'nibong-tebal',
  pn: 'penang',
  pd: 'padang-serai',
  wh: 'warehouse',
};

function fileUrl(relative) {
  const clean = relative.replace(/^\.\//, '');
  const encoded = clean.split('/').map((part) => encodeURIComponent(part)).join('/');
  return origin + encoded;
}

async function download(relative, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return 'skip';
  const res = await fetch(fileUrl(relative));
  if (!res.ok) {
    console.error('FAIL', res.status, relative);
    return 'fail';
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  return 'ok';
}

async function pool(items, worker, size = 8) {
  const queue = [...items];
  const results = [];
  async function run() {
    while (queue.length) {
      const item = queue.shift();
      results.push(await worker(item));
    }
  }
  await Promise.all(Array.from({ length: size }, run));
  return results;
}

const catalog = {
  categories,
  products: products.map(([name, category, image]) => ({ name, category, image })),
};
fs.mkdirSync(path.join(root, 'src/lib'), { recursive: true });
fs.writeFileSync(path.join(root, 'src/lib/catalog.json'), JSON.stringify(catalog, null, 2));

const jobs = [
  download('img/logo.jpg', path.join(root, 'public/logo.jpg')),
  download('img/about-us-01.PNG', path.join(root, 'public/about.jpg')),
  ...products.map(([, , image, source]) => download(source, path.join(root, 'public/products', image))),
];

const galleryHtml = await (await fetch(origin + 'gallery.html')).text();
const srcs = [...galleryHtml.matchAll(/(?:src)=["']([^"']+\.(?:jpe?g|png|webp))["']/gi)].map((m) => m[1]);
const seen = new Set();
for (const src of srcs) {
  const base = path.basename(src);
  const prefix = base.match(/^([a-z]+)/i)?.[1]?.toLowerCase();
  const folder = galleryPrefixes[prefix];
  if (!folder || seen.has(base.toLowerCase())) continue;
  seen.add(base.toLowerCase());
  jobs.push(download(src, path.join(root, 'public/gallery', folder, base.toLowerCase())));
}

const results = await Promise.all(jobs);
const counts = results.reduce((acc, status) => {
  acc[status] = (acc[status] ?? 0) + 1;
  return acc;
}, {});
console.log(counts);
