import dotenv from 'dotenv';
import { Brand, Perfume, Decant } from '../models/index.js';
import { testConnection, syncDatabase } from '../config/database.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Categorías de marcas
const categoriasMarcas = {
  arabes: ['afnan', 'alharamain', 'armaf', 'bharara', 'dumont', 'frenchavenue', 
           'jomilano', 'lattafa', 'maisonalhambra', 'orientica', 'rasasi', 'rave'],
  disenador: ['antoniobanderas', 'ariana', 'azzaro', 'burberry', 'bvlgari', 'carolinaherrera',
              'chanel', 'clinique', 'dior', 'dolcegabbana', 'giorgioarmani', 'givenchy',
              'guerlain', 'hallowen', 'hermes', 'hugoboss', 'isseymiyake', 'jeanpaulgaultier',
              'kenzo', 'lacoste', 'lancome', 'loewe', 'louisvuitton', 'moschino', 'nautica',
              'pacorabanne', 'prada', 'ralphlauren', 'tomford', 'valentino', 'versace',
              'viktorrolf', 'yvessaintlaurent'],
  nichos: ['creed', 'initio', 'lelabo', 'maisonfranciskurkdjian', 'maisonmargiela',
           'mancera', 'marly', 'montale', 'nishane', 'ortoparisi', 'rojadove', 'shl777', 'xerjoff']
};

// Datos de decants
const decantsData = [
  { nombre: 'Decant Acqua di Giò Profondo EDP', imagen: '/img/decants/profondo.jpeg', precio2ml: 3000, precio5ml: 6000, precio10ml: 10000 },
  { nombre: 'Decant Eros Flame', imagen: '/img/decants/eros-flame.jpeg', precio2ml: 2000, precio5ml: 5000, precio10ml: 10000 },
  { nombre: 'Decant Acqua di Giò Parfum', imagen: '/img/decants/aqua-di-gio-parfum.jpeg', precio2ml: 2500, precio5ml: 5500, precio10ml: 10500 },
  { nombre: 'Decant Toy Boy', imagen: '/img/decants/moschino.jpeg', precio2ml: 2000, precio5ml: 5000, precio10ml: 10000 },
  { nombre: 'Decant XJ 1861 Naxos Xerjoff', imagen: '/img/decants/naxos.jpeg', precio2ml: 6500, precio5ml: 12000, precio10ml: 22000 },
  { nombre: 'Decant The Most Wanted EDP Intense', imagen: '/img/decants/azzaro.jpeg', precio2ml: 3300, precio5ml: 5400, precio10ml: 10500 },
  { nombre: 'Decant Arabians Tonka Montale', imagen: '/img/decants/montale.jpeg', precio2ml: 3000, precio5ml: 6000, precio10ml: 10500 },
  { nombre: 'Decant Scandal Pour Homme Le Parfum', imagen: '/img/decants/le-beau-le-parfum.jpeg', precio2ml: 3500, precio5ml: 5000, precio10ml: 11000 },
  { nombre: 'Decant 9 PM Rebel', imagen: '/img/decants/9pmrebel.jpeg', precio2ml: 2500, precio5ml: 4500, precio10ml: 7000 },
  { nombre: 'Decant Amore Caffè', imagen: '/img/decants/amore-caffe.jpeg', precio2ml: 3000, precio5ml: 7000, precio10ml: 12000 },
  { nombre: 'Decant Le Male Elixir Absolu', imagen: '/img/decants/le-male-elixir-absolud.jpeg', precio2ml: 3000, precio5ml: 5000, precio10ml: 9000 },
  { nombre: 'Decant Liquid Brun', imagen: '/img/decants/liquid-brun.jpeg', precio2ml: 2000, precio5ml: 4000, precio10ml: 6000 },
  { nombre: 'Decant One Million Elixir', imagen: '/img/decants/one-million-elixir.jpeg', precio2ml: 3000, precio5ml: 6000, precio10ml: 11000 },
  { nombre: 'Decant Miss Dior EDP', imagen: '/img/decants/miss-dior.jpeg', precio2ml: 3500, precio5ml: 6000, precio10ml: 11000 },
  { nombre: 'Decant Yves Saint Laurent Libre Intense EDP', imagen: '/img/decants/libreintense.jpg', precio2ml: 3000, precio5ml: 6500, precio10ml: 12000 },
  { nombre: 'Decant Carolina Herrera La Bomba', imagen: '/img/decants/labomba.jpg', precio2ml: 4000, precio5ml: 8500, precio10ml: 16000 },
  { nombre: 'Decant Valentino Born in Roma Extradose Uomo', imagen: '/img/decants/valentino.jpg', precio2ml: 3000, precio5ml: 7000, precio10ml: 13000 },
  { nombre: 'Decant Forever Wanted Elixir', imagen: '/img/decants/foreverwantedelixir.jpg', precio2ml: 2500, precio5ml: 5500, precio10ml: 10500 },
  { nombre: 'Decant Scandal Pour Homme Le Parfum', imagen: '/img/decants/scandal-le-parfum.jpeg', precio2ml: 3500, precio5ml: 5000, precio10ml: 11000 }
];

// Función para determinar la categoría de una marca
function getCategoria(marcaId) {
  for (const [categoria, ids] of Object.entries(categoriasMarcas)) {
    if (ids.includes(marcaId)) {
      return categoria;
    }
  }
  return 'disenador'; // Default
}

// Función para normalizar URL de imagen
function normalizeImageUrl(src) {
  if (!src) return '';
  if (src.startsWith('/')) return src;
  if (src.startsWith('./img/')) return src.replace('./img/', '/img/');
  return `/img/${src}`;
}

// Función para importar datos desde data.js
async function importDataFromFile() {
  try {
    // Leer el archivo data.js del frontend
    const dataPath = join(__dirname, '../../frontend/src/services/data.js');
    const fileContent = readFileSync(dataPath, 'utf-8');
    
    // Extraer el array marcasData
    // Buscar el patrón: export const marcasData = [...]
    const marcasDataMatch = fileContent.match(/export const marcasData = (\[[\s\S]*?\]);/);
    
    if (!marcasDataMatch) {
      throw new Error('No se pudo extraer marcasData del archivo. Verifica que el archivo tenga el formato correcto.');
    }
    
    // Crear un contexto seguro para evaluar
    // Nota: En producción, considera usar un parser JSON o convertir data.js a JSON
    const marcasDataString = marcasDataMatch[1];
    
    // Función helper para parsear objetos de manera más segura
    // Reemplazar src: "./img/..." por src: "/img/..."
    const normalizedString = marcasDataString.replace(/\.\/img\//g, '/img/');
    
    // Evaluar en un contexto aislado
    // ADVERTENCIA: En producción, considera usar un parser más seguro
    const marcasData = eval(`(${normalizedString})`);
    
    if (!Array.isArray(marcasData)) {
      throw new Error('Los datos importados no son un array válido');
    }
    
    console.log(`  ✓ ${marcasData.length} marcas encontradas en data.js`);
    return marcasData;
  } catch (error) {
    console.error('❌ Error leyendo archivo data.js:', error.message);
    console.error('   Asegúrate de que el archivo frontend/src/services/data.js existe y tiene el formato correcto.');
    throw error;
  }
}

async function seedDatabase() {
  try {
    // Probar conexión
    const connected = await testConnection();
    if (!connected) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    // Sincronizar modelos (crear tablas si no existen)
    console.log('🔄 Sincronizando base de datos...');
    await syncDatabase(false);

    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await Perfume.destroy({ where: {}, truncate: true, cascade: true });
    await Brand.destroy({ where: {}, truncate: true, cascade: true });
    await Decant.destroy({ where: {}, truncate: true });

    // Importar datos de marcas
    console.log('📦 Importando datos de marcas...');
    const marcasData = await importDataFromFile();

    let brandsCreated = 0;
    let perfumesCreated = 0;

    // Crear marcas y perfumes
    for (const marcaData of marcasData) {
      const categoria = getCategoria(marcaData.id);
      
      // Crear marca
      const brand = await Brand.create({
        brandId: marcaData.id,
        nombre: marcaData.nombre,
        slug: marcaData.id,
        categoria: categoria,
        logoUrl: ''
      });
      
      brandsCreated++;
      console.log(`  ✓ Marca creada: ${brand.nombre} (${categoria})`);

      // Crear perfumes
      const perfumes = marcaData.perfumes || {};
      
      // Perfumes de hombres
      if (perfumes.hombres && Array.isArray(perfumes.hombres)) {
        for (const perfumeData of perfumes.hombres) {
          await Perfume.create({
            nombre: perfumeData.nombre || 'Sin nombre',
            precio: perfumeData.precio || 0,
            imagenUrl: normalizeImageUrl(perfumeData.src),
            categoria: 'hombre',
            marcaId: brand.id,
            marcaBrandId: brand.brandId
          });
          perfumesCreated++;
        }
      }

      // Perfumes de mujeres
      if (perfumes.mujeres && Array.isArray(perfumes.mujeres)) {
        for (const perfumeData of perfumes.mujeres) {
          await Perfume.create({
            nombre: perfumeData.nombre || 'Sin nombre',
            precio: perfumeData.precio || 0,
            imagenUrl: normalizeImageUrl(perfumeData.src),
            categoria: 'mujer',
            marcaId: brand.id,
            marcaBrandId: brand.brandId
          });
          perfumesCreated++;
        }
      }

      // Perfumes unisex
      if (perfumes.unixes && Array.isArray(perfumes.unixes)) {
        for (const perfumeData of perfumes.unixes) {
          await Perfume.create({
            nombre: perfumeData.nombre || 'Sin nombre',
            precio: perfumeData.precio || 0,
            imagenUrl: normalizeImageUrl(perfumeData.src),
            categoria: 'unisex',
            marcaId: brand.id,
            marcaBrandId: brand.brandId
          });
          perfumesCreated++;
        }
      }
    }

    // Crear decants
    console.log('📦 Importando datos de decants...');
    for (const decantData of decantsData) {
      await Decant.create({
        nombre: decantData.nombre,
        imagen: decantData.imagen,
        precio2ml: decantData.precio2ml,
        precio5ml: decantData.precio5ml,
        precio10ml: decantData.precio10ml
      });
    }

    console.log('\n✅ Base de datos poblada exitosamente!');
    console.log(`   - ${brandsCreated} marcas creadas`);
    console.log(`   - ${perfumesCreated} perfumes creados`);
    console.log(`   - ${decantsData.length} decants creados`);

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    throw error;
  } finally {
    // Sequelize maneja la conexión automáticamente, no necesitamos cerrarla manualmente
    process.exit(0);
  }
}

// Ejecutar si se llama directamente
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));

if (isMainModule || process.argv[1]?.includes('seedDatabase.js')) {
  seedDatabase()
    .then(() => {
      console.log('✨ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

export default seedDatabase;
