#!/usr/bin/env node
/**
 * ITSEIA - Load Resources for Sessions with 0 Resources
 * Creates 3 contextually relevant resources per session
 * Uses real URLs from educational platforms
 */

const fs = require('fs');

const BASE = 'https://wqlselfapnggxxeziruo.supabase.co/rest/v1';
const SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc';
const headers = {
  'apikey': SKEY,
  'Authorization': 'Bearer ' + SKEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal'
};

// ==========================================
// RESOURCE GENERATION ENGINE
// ==========================================

// Topic keyword matching -> resource generation
// Each function takes (sessionTitle, subjectName) and returns array of {title, url, type, description}

function generateResources(sessionTitle, subjectName) {
  const t = sessionTitle.toLowerCase();
  const s = subjectName.toLowerCase();
  const resources = [];

  // ---- PYTHON / PROGRAMMING ----
  if (match(t, ['python', 'programacion', 'programming', 'variables', 'tipos de datos', 'bucles', 'funciones', 'clases', 'oop', 'poo'])) {
    if (match(t, ['variables', 'tipos de datos', 'data types'])) {
      resources.push(
        { title: 'Variables y tipos de datos en Python — W3Schools', url: 'https://www.w3schools.com/python/python_variables.asp', type: 'link', description: 'Tutorial interactivo de variables, tipos de datos y casting en Python con ejemplos editables' },
        { title: 'Python Data Types — Real Python', url: 'https://realpython.com/python-data-types/', type: 'link', description: 'Guia completa de tipos de datos en Python: int, float, str, bool, None y sus operaciones' },
        { title: 'Curso Python para principiantes — freeCodeCamp ES', url: 'https://www.freecodecamp.org/espanol/learn/scientific-computing-with-python/', type: 'link', description: 'Curso completo de Python en espanol con ejercicios interactivos y certificacion gratuita' }
      );
    } else if (match(t, ['bucles', 'loops', 'for', 'while', 'iteracion'])) {
      resources.push(
        { title: 'Bucles en Python — W3Schools', url: 'https://www.w3schools.com/python/python_for_loops.asp', type: 'link', description: 'Tutorial de bucles for y while con break, continue y else en Python' },
        { title: 'Python Loops — Real Python', url: 'https://realpython.com/python-for-loop/', type: 'link', description: 'Guia detallada de iteracion en Python: for, while, enumerate, zip y comprensiones' },
        { title: 'DotCSV — Logica de programacion', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Canal de YouTube en espanol sobre programacion, IA y ciencia de datos con explicaciones visuales' }
      );
    } else if (match(t, ['funciones', 'functions', 'def', 'lambda'])) {
      resources.push(
        { title: 'Funciones en Python — W3Schools', url: 'https://www.w3schools.com/python/python_functions.asp', type: 'link', description: 'Referencia de funciones: parametros, return, *args, **kwargs y funciones lambda' },
        { title: 'Defining Functions — Real Python', url: 'https://realpython.com/defining-your-own-python-function/', type: 'link', description: 'Tutorial completo de funciones: scope, closures, decoradores y buenas practicas' },
        { title: 'Python Docs — Funciones', url: 'https://docs.python.org/es/3/tutorial/controlflow.html#defining-functions', type: 'link', description: 'Documentacion oficial de Python en espanol sobre definicion y uso de funciones' }
      );
    } else if (match(t, ['clases', 'class', 'oop', 'poo', 'herencia', 'objetos', 'orientada a objetos'])) {
      resources.push(
        { title: 'Clases y OOP en Python — W3Schools', url: 'https://www.w3schools.com/python/python_classes.asp', type: 'link', description: 'Tutorial de clases, objetos, herencia y polimorfismo en Python' },
        { title: 'OOP in Python 3 — Real Python', url: 'https://realpython.com/python3-object-oriented-programming/', type: 'link', description: 'Guia completa de programacion orientada a objetos: clases, herencia, encapsulamiento' },
        { title: 'Python OOP — freeCodeCamp', url: 'https://www.freecodecamp.org/espanol/learn/scientific-computing-with-python/', type: 'link', description: 'Modulo de OOP en Python con ejercicios practicos y proyectos reales' }
      );
    } else if (match(t, ['introduccion', 'intro', 'primer'])) {
      resources.push(
        { title: 'Tutorial de Python — W3Schools', url: 'https://www.w3schools.com/python/', type: 'link', description: 'Tutorial interactivo de Python desde cero con editor en linea y ejemplos practicos' },
        { title: 'Python para Principiantes — Real Python', url: 'https://realpython.com/python-first-steps/', type: 'link', description: 'Guia paso a paso para empezar con Python: instalacion, primer programa, conceptos basicos' },
        { title: 'Aprende Python — freeCodeCamp ES', url: 'https://www.freecodecamp.org/espanol/learn/scientific-computing-with-python/', type: 'link', description: 'Curso gratuito de computacion cientifica con Python en espanol con certificacion' }
      );
    } else if (match(t, ['estructuras de control', 'if', 'elif', 'else', 'condicionales'])) {
      resources.push(
        { title: 'Condicionales en Python — W3Schools', url: 'https://www.w3schools.com/python/python_conditions.asp', type: 'link', description: 'Tutorial de if, elif, else con operadores logicos y condicionales anidados' },
        { title: 'Conditional Statements — Real Python', url: 'https://realpython.com/python-conditional-statements/', type: 'link', description: 'Guia completa de estructuras de control: if/elif/else, ternarios y match/case' },
        { title: 'Python Docs — Control de flujo', url: 'https://docs.python.org/es/3/tutorial/controlflow.html', type: 'link', description: 'Documentacion oficial sobre estructuras de control y flujo del programa' }
      );
    } else if (match(t, ['operadores', 'operators', 'expresiones'])) {
      resources.push(
        { title: 'Operadores en Python — W3Schools', url: 'https://www.w3schools.com/python/python_operators.asp', type: 'link', description: 'Referencia completa de operadores aritmeticos, logicos, comparacion y bitwise' },
        { title: 'Operators and Expressions — Real Python', url: 'https://realpython.com/python-operators-expressions/', type: 'link', description: 'Tutorial detallado sobre expresiones, precedencia de operadores y evaluacion' },
        { title: 'Practica Python — HackerRank', url: 'https://www.hackerrank.com/domains/python', type: 'tool', description: 'Ejercicios interactivos de Python con operadores y expresiones basicas' }
      );
    } else if (match(t, ['archivos', 'files', 'io', 'lectura', 'escritura'])) {
      resources.push(
        { title: 'File Handling — W3Schools', url: 'https://www.w3schools.com/python/python_file_handling.asp', type: 'link', description: 'Tutorial de lectura y escritura de archivos en Python: open, read, write, with' },
        { title: 'Reading and Writing Files — Real Python', url: 'https://realpython.com/read-write-files-python/', type: 'link', description: 'Guia completa de manejo de archivos: texto, CSV, JSON y binarios en Python' },
        { title: 'Python Docs — Input/Output', url: 'https://docs.python.org/es/3/tutorial/inputoutput.html', type: 'link', description: 'Documentacion oficial sobre entrada/salida y formateo de datos' }
      );
    } else if (match(t, ['listas', 'list', 'tuplas', 'tuple', 'diccionarios', 'dict', 'conjuntos', 'set', 'colecciones'])) {
      resources.push(
        { title: 'Listas en Python — W3Schools', url: 'https://www.w3schools.com/python/python_lists.asp', type: 'link', description: 'Tutorial completo de listas, tuplas, diccionarios y sets en Python' },
        { title: 'Lists and Tuples — Real Python', url: 'https://realpython.com/python-lists-tuples/', type: 'link', description: 'Guia detallada de colecciones en Python: operaciones, slicing y comprensiones' },
        { title: 'Python Data Structures — freeCodeCamp', url: 'https://www.freecodecamp.org/espanol/learn/scientific-computing-with-python/', type: 'link', description: 'Ejercicios practicos con estructuras de datos nativas de Python' }
      );
    } else if (match(t, ['excepciones', 'errors', 'try', 'except', 'manejo de errores'])) {
      resources.push(
        { title: 'Try Except — W3Schools', url: 'https://www.w3schools.com/python/python_try_except.asp', type: 'link', description: 'Tutorial de manejo de excepciones: try, except, finally y raise' },
        { title: 'Python Exceptions — Real Python', url: 'https://realpython.com/python-exceptions/', type: 'link', description: 'Guia completa de excepciones: tipos, jerarquia, excepciones personalizadas' },
        { title: 'Python Docs — Errores y excepciones', url: 'https://docs.python.org/es/3/tutorial/errors.html', type: 'link', description: 'Documentacion oficial sobre manejo de errores y excepciones en Python' }
      );
    } else if (match(t, ['modulos', 'modules', 'paquetes', 'packages', 'pip', 'import'])) {
      resources.push(
        { title: 'Modulos en Python — W3Schools', url: 'https://www.w3schools.com/python/python_modules.asp', type: 'link', description: 'Tutorial de modulos, paquetes e importaciones en Python' },
        { title: 'Python Modules and Packages — Real Python', url: 'https://realpython.com/python-modules-packages/', type: 'link', description: 'Guia detallada de organizacion de codigo en modulos y paquetes' },
        { title: 'PyPI — Python Package Index', url: 'https://pypi.org/', type: 'tool', description: 'Repositorio oficial de paquetes Python con mas de 400,000 proyectos' }
      );
    } else if (match(t, ['string', 'cadenas', 'texto'])) {
      resources.push(
        { title: 'Strings en Python — W3Schools', url: 'https://www.w3schools.com/python/python_strings.asp', type: 'link', description: 'Tutorial completo de strings: metodos, formateo, slicing y f-strings' },
        { title: 'Python String Formatting — Real Python', url: 'https://realpython.com/python-string-formatting/', type: 'link', description: 'Guia de formateo de cadenas: %, format(), f-strings y Template' },
        { title: 'Regex en Python — Real Python', url: 'https://realpython.com/regex-python/', type: 'link', description: 'Expresiones regulares en Python para busqueda y manipulacion de texto' }
      );
    } else if (match(t, ['decoradores', 'decorators', 'generadores', 'generators', 'avanzado'])) {
      resources.push(
        { title: 'Decoradores en Python — Real Python', url: 'https://realpython.com/primer-on-python-decorators/', type: 'link', description: 'Tutorial completo de decoradores: funciones, clases y patrones avanzados' },
        { title: 'Generadores en Python — Real Python', url: 'https://realpython.com/introduction-to-python-generators/', type: 'link', description: 'Guia de generadores y yield: iteracion lazy, pipelines y ahorro de memoria' },
        { title: 'Python Docs — Referencia avanzada', url: 'https://docs.python.org/es/3/reference/', type: 'link', description: 'Referencia del lenguaje Python para temas avanzados y comportamiento interno' }
      );
    } else if (match(t, ['testing', 'test', 'pytest', 'unittest', 'pruebas'])) {
      resources.push(
        { title: 'Testing con pytest — Real Python', url: 'https://realpython.com/pytest-python-testing/', type: 'link', description: 'Tutorial completo de testing con pytest: fixtures, parametrize y plugins' },
        { title: 'Python Testing — Real Python', url: 'https://realpython.com/python-testing/', type: 'link', description: 'Guia de estrategias de testing: unittest, pytest, mocking y TDD' },
        { title: 'Pytest Documentation', url: 'https://docs.pytest.org/en/stable/', type: 'link', description: 'Documentacion oficial de pytest con ejemplos y mejores practicas' }
      );
    } else {
      resources.push(
        { title: 'Python Tutorial — W3Schools', url: 'https://www.w3schools.com/python/', type: 'link', description: 'Tutorial completo de Python con editor interactivo y ejemplos practicos' },
        { title: 'Python — Real Python', url: 'https://realpython.com/', type: 'link', description: 'Tutoriales, guias y recursos avanzados de Python para todos los niveles' },
        { title: 'Python en espanol — freeCodeCamp', url: 'https://www.freecodecamp.org/espanol/learn/scientific-computing-with-python/', type: 'link', description: 'Curso gratuito de Python con certificacion, ejercicios y proyectos' }
      );
    }
    return resources;
  }

  // ---- NUMPY ----
  if (match(t, ['numpy', 'arrays', 'vectorizad'])) {
    resources.push(
      { title: 'NumPy Quickstart Tutorial', url: 'https://numpy.org/doc/stable/user/quickstart.html', type: 'link', description: 'Tutorial oficial de NumPy: arrays, operaciones vectorizadas, indexacion y broadcasting' },
      { title: 'NumPy Tutorial — W3Schools', url: 'https://www.w3schools.com/python/numpy/default.asp', type: 'link', description: 'Tutorial interactivo de NumPy con ejemplos editables de arrays y operaciones' },
      { title: 'Look Ma, No For-Loops — Real Python', url: 'https://realpython.com/numpy-array-programming/', type: 'link', description: 'Guia de programacion vectorizada con NumPy: eliminar bucles y optimizar codigo' }
    );
    return resources;
  }

  // ---- PANDAS ----
  if (match(t, ['pandas', 'dataframe', 'series', 'groupby', 'merge', 'join', 'concat', 'filtrado'])) {
    if (match(t, ['merge', 'join', 'concat'])) {
      resources.push(
        { title: 'Pandas Merge/Join — Real Python', url: 'https://realpython.com/pandas-merge-join-and-concat/', type: 'link', description: 'Guia completa de combinacion de DataFrames: merge, join, concat y append' },
        { title: 'Pandas Documentation — Merge', url: 'https://pandas.pydata.org/docs/user_guide/merging.html', type: 'link', description: 'Documentacion oficial de Pandas sobre merge, join y concatenacion de datos' },
        { title: 'Kaggle — Pandas Course', url: 'https://www.kaggle.com/learn/pandas', type: 'link', description: 'Curso practico de Pandas en Kaggle con datasets reales y ejercicios interactivos' }
      );
    } else if (match(t, ['groupby', 'agregacion', 'filtrado'])) {
      resources.push(
        { title: 'Pandas GroupBy — Real Python', url: 'https://realpython.com/pandas-groupby/', type: 'link', description: 'Tutorial de GroupBy: split-apply-combine, agregaciones y transformaciones' },
        { title: 'Pandas Filtering — W3Schools', url: 'https://www.w3schools.com/python/pandas/pandas_filtering.asp', type: 'link', description: 'Tutorial de filtrado de DataFrames con condiciones simples y multiples' },
        { title: 'Kaggle — Pandas Course', url: 'https://www.kaggle.com/learn/pandas', type: 'link', description: 'Ejercicios practicos de manipulacion de datos con Pandas' }
      );
    } else {
      resources.push(
        { title: 'Pandas Tutorial — W3Schools', url: 'https://www.w3schools.com/python/pandas/default.asp', type: 'link', description: 'Tutorial interactivo de Pandas: DataFrames, Series, lectura de datos y operaciones' },
        { title: 'Pandas Documentation', url: 'https://pandas.pydata.org/docs/getting_started/index.html', type: 'link', description: 'Documentacion oficial de Pandas con tutoriales de inicio rapido y guias de usuario' },
        { title: 'Kaggle — Pandas Course', url: 'https://www.kaggle.com/learn/pandas', type: 'link', description: 'Curso practico de Pandas con ejercicios en notebooks de Kaggle' }
      );
    }
    return resources;
  }

  // ---- MATPLOTLIB / SEABORN / VISUALIZACION ----
  if (match(t, ['matplotlib', 'seaborn', 'plotly', 'streamlit', 'dash', 'grafic', 'visualiz', 'heatmap', 'subplot', 'dashboard', 'tufte', 'storytelling'])) {
    if (match(t, ['matplotlib'])) {
      resources.push(
        { title: 'Matplotlib Tutorial — W3Schools', url: 'https://www.w3schools.com/python/matplotlib_intro.asp', type: 'link', description: 'Tutorial interactivo de Matplotlib: line plots, scatter, bar charts y estilos' },
        { title: 'Matplotlib Official Gallery', url: 'https://matplotlib.org/stable/gallery/index.html', type: 'link', description: 'Galeria oficial con cientos de ejemplos de graficos listos para copiar y adaptar' },
        { title: 'Matplotlib — Real Python', url: 'https://realpython.com/python-matplotlib-guide/', type: 'link', description: 'Guia completa de Matplotlib: anatomia de figuras, subplots y personalizacion' }
      );
    } else if (match(t, ['seaborn', 'heatmap'])) {
      resources.push(
        { title: 'Seaborn Tutorial', url: 'https://seaborn.pydata.org/tutorial.html', type: 'link', description: 'Tutorial oficial de Seaborn: estilos, paletas, heatmaps y graficos estadisticos' },
        { title: 'Seaborn Gallery', url: 'https://seaborn.pydata.org/examples/index.html', type: 'link', description: 'Galeria de ejemplos con codigo para cada tipo de grafico en Seaborn' },
        { title: 'Statistical Data Visualization — Kaggle', url: 'https://www.kaggle.com/learn/data-visualization', type: 'link', description: 'Curso de visualizacion de datos con Seaborn en Kaggle con ejercicios practicos' }
      );
    } else if (match(t, ['plotly', 'dash'])) {
      resources.push(
        { title: 'Plotly Python Documentation', url: 'https://plotly.com/python/', type: 'link', description: 'Documentacion de Plotly: graficos interactivos, mapas, 3D y animaciones' },
        { title: 'Dash Documentation', url: 'https://dash.plotly.com/', type: 'link', description: 'Framework para dashboards interactivos con Python y Plotly' },
        { title: 'Plotly Express — Tutorial', url: 'https://plotly.com/python/plotly-express/', type: 'link', description: 'API de alto nivel de Plotly para crear graficos interactivos en una sola linea' }
      );
    } else if (match(t, ['streamlit'])) {
      resources.push(
        { title: 'Streamlit Documentation', url: 'https://docs.streamlit.io/', type: 'tool', description: 'Documentacion oficial de Streamlit: crea apps de datos interactivas con Python' },
        { title: 'Streamlit Gallery', url: 'https://streamlit.io/gallery', type: 'tool', description: 'Galeria de apps creadas con Streamlit para inspiracion y codigo fuente' },
        { title: 'Build a Dashboard — Real Python', url: 'https://realpython.com/python-dash/', type: 'link', description: 'Tutorial paso a paso para construir dashboards de datos con Python' }
      );
    } else if (match(t, ['tufte', 'principios', 'storytelling', 'narrativa'])) {
      resources.push(
        { title: 'Data Visualization Best Practices', url: 'https://www.kaggle.com/learn/data-visualization', type: 'link', description: 'Curso de Kaggle sobre principios de visualizacion efectiva y buenas practicas' },
        { title: 'Storytelling with Data — YouTube', url: 'https://www.youtube.com/c/storytellingwithdata', type: 'video', description: 'Canal de visualizacion de datos con principios de storytelling y diseno efectivo' },
        { title: 'The Python Graph Gallery', url: 'https://www.python-graph-gallery.com/', type: 'link', description: 'Galeria de graficos en Python con codigo y mejores practicas de diseno' }
      );
    } else {
      resources.push(
        { title: 'Data Visualization — Kaggle', url: 'https://www.kaggle.com/learn/data-visualization', type: 'link', description: 'Curso de visualizacion con Seaborn y Matplotlib en Kaggle' },
        { title: 'The Python Graph Gallery', url: 'https://www.python-graph-gallery.com/', type: 'link', description: 'Galeria completa de graficos Python: 400+ ejemplos con codigo' },
        { title: 'Storytelling with Data — YouTube', url: 'https://www.youtube.com/c/storytellingwithdata', type: 'video', description: 'Principios de visualizacion efectiva y narrativa con datos' }
      );
    }
    return resources;
  }

  // ---- SQL / DATABASES ----
  if (match(t, ['sql', 'select', 'insert', 'create table', 'join', 'where', 'group by', 'subquer', 'vista', 'trigger', 'procedure', 'postgresql', 'mysql', 'orm', 'sqlalchemy', 'modelo entidad', 'normalizacion', 'transaccion', 'indice', 'index'])) {
    if (match(t, ['postgresql', 'postgres'])) {
      resources.push(
        { title: 'PostgreSQL Documentation', url: 'https://www.postgresql.org/docs/current/', type: 'link', description: 'Documentacion oficial de PostgreSQL: consultas avanzadas, funciones y optimizacion' },
        { title: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/', type: 'link', description: 'Tutorial practico de PostgreSQL con ejemplos paso a paso' },
        { title: 'SQL Avanzado — Kaggle', url: 'https://www.kaggle.com/learn/advanced-sql', type: 'link', description: 'Curso de SQL avanzado con BigQuery: JOINs, window functions y optimizacion' }
      );
    } else if (match(t, ['orm', 'sqlalchemy'])) {
      resources.push(
        { title: 'SQLAlchemy Documentation', url: 'https://docs.sqlalchemy.org/en/20/', type: 'link', description: 'Documentacion oficial de SQLAlchemy: ORM, Core y patrones de acceso a datos' },
        { title: 'SQLAlchemy Tutorial — Real Python', url: 'https://realpython.com/python-sqlite-sqlalchemy/', type: 'link', description: 'Tutorial de SQLAlchemy: modelos, relaciones, consultas y migraciones' },
        { title: 'SQL para Data Science — Kaggle', url: 'https://www.kaggle.com/learn/intro-to-sql', type: 'link', description: 'Curso practico de SQL con datasets reales en notebooks de Kaggle' }
      );
    } else if (match(t, ['join', 'inner', 'left', 'right', 'full'])) {
      resources.push(
        { title: 'SQL JOINs — W3Schools', url: 'https://www.w3schools.com/sql/sql_join.asp', type: 'link', description: 'Tutorial visual de SQL JOINs: INNER, LEFT, RIGHT, FULL con diagramas Venn' },
        { title: 'SQL Joins — Khan Academy', url: 'https://es.khanacademy.org/computing/computer-programming/sql', type: 'link', description: 'Curso interactivo de SQL con enfasis en JOINs y relaciones entre tablas' },
        { title: 'SQL Advanced — Kaggle', url: 'https://www.kaggle.com/learn/advanced-sql', type: 'link', description: 'Curso de SQL avanzado en Kaggle con ejercicios de JOINs complejos' }
      );
    } else if (match(t, ['modelo entidad', 'entidad-relacion', 'er diagram', 'normalizacion'])) {
      resources.push(
        { title: 'Modelo Entidad-Relacion — Khan Academy', url: 'https://es.khanacademy.org/computing/computer-programming/sql', type: 'link', description: 'Fundamentos de diseno de bases de datos y modelo relacional en espanol' },
        { title: 'Database Design — W3Schools', url: 'https://www.w3schools.com/sql/sql_create_db.asp', type: 'link', description: 'Tutorial de creacion de bases de datos, tablas y relaciones en SQL' },
        { title: 'SQL para Data Science — Kaggle', url: 'https://www.kaggle.com/learn/intro-to-sql', type: 'link', description: 'Introduccion practica a SQL y bases de datos con datasets reales' }
      );
    } else {
      resources.push(
        { title: 'SQL Tutorial — W3Schools', url: 'https://www.w3schools.com/sql/', type: 'link', description: 'Tutorial completo de SQL desde basico hasta avanzado con editor interactivo' },
        { title: 'SQL — Khan Academy (Espanol)', url: 'https://es.khanacademy.org/computing/computer-programming/sql', type: 'link', description: 'Curso de SQL en espanol con ejercicios interactivos y videos explicativos' },
        { title: 'SQL para Data Science — Kaggle', url: 'https://www.kaggle.com/learn/intro-to-sql', type: 'link', description: 'Curso practico de SQL con BigQuery y datasets reales' }
      );
    }
    return resources;
  }

  // ---- NOSQL / MONGODB ----
  if (match(t, ['nosql', 'mongodb', 'redis', 'cassandra', 'neo4j', 'base de datos no relacional'])) {
    if (match(t, ['mongodb', 'documento'])) {
      resources.push(
        { title: 'MongoDB University', url: 'https://university.mongodb.com/', type: 'link', description: 'Cursos gratuitos oficiales de MongoDB: CRUD, agregaciones e indexacion' },
        { title: 'MongoDB Documentation', url: 'https://www.mongodb.com/docs/manual/', type: 'link', description: 'Documentacion oficial de MongoDB con tutoriales y referencia de operaciones' },
        { title: 'NoSQL — W3Schools', url: 'https://www.w3schools.com/mongodb/', type: 'link', description: 'Tutorial interactivo de MongoDB con ejemplos practicos' }
      );
    } else if (match(t, ['redis'])) {
      resources.push(
        { title: 'Redis Documentation', url: 'https://redis.io/docs/', type: 'link', description: 'Documentacion oficial de Redis: tipos de datos, comandos y casos de uso' },
        { title: 'Redis University', url: 'https://university.redis.com/', type: 'link', description: 'Cursos gratuitos de Redis: caching, messaging y data structures' },
        { title: 'Try Redis — Interactive', url: 'https://try.redis.io/', type: 'tool', description: 'Tutorial interactivo de Redis en el navegador sin instalacion' }
      );
    } else {
      resources.push(
        { title: 'NoSQL Databases — W3Schools', url: 'https://www.w3schools.com/mongodb/', type: 'link', description: 'Introduccion a bases de datos NoSQL con MongoDB como ejemplo practico' },
        { title: 'MongoDB University', url: 'https://university.mongodb.com/', type: 'link', description: 'Cursos gratuitos de MongoDB para comenzar con bases de datos de documentos' },
        { title: 'DotCSV — Bases de datos', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Explicaciones en espanol sobre bases de datos y su uso en ciencia de datos' }
      );
    }
    return resources;
  }

  // ---- MACHINE LEARNING ----
  if (match(t, ['machine learning', 'regresion lineal', 'regresion logistic', 'arboles de decision', 'random forest', 'knn', 'k-nearest', 'svm', 'support vector', 'clustering', 'k-means', 'pca', 'reduccion dimensional', 'ensemble', 'gradient boosting', 'xgboost', 'bagging', 'cross-validation', 'hyperparameter', 'overfitting', 'underfitting', 'bias', 'varianza', 'curva de aprendizaje', 'feature selection', 'desbalanceado', 'supervisado', 'no supervisado']) || match(s, ['machine learning'])) {
    if (match(t, ['regresion lineal', 'linear regression'])) {
      resources.push(
        { title: 'Scikit-learn — Linear Regression', url: 'https://scikit-learn.org/stable/modules/linear_model.html', type: 'link', description: 'Documentacion oficial de modelos lineales en scikit-learn: OLS, Ridge, Lasso' },
        { title: 'Intro to ML — Kaggle', url: 'https://www.kaggle.com/learn/intro-to-machine-learning', type: 'link', description: 'Curso practico de Machine Learning en Kaggle comenzando con regresion' },
        { title: 'StatQuest — Linear Regression', url: 'https://www.youtube.com/watch?v=nk2CQITm_eo', type: 'video', description: 'Explicacion visual e intuitiva de regresion lineal por StatQuest' }
      );
    } else if (match(t, ['regresion logistic', 'clasificacion binaria'])) {
      resources.push(
        { title: 'Scikit-learn — Logistic Regression', url: 'https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression', type: 'link', description: 'Documentacion de regresion logistica en scikit-learn: parametros y ejemplos' },
        { title: 'Intermediate ML — Kaggle', url: 'https://www.kaggle.com/learn/intermediate-machine-learning', type: 'link', description: 'Curso intermedio de ML en Kaggle: clasificacion, validacion y pipelines' },
        { title: 'StatQuest — Logistic Regression', url: 'https://www.youtube.com/watch?v=yIYKR4sgzI8', type: 'video', description: 'Explicacion visual de regresion logistica y clasificacion por StatQuest' }
      );
    } else if (match(t, ['arboles', 'decision tree', 'random forest'])) {
      resources.push(
        { title: 'Scikit-learn — Decision Trees', url: 'https://scikit-learn.org/stable/modules/tree.html', type: 'link', description: 'Documentacion de arboles de decision y random forest en scikit-learn' },
        { title: 'Random Forest — Kaggle', url: 'https://www.kaggle.com/learn/intro-to-machine-learning', type: 'link', description: 'Tutorial practico de Random Forest con predicciones en datasets reales' },
        { title: 'StatQuest — Random Forest', url: 'https://www.youtube.com/watch?v=J4Wdy0Wc_xQ', type: 'video', description: 'Explicacion visual de Random Forest: bagging, feature importance y OOB' }
      );
    } else if (match(t, ['knn', 'k-nearest', 'vecinos'])) {
      resources.push(
        { title: 'Scikit-learn — KNN', url: 'https://scikit-learn.org/stable/modules/neighbors.html', type: 'link', description: 'Documentacion de K-Nearest Neighbors: clasificacion y regresion' },
        { title: 'KNN — Real Python', url: 'https://realpython.com/knn-python/', type: 'link', description: 'Tutorial completo de KNN en Python: implementacion desde cero y scikit-learn' },
        { title: 'StatQuest — KNN', url: 'https://www.youtube.com/watch?v=HVXime0nQeI', type: 'video', description: 'Explicacion intuitiva de K-Nearest Neighbors por StatQuest' }
      );
    } else if (match(t, ['clustering', 'k-means', 'dbscan', 'jerarquico'])) {
      resources.push(
        { title: 'Scikit-learn — Clustering', url: 'https://scikit-learn.org/stable/modules/clustering.html', type: 'link', description: 'Documentacion de algoritmos de clustering: K-Means, DBSCAN, Hierarchical' },
        { title: 'Intro to ML — Kaggle (Clustering)', url: 'https://www.kaggle.com/learn/intro-to-machine-learning', type: 'link', description: 'Ejercicios practicos de clustering con datasets reales en Kaggle' },
        { title: 'StatQuest — K-Means Clustering', url: 'https://www.youtube.com/watch?v=4b5d3muPQmA', type: 'video', description: 'Explicacion visual de K-Means clustering por StatQuest' }
      );
    } else if (match(t, ['pca', 'reduccion dimensional', 'dimensionality'])) {
      resources.push(
        { title: 'Scikit-learn — PCA', url: 'https://scikit-learn.org/stable/modules/decomposition.html#pca', type: 'link', description: 'Documentacion de PCA y reduccion dimensional en scikit-learn' },
        { title: 'PCA — Real Python', url: 'https://realpython.com/python-data-cleaning-numpy-pandas/', type: 'link', description: 'Tutorial de analisis de componentes principales con Python' },
        { title: 'StatQuest — PCA', url: 'https://www.youtube.com/watch?v=FgakZw6K1QQ', type: 'video', description: 'Explicacion visual e intuitiva de PCA por StatQuest' }
      );
    } else if (match(t, ['cross-validation', 'validacion cruzada'])) {
      resources.push(
        { title: 'Scikit-learn — Cross-validation', url: 'https://scikit-learn.org/stable/modules/cross_validation.html', type: 'link', description: 'Documentacion de cross-validation: KFold, StratifiedKFold, LeaveOneOut' },
        { title: 'Intermediate ML — Kaggle', url: 'https://www.kaggle.com/learn/intermediate-machine-learning', type: 'link', description: 'Curso con ejercicios de cross-validation y seleccion de modelos' },
        { title: 'StatQuest — Cross Validation', url: 'https://www.youtube.com/watch?v=fSytzGwwBVw', type: 'video', description: 'Explicacion visual de cross-validation y su importancia por StatQuest' }
      );
    } else if (match(t, ['hyperparameter', 'tuning', 'grid search', 'random search'])) {
      resources.push(
        { title: 'Scikit-learn — Hyperparameter Tuning', url: 'https://scikit-learn.org/stable/modules/grid_search.html', type: 'link', description: 'Documentacion de GridSearchCV, RandomizedSearchCV y estrategias de tuning' },
        { title: 'Hyperparameter Tuning — Kaggle', url: 'https://www.kaggle.com/learn/intermediate-machine-learning', type: 'link', description: 'Ejercicios practicos de optimizacion de hyperparametros en Kaggle' },
        { title: 'Optuna — Framework de Optimizacion', url: 'https://optuna.org/', type: 'tool', description: 'Framework de optimizacion de hiperparametros con pruning y visualizacion' }
      );
    } else if (match(t, ['ensemble', 'gradient boosting', 'xgboost', 'lightgbm', 'bagging'])) {
      resources.push(
        { title: 'Scikit-learn — Ensemble Methods', url: 'https://scikit-learn.org/stable/modules/ensemble.html', type: 'link', description: 'Documentacion de metodos ensemble: Bagging, Boosting, Stacking, Voting' },
        { title: 'XGBoost Documentation', url: 'https://xgboost.readthedocs.io/', type: 'link', description: 'Documentacion oficial de XGBoost: parametros, tuning y mejores practicas' },
        { title: 'StatQuest — Gradient Boost', url: 'https://www.youtube.com/watch?v=3CC4N4z3GJc', type: 'video', description: 'Explicacion visual de Gradient Boosting paso a paso por StatQuest' }
      );
    } else if (match(t, ['desbalanceado', 'imbalanced', 'smote'])) {
      resources.push(
        { title: 'Imbalanced-learn Documentation', url: 'https://imbalanced-learn.org/stable/', type: 'link', description: 'Libreria para manejo de datos desbalanceados: SMOTE, undersampling, oversampling' },
        { title: 'Scikit-learn — Handling Imbalanced Data', url: 'https://scikit-learn.org/stable/modules/generated/sklearn.utils.class_weight.compute_class_weight.html', type: 'link', description: 'Estrategias de scikit-learn para datos desbalanceados: class_weight y sample_weight' },
        { title: 'Kaggle — Handling Imbalanced Data', url: 'https://www.kaggle.com/learn/intermediate-machine-learning', type: 'link', description: 'Ejercicios de ML con datasets desbalanceados y tecnicas de rebalanceo' }
      );
    } else if (match(t, ['series temporales', 'time series', 'forecast'])) {
      resources.push(
        { title: 'Time Series — Kaggle', url: 'https://www.kaggle.com/learn/time-series', type: 'link', description: 'Curso de series temporales: tendencias, estacionalidad, ARIMA y forecasting' },
        { title: 'Scikit-learn — Time Series', url: 'https://scikit-learn.org/stable/modules/cross_validation.html#time-series-split', type: 'link', description: 'TimeSeriesSplit y validacion para datos temporales en scikit-learn' },
        { title: 'StatQuest — Time Series', url: 'https://www.youtube.com/watch?v=nxJoHk3Mvz0', type: 'video', description: 'Explicacion visual de analisis de series temporales por StatQuest' }
      );
    } else if (match(t, ['anomalia', 'deteccion de anomalia', 'outlier'])) {
      resources.push(
        { title: 'Scikit-learn — Anomaly Detection', url: 'https://scikit-learn.org/stable/modules/outlier_detection.html', type: 'link', description: 'Documentacion de deteccion de anomalias: Isolation Forest, Local Outlier Factor' },
        { title: 'Anomaly Detection — Kaggle', url: 'https://www.kaggle.com/learn/intro-to-machine-learning', type: 'link', description: 'Datasets y notebooks para practicar deteccion de anomalias' },
        { title: 'PyOD Library', url: 'https://pyod.readthedocs.io/', type: 'tool', description: 'Libreria de Python para deteccion de outliers con 40+ algoritmos' }
      );
    } else if (match(t, ['feature', 'seleccion de variable', 'feature engineering', 'feature selection'])) {
      resources.push(
        { title: 'Feature Engineering — Kaggle', url: 'https://www.kaggle.com/learn/feature-engineering', type: 'link', description: 'Curso de feature engineering: creacion, seleccion y transformacion de variables' },
        { title: 'Scikit-learn — Feature Selection', url: 'https://scikit-learn.org/stable/modules/feature_selection.html', type: 'link', description: 'Documentacion de metodos de seleccion de features: mutual info, RFE, SelectKBest' },
        { title: 'Feature Engineering — Real Python', url: 'https://realpython.com/python-data-cleaning-numpy-pandas/', type: 'link', description: 'Tutorial de limpieza y preparacion de datos para Machine Learning' }
      );
    } else if (match(t, ['pipeline', 'flujo', 'workflow'])) {
      resources.push(
        { title: 'Scikit-learn — Pipelines', url: 'https://scikit-learn.org/stable/modules/compose.html', type: 'link', description: 'Documentacion de Pipelines y ColumnTransformer para flujos reproducibles de ML' },
        { title: 'ML Pipelines — Kaggle', url: 'https://www.kaggle.com/learn/intermediate-machine-learning', type: 'link', description: 'Ejercicios de pipelines de ML end-to-end con datos reales' },
        { title: 'ML Workflow — Real Python', url: 'https://realpython.com/train-test-split-python-data/', type: 'link', description: 'Tutorial de flujo completo de ML: split, train, evaluate, predict' }
      );
    } else if (match(t, ['recomendacion', 'recommendation', 'collaborative', 'content-based'])) {
      resources.push(
        { title: 'Surprise Library — Recommender Systems', url: 'https://surpriselib.com/', type: 'link', description: 'Libreria Python para sistemas de recomendacion: SVD, KNN, NMF' },
        { title: 'Building Recommender Systems — Kaggle', url: 'https://www.kaggle.com/learn/intro-to-machine-learning', type: 'link', description: 'Datasets y notebooks para construir sistemas de recomendacion' },
        { title: 'Recommender Systems — DotCSV', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Explicacion en espanol de sistemas de recomendacion y filtrado colaborativo' }
      );
    } else if (match(t, ['metricas', 'evaluacion', 'precision', 'recall', 'f1', 'auc', 'roc', 'accuracy'])) {
      resources.push(
        { title: 'Scikit-learn — Metrics', url: 'https://scikit-learn.org/stable/modules/model_evaluation.html', type: 'link', description: 'Documentacion completa de metricas: accuracy, precision, recall, F1, AUC-ROC' },
        { title: 'Intermediate ML — Kaggle', url: 'https://www.kaggle.com/learn/intermediate-machine-learning', type: 'link', description: 'Ejercicios de evaluacion de modelos con metricas reales' },
        { title: 'StatQuest — ROC and AUC', url: 'https://www.youtube.com/watch?v=4jRBRDbJemM', type: 'video', description: 'Explicacion visual de curvas ROC y AUC por StatQuest' }
      );
    } else {
      resources.push(
        { title: 'Scikit-learn Documentation', url: 'https://scikit-learn.org/stable/', type: 'link', description: 'Documentacion oficial de scikit-learn: algoritmos, preprocesamiento y evaluacion' },
        { title: 'Intro to Machine Learning — Kaggle', url: 'https://www.kaggle.com/learn/intro-to-machine-learning', type: 'link', description: 'Curso practico de ML en Kaggle con ejercicios y datasets reales' },
        { title: 'DotCSV — Machine Learning', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Canal en espanol con explicaciones visuales de algoritmos de Machine Learning' }
      );
    }
    return resources;
  }

  // ---- DEEP LEARNING ----
  if (match(t, ['deep learning', 'redes neuronales', 'neural network', 'tensorflow', 'keras', 'pytorch', 'cnn', 'rnn', 'lstm', 'gru', 'transformer', 'attention', 'backpropagation', 'perceptron', 'convolucional', 'recurrente', 'autoencoder', 'gan', 'generativa', 'transfer learning']) || match(s, ['deep learning'])) {
    if (match(t, ['tensorflow', 'keras'])) {
      resources.push(
        { title: 'TensorFlow Tutorials', url: 'https://www.tensorflow.org/tutorials', type: 'link', description: 'Tutoriales oficiales de TensorFlow: clasificacion, regresion, CNNs, RNNs' },
        { title: 'Keras Documentation', url: 'https://keras.io/guides/', type: 'link', description: 'Guias oficiales de Keras: Sequential, Functional API, custom layers' },
        { title: 'DotCSV — Deep Learning', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Explicaciones en espanol de redes neuronales y deep learning' }
      );
    } else if (match(t, ['pytorch'])) {
      resources.push(
        { title: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/', type: 'link', description: 'Tutoriales oficiales de PyTorch: tensores, autograd, modelos y deployment' },
        { title: 'PyTorch Documentation', url: 'https://pytorch.org/docs/stable/', type: 'link', description: 'Documentacion completa de PyTorch: nn, optim, data, transforms' },
        { title: 'Deep Learning with PyTorch — freeCodeCamp', url: 'https://www.freecodecamp.org/espanol/', type: 'link', description: 'Recursos de deep learning en espanol con ejercicios practicos' }
      );
    } else if (match(t, ['cnn', 'convolucional', 'computer vision', 'vision'])) {
      resources.push(
        { title: 'TensorFlow — CNN Tutorial', url: 'https://www.tensorflow.org/tutorials/images/cnn', type: 'link', description: 'Tutorial oficial de redes convolucionales para clasificacion de imagenes' },
        { title: 'CNN Explainer — Visual', url: 'https://poloclub.github.io/cnn-explainer/', type: 'tool', description: 'Herramienta interactiva para visualizar como funcionan las CNNs capa por capa' },
        { title: '3Blue1Brown — Neural Networks', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', type: 'video', description: 'Serie visual sobre redes neuronales: perceptrones, backpropagation y CNNs' }
      );
    } else if (match(t, ['rnn', 'lstm', 'gru', 'recurrente', 'secuencia'])) {
      resources.push(
        { title: 'TensorFlow — RNN Tutorial', url: 'https://www.tensorflow.org/guide/keras/working_with_rnns', type: 'link', description: 'Tutorial oficial de redes recurrentes: SimpleRNN, LSTM, GRU en Keras' },
        { title: 'Understanding LSTM — Colah Blog', url: 'https://colah.github.io/posts/2015-08-Understanding-LSTMs/', type: 'link', description: 'Explicacion visual legendaria de como funcionan las redes LSTM' },
        { title: 'DotCSV — Redes Recurrentes', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Explicacion en espanol de RNN, LSTM y procesamiento de secuencias' }
      );
    } else if (match(t, ['transformer', 'attention', 'self-attention'])) {
      resources.push(
        { title: 'The Illustrated Transformer — Jay Alammar', url: 'https://jalammar.github.io/illustrated-transformer/', type: 'link', description: 'Explicacion visual de la arquitectura Transformer: self-attention y multi-head' },
        { title: 'Hugging Face — Transformers Course', url: 'https://huggingface.co/learn/nlp-course/chapter1/1', type: 'link', description: 'Curso gratuito de Transformers con Hugging Face: teoria y practica' },
        { title: '3Blue1Brown — Attention', url: 'https://www.youtube.com/watch?v=eMlx5fFNoYc', type: 'video', description: 'Explicacion visual del mecanismo de atencion en Transformers' }
      );
    } else if (match(t, ['gan', 'generativa adversaria', 'adversarial'])) {
      resources.push(
        { title: 'TensorFlow — GAN Tutorial', url: 'https://www.tensorflow.org/tutorials/generative/dcgan', type: 'link', description: 'Tutorial de GANs con TensorFlow: DCGAN para generacion de imagenes' },
        { title: 'GAN Lab — Interactive', url: 'https://poloclub.github.io/ganlab/', type: 'tool', description: 'Herramienta visual interactiva para entender GANs en el navegador' },
        { title: 'DotCSV — GANs Explicadas', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Explicacion en espanol de redes generativas adversarias y sus aplicaciones' }
      );
    } else if (match(t, ['transfer learning', 'fine-tuning', 'pretrained', 'preentrenado'])) {
      resources.push(
        { title: 'TensorFlow — Transfer Learning', url: 'https://www.tensorflow.org/tutorials/images/transfer_learning', type: 'link', description: 'Tutorial de transfer learning: usar modelos pre-entrenados para nuevas tareas' },
        { title: 'Hugging Face — Model Hub', url: 'https://huggingface.co/models', type: 'tool', description: 'Hub de modelos pre-entrenados: BERT, GPT, ViT listos para fine-tuning' },
        { title: 'Transfer Learning — Kaggle', url: 'https://www.kaggle.com/learn/computer-vision', type: 'link', description: 'Curso de computer vision con transfer learning en Kaggle' }
      );
    } else if (match(t, ['backpropagation', 'retropropagacion', 'gradiente'])) {
      resources.push(
        { title: '3Blue1Brown — Backpropagation', url: 'https://www.youtube.com/watch?v=Ilg3gGewQ5U', type: 'video', description: 'Explicacion visual magistral de backpropagation y calculo de gradientes' },
        { title: 'TensorFlow Playground', url: 'https://playground.tensorflow.org/', type: 'tool', description: 'Herramienta visual interactiva para experimentar con redes neuronales en el navegador' },
        { title: 'Neural Networks — Kaggle', url: 'https://www.kaggle.com/learn/intro-to-deep-learning', type: 'link', description: 'Curso de intro a deep learning con ejercicios de backpropagation' }
      );
    } else if (match(t, ['autoencoder', 'variacional', 'vae'])) {
      resources.push(
        { title: 'TensorFlow — Autoencoder Tutorial', url: 'https://www.tensorflow.org/tutorials/generative/autoencoder', type: 'link', description: 'Tutorial de autoencoders: vanilla, denoising y variacional con TensorFlow' },
        { title: 'Intro to Deep Learning — Kaggle', url: 'https://www.kaggle.com/learn/intro-to-deep-learning', type: 'link', description: 'Curso de deep learning en Kaggle con ejercicios de autoencoders' },
        { title: 'Understanding VAEs — Blog', url: 'https://towardsdatascience.com/understanding-variational-autoencoders-vaes-f70510919f73', type: 'link', description: 'Explicacion detallada de autoencoders variacionales con matematicas e intuicion' }
      );
    } else {
      resources.push(
        { title: 'TensorFlow Tutorials', url: 'https://www.tensorflow.org/tutorials', type: 'link', description: 'Tutoriales oficiales de TensorFlow para deep learning y redes neuronales' },
        { title: 'Intro to Deep Learning — Kaggle', url: 'https://www.kaggle.com/learn/intro-to-deep-learning', type: 'link', description: 'Curso practico de deep learning con ejercicios en notebooks de Kaggle' },
        { title: '3Blue1Brown — Neural Networks', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', type: 'video', description: 'Serie visual legendaria sobre redes neuronales y deep learning' }
      );
    }
    return resources;
  }

  // ---- NLP ----
  if (match(t, ['nlp', 'lenguaje natural', 'tokenizacion', 'tokeniz', 'bag of words', 'tf-idf', 'word2vec', 'embedding', 'sentimiento', 'sentiment', 'ner', 'entidad nombrada', 'clasificacion de texto', 'text classif', 'spacy', 'nltk', 'hugging face', 'bert', 'gpt', 'llm']) || match(s, ['procesamiento de lenguaje natural', 'nlp'])) {
    if (match(t, ['tokenizacion', 'preprocesamiento', 'preprocessing'])) {
      resources.push(
        { title: 'NLTK Documentation', url: 'https://www.nltk.org/', type: 'link', description: 'Documentacion de NLTK: tokenizacion, stemming, POS tagging y recursos linguisticos' },
        { title: 'spaCy 101 — Tutorial', url: 'https://spacy.io/usage/spacy-101', type: 'link', description: 'Introduccion a spaCy: tokenizacion, NER, POS tagging con modelos en espanol' },
        { title: 'Hugging Face NLP Course', url: 'https://huggingface.co/learn/nlp-course/chapter1/1', type: 'link', description: 'Curso gratuito de NLP con Transformers: tokenizacion moderna con BPE y SentencePiece' }
      );
    } else if (match(t, ['bag of words', 'tf-idf', 'bow'])) {
      resources.push(
        { title: 'Scikit-learn — Text Feature Extraction', url: 'https://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction', type: 'link', description: 'Documentacion de CountVectorizer y TfidfVectorizer en scikit-learn' },
        { title: 'NLP — Kaggle Course', url: 'https://www.kaggle.com/learn/natural-language-processing', type: 'link', description: 'Curso practico de NLP en Kaggle: BoW, TF-IDF y clasificacion de texto' },
        { title: 'DotCSV — NLP Explicado', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Explicaciones en espanol de procesamiento de lenguaje natural' }
      );
    } else if (match(t, ['sentimiento', 'sentiment', 'opinion'])) {
      resources.push(
        { title: 'Hugging Face — Sentiment Analysis', url: 'https://huggingface.co/tasks/text-classification', type: 'link', description: 'Modelos pre-entrenados para analisis de sentimiento en multiples idiomas' },
        { title: 'NLP — Kaggle Course', url: 'https://www.kaggle.com/learn/natural-language-processing', type: 'link', description: 'Ejercicios de clasificacion de sentimiento con datasets reales' },
        { title: 'VADER Sentiment — NLTK', url: 'https://www.nltk.org/howto/sentiment.html', type: 'link', description: 'Tutorial de VADER para analisis de sentimiento basado en reglas' }
      );
    } else if (match(t, ['word2vec', 'embedding', 'word embedding', 'representacion'])) {
      resources.push(
        { title: 'Word2Vec — Gensim', url: 'https://radimrehurek.com/gensim/models/word2vec.html', type: 'link', description: 'Documentacion de Word2Vec en Gensim: entrenamiento y uso de embeddings' },
        { title: 'The Illustrated Word2Vec — Jay Alammar', url: 'https://jalammar.github.io/illustrated-word2vec/', type: 'link', description: 'Explicacion visual de Word2Vec: CBOW, Skip-gram y embeddings semanticos' },
        { title: 'NLP Course — Hugging Face', url: 'https://huggingface.co/learn/nlp-course/chapter1/1', type: 'link', description: 'Capitulo sobre embeddings y representaciones en el curso de NLP' }
      );
    } else if (match(t, ['llm', 'large language', 'gpt', 'api', 'openai', 'claude', 'gemini'])) {
      resources.push(
        { title: 'Hugging Face — LLM Course', url: 'https://huggingface.co/learn/nlp-course/chapter1/1', type: 'link', description: 'Curso completo de LLMs: arquitectura, fine-tuning y deployment' },
        { title: 'OpenAI API Documentation', url: 'https://platform.openai.com/docs/', type: 'link', description: 'Documentacion oficial de la API de OpenAI: GPT, embeddings y fine-tuning' },
        { title: 'DotCSV — LLMs y GPT', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Explicaciones en espanol de Large Language Models y GPT' }
      );
    } else if (match(t, ['bert', 'fine-tuning', 'pretrained'])) {
      resources.push(
        { title: 'Hugging Face — BERT Tutorial', url: 'https://huggingface.co/learn/nlp-course/chapter3/1', type: 'link', description: 'Tutorial de fine-tuning de BERT para clasificacion y NER' },
        { title: 'The Illustrated BERT — Jay Alammar', url: 'https://jalammar.github.io/illustrated-bert/', type: 'link', description: 'Explicacion visual de BERT: pre-training, fine-tuning y uso practico' },
        { title: 'Hugging Face Model Hub', url: 'https://huggingface.co/models', type: 'tool', description: 'Miles de modelos pre-entrenados listos para usar y fine-tunear' }
      );
    } else {
      resources.push(
        { title: 'Hugging Face NLP Course', url: 'https://huggingface.co/learn/nlp-course/chapter1/1', type: 'link', description: 'Curso gratuito de NLP con Transformers por Hugging Face' },
        { title: 'NLP — Kaggle Course', url: 'https://www.kaggle.com/learn/natural-language-processing', type: 'link', description: 'Curso practico de NLP en Kaggle con ejercicios y datasets' },
        { title: 'DotCSV — NLP', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Explicaciones en espanol de procesamiento de lenguaje natural e IA' }
      );
    }
    return resources;
  }

  // ---- IA GENERATIVA / LLMs ----
  if (match(t, ['ia generativa', 'generative ai', 'prompt', 'chatgpt', 'imagen genera', 'diffusion', 'midjourney', 'dall-e', 'stable diffusion', 'rag', 'retrieval augmented']) || match(s, ['ia generativa', 'llm'])) {
    if (match(t, ['prompt', 'engineering', 'ingenieria de prompt'])) {
      resources.push(
        { title: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/', type: 'link', description: 'Guia completa de ingenieria de prompts: tecnicas, patrones y mejores practicas' },
        { title: 'OpenAI — Prompt Engineering', url: 'https://platform.openai.com/docs/guides/prompt-engineering', type: 'link', description: 'Guia oficial de OpenAI sobre ingenieria de prompts efectivos' },
        { title: 'DotCSV — Prompt Engineering', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Tecnicas de prompt engineering explicadas en espanol' }
      );
    } else if (match(t, ['rag', 'retrieval', 'vectorstore', 'langchain'])) {
      resources.push(
        { title: 'LangChain Documentation', url: 'https://python.langchain.com/docs/get_started/introduction', type: 'link', description: 'Framework para apps con LLMs: RAG, chains, agents y memory' },
        { title: 'RAG Tutorial — Hugging Face', url: 'https://huggingface.co/learn/nlp-course/chapter1/1', type: 'link', description: 'Tutorial de Retrieval Augmented Generation con Transformers' },
        { title: 'Pinecone — Vector Database', url: 'https://www.pinecone.io/learn/', type: 'link', description: 'Recursos educativos sobre bases de datos vectoriales y RAG' }
      );
    } else if (match(t, ['difusion', 'diffusion', 'imagen', 'dall', 'midjourney', 'stable'])) {
      resources.push(
        { title: 'Hugging Face — Diffusion Models', url: 'https://huggingface.co/docs/diffusers/', type: 'link', description: 'Libreria Diffusers para modelos de generacion de imagenes con IA' },
        { title: 'Stability AI — Stable Diffusion', url: 'https://stability.ai/', type: 'link', description: 'Plataforma oficial de Stable Diffusion y modelos de generacion de imagenes' },
        { title: 'DotCSV — IA Generativa', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Explicaciones en espanol de modelos de difusion e IA generativa' }
      );
    } else {
      resources.push(
        { title: 'Hugging Face — Generative AI', url: 'https://huggingface.co/learn/nlp-course/chapter1/1', type: 'link', description: 'Curso de IA Generativa con Transformers: GPT, BERT, T5 y mas' },
        { title: 'OpenAI API Documentation', url: 'https://platform.openai.com/docs/', type: 'link', description: 'Documentacion oficial de la API de OpenAI para aplicaciones de IA generativa' },
        { title: 'DotCSV — IA Generativa', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Canal en espanol con las ultimas novedades en IA generativa y LLMs' }
      );
    }
    return resources;
  }

  // ---- COMPUTER VISION ----
  if (match(t, ['vision artificial', 'computer vision', 'opencv', 'yolo', 'deteccion de objetos', 'segmentacion', 'ocr', 'reconocimiento', 'imagen', 'camara']) || match(s, ['vision artificial'])) {
    if (match(t, ['opencv'])) {
      resources.push(
        { title: 'OpenCV Python Tutorials', url: 'https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html', type: 'link', description: 'Tutoriales oficiales de OpenCV para Python: procesamiento de imagenes y video' },
        { title: 'OpenCV Course — freeCodeCamp', url: 'https://www.freecodecamp.org/espanol/', type: 'link', description: 'Curso gratuito de Computer Vision con OpenCV y Python' },
        { title: 'Computer Vision — Kaggle', url: 'https://www.kaggle.com/learn/computer-vision', type: 'link', description: 'Curso de vision por computadora con ejercicios practicos en Kaggle' }
      );
    } else if (match(t, ['yolo', 'deteccion de objetos', 'object detection'])) {
      resources.push(
        { title: 'Ultralytics YOLOv8', url: 'https://docs.ultralytics.com/', type: 'link', description: 'Documentacion de YOLOv8: deteccion, segmentacion y clasificacion en tiempo real' },
        { title: 'Computer Vision — Kaggle', url: 'https://www.kaggle.com/learn/computer-vision', type: 'link', description: 'Curso de deteccion de objetos y clasificacion de imagenes en Kaggle' },
        { title: 'Roboflow — Object Detection', url: 'https://roboflow.com/learn', type: 'tool', description: 'Plataforma para anotar, entrenar y desplegar modelos de deteccion de objetos' }
      );
    } else if (match(t, ['ocr', 'reconocimiento de caracteres', 'texto en imagen'])) {
      resources.push(
        { title: 'Tesseract OCR — Python', url: 'https://pypi.org/project/pytesseract/', type: 'link', description: 'Libreria Python para OCR: reconocimiento de texto en imagenes con Tesseract' },
        { title: 'EasyOCR — GitHub', url: 'https://github.com/JaidedAI/EasyOCR', type: 'tool', description: 'Libreria de OCR facil de usar con soporte para 80+ idiomas' },
        { title: 'Computer Vision — Kaggle', url: 'https://www.kaggle.com/learn/computer-vision', type: 'link', description: 'Curso de vision por computadora con aplicaciones de OCR' }
      );
    } else {
      resources.push(
        { title: 'Computer Vision — Kaggle', url: 'https://www.kaggle.com/learn/computer-vision', type: 'link', description: 'Curso practico de vision por computadora con CNNs y transfer learning' },
        { title: 'OpenCV Tutorials', url: 'https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html', type: 'link', description: 'Tutoriales oficiales de procesamiento de imagenes con OpenCV Python' },
        { title: 'DotCSV — Computer Vision', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Explicaciones en espanol de vision artificial y procesamiento de imagenes' }
      );
    }
    return resources;
  }

  // ---- STATISTICS / MATH ----
  if (match(t, ['estadistic', 'probabilidad', 'distribucion', 'correlacion', 'hipotesis', 'test de', 'regresion', 'muestreo', 'bootstrap', 'intervalo de confianza', 'bayesian', 'bayes', 'combinatoria', 'permutacion', 'variable aleatoria']) || match(s, ['matematicas'])) {
    if (match(t, ['probabilidad', 'probability', 'bayes', 'bayesian'])) {
      resources.push(
        { title: 'Probabilidad — Khan Academy (Espanol)', url: 'https://es.khanacademy.org/math/statistics-probability', type: 'link', description: 'Curso de probabilidad en espanol con videos y ejercicios interactivos' },
        { title: 'Seeing Theory — Visualizacion de Probabilidad', url: 'https://seeing-theory.brown.edu/es.html', type: 'tool', description: 'Visualizaciones interactivas de probabilidad de Brown University' },
        { title: 'SciPy Stats — Distribuciones', url: 'https://docs.scipy.org/doc/scipy/reference/stats.html', type: 'link', description: 'Implementacion de distribuciones y tests estadisticos en Python con SciPy' }
      );
    } else if (match(t, ['distribucion', 'normal', 'poisson', 'binomial'])) {
      resources.push(
        { title: 'Distribuciones — Khan Academy (Espanol)', url: 'https://es.khanacademy.org/math/statistics-probability', type: 'link', description: 'Curso de distribuciones de probabilidad en espanol con ejemplos' },
        { title: 'SciPy Stats — Distribuciones', url: 'https://docs.scipy.org/doc/scipy/reference/stats.html', type: 'link', description: 'Todas las distribuciones de probabilidad implementadas en SciPy' },
        { title: 'Seeing Theory — Distribuciones', url: 'https://seeing-theory.brown.edu/es.html', type: 'tool', description: 'Visualizacion interactiva de distribuciones de probabilidad' }
      );
    } else if (match(t, ['hipotesis', 'test', 'p-value', 'significancia'])) {
      resources.push(
        { title: 'Tests de Hipotesis — Khan Academy', url: 'https://es.khanacademy.org/math/statistics-probability', type: 'link', description: 'Curso de tests de hipotesis, p-values e intervalos de confianza en espanol' },
        { title: 'SciPy Stats — Statistical Tests', url: 'https://docs.scipy.org/doc/scipy/reference/stats.html', type: 'link', description: 'Tests estadisticos en Python: t-test, chi-square, ANOVA y mas con SciPy' },
        { title: 'StatQuest — Hypothesis Testing', url: 'https://www.youtube.com/watch?v=0oc49DyA3hU', type: 'video', description: 'Explicacion visual de tests de hipotesis y p-values por StatQuest' }
      );
    } else if (match(t, ['correlacion', 'regresion'])) {
      resources.push(
        { title: 'Correlacion y Regresion — Khan Academy', url: 'https://es.khanacademy.org/math/statistics-probability', type: 'link', description: 'Curso de correlacion, regresion y analisis de relaciones entre variables' },
        { title: 'NumPy — Correlacion', url: 'https://numpy.org/doc/stable/reference/generated/numpy.corrcoef.html', type: 'link', description: 'Calculo de coeficientes de correlacion con NumPy y Python' },
        { title: 'StatQuest — Linear Regression', url: 'https://www.youtube.com/watch?v=nk2CQITm_eo', type: 'video', description: 'Explicacion visual de regresion lineal y correlacion por StatQuest' }
      );
    } else if (match(t, ['muestreo', 'bootstrap', 'remuestreo', 'sampling'])) {
      resources.push(
        { title: 'Muestreo — Khan Academy', url: 'https://es.khanacademy.org/math/statistics-probability/designing-studies', type: 'link', description: 'Tipos de muestreo, sesgos, diseno de estudios y errores comunes' },
        { title: 'SciPy Stats — Bootstrap', url: 'https://docs.scipy.org/doc/scipy/reference/stats.html', type: 'link', description: 'Implementacion de bootstrap y remuestreo estadistico con SciPy' },
        { title: 'NumPy Random — Muestreo', url: 'https://numpy.org/doc/stable/reference/random/index.html', type: 'link', description: 'Generacion de muestras aleatorias y simulaciones con NumPy random' }
      );
    } else {
      resources.push(
        { title: 'Estadistica — Khan Academy (Espanol)', url: 'https://es.khanacademy.org/math/statistics-probability', type: 'link', description: 'Curso completo de estadistica y probabilidad en espanol con ejercicios' },
        { title: 'SciPy Stats Documentation', url: 'https://docs.scipy.org/doc/scipy/reference/stats.html', type: 'link', description: 'Referencia de estadistica en Python: tests, distribuciones y funciones' },
        { title: 'Datos del INEC Ecuador', url: 'https://www.ecuadorencifras.gob.ec/estadisticas/', type: 'dataset', description: 'Datos estadisticos oficiales de Ecuador para ejercicios con datos reales' }
      );
    }
    return resources;
  }

  // ---- LINEAR ALGEBRA ----
  if (match(t, ['algebra lineal', 'vectores', 'matrices', 'determinante', 'inversa', 'autovalor', 'eigenvalue', 'transformacion lineal', 'espacio vectorial', 'sistema de ecuaciones']) || match(s, ['algebra lineal'])) {
    if (match(t, ['vectores', 'vector'])) {
      resources.push(
        { title: 'Algebra Lineal — Khan Academy', url: 'https://es.khanacademy.org/math/linear-algebra', type: 'link', description: 'Curso de vectores, operaciones y geometria vectorial en espanol' },
        { title: 'Essence of Linear Algebra — 3Blue1Brown', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', type: 'video', description: 'Serie visual sobre vectores y transformaciones lineales por 3Blue1Brown' },
        { title: 'NumPy — Linear Algebra', url: 'https://numpy.org/doc/stable/reference/routines.linalg.html', type: 'link', description: 'Operaciones de algebra lineal con NumPy: vectores, productos y normas' }
      );
    } else if (match(t, ['matrices', 'matriz', 'determinante', 'inversa', 'transpuesta'])) {
      resources.push(
        { title: 'Matrices — Khan Academy', url: 'https://es.khanacademy.org/math/linear-algebra', type: 'link', description: 'Curso de matrices: suma, producto, determinantes e inversas en espanol' },
        { title: '3Blue1Brown — Matrices', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', type: 'video', description: 'Visualizacion de transformaciones matriciales y su significado geometrico' },
        { title: 'NumPy — Matrices', url: 'https://numpy.org/doc/stable/reference/routines.linalg.html', type: 'link', description: 'Operaciones matriciales con NumPy: determinantes, inversas, descomposiciones' }
      );
    } else if (match(t, ['autovalor', 'eigenvalue', 'eigenvector', 'descomposicion'])) {
      resources.push(
        { title: 'Eigenvalues — Khan Academy', url: 'https://es.khanacademy.org/math/linear-algebra', type: 'link', description: 'Autovalores y autovectores explicados en espanol con ejercicios' },
        { title: '3Blue1Brown — Eigenvalues', url: 'https://www.youtube.com/watch?v=PFDu9oVAE-g', type: 'video', description: 'Explicacion visual de autovalores y su significado geometrico' },
        { title: 'NumPy — Eigenvalues', url: 'https://numpy.org/doc/stable/reference/generated/numpy.linalg.eig.html', type: 'link', description: 'Calculo de autovalores y autovectores con numpy.linalg' }
      );
    } else {
      resources.push(
        { title: 'Algebra Lineal — Khan Academy', url: 'https://es.khanacademy.org/math/linear-algebra', type: 'link', description: 'Curso completo de algebra lineal en espanol con videos y ejercicios' },
        { title: 'Essence of Linear Algebra — 3Blue1Brown', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', type: 'video', description: 'Serie visual sobre algebra lineal: vectores, matrices, transformaciones' },
        { title: 'NumPy Linear Algebra', url: 'https://numpy.org/doc/stable/reference/routines.linalg.html', type: 'link', description: 'Referencia de algebra lineal con NumPy para operaciones matriciales' }
      );
    }
    return resources;
  }

  // ---- LOGIC / ALGORITHMS / DATA STRUCTURES ----
  if (match(t, ['logica', 'proposicion', 'conector logico', 'tabla de verdad', 'algoritmo', 'complejidad', 'big o', 'recursion', 'busqueda', 'ordenamiento', 'sort', 'search', 'grafo', 'graph', 'arbol', 'tree', 'heap', 'hash', 'pila', 'cola', 'queue', 'stack', 'lista enlazada', 'linked list', 'dijkstra', 'bfs', 'dfs']) || match(s, ['estructuras de datos', 'logica computacional'])) {
    if (match(t, ['logica', 'proposicion', 'conector', 'tabla de verdad'])) {
      resources.push(
        { title: 'Logica Proposicional — Khan Academy', url: 'https://es.khanacademy.org/computing/computer-science/algorithms', type: 'link', description: 'Fundamentos de logica computacional: proposiciones, conectores y tablas de verdad' },
        { title: 'Logic Gates — Interactive', url: 'https://logic.ly/', type: 'tool', description: 'Simulador interactivo de compuertas logicas y circuitos digitales' },
        { title: 'Python — Operadores logicos', url: 'https://realpython.com/python-operators-expressions/', type: 'link', description: 'Operadores logicos en Python: and, or, not y su relacion con la logica formal' }
      );
    } else if (match(t, ['grafo', 'graph', 'dijkstra', 'bfs', 'dfs'])) {
      resources.push(
        { title: 'Grafos — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/', type: 'link', description: 'Tutorial de grafos: representacion, BFS, DFS, Dijkstra y aplicaciones' },
        { title: 'Grafos — Visualgo', url: 'https://visualgo.net/en/graphds', type: 'tool', description: 'Visualizacion interactiva de grafos y algoritmos de recorrido' },
        { title: 'Algorithms — Khan Academy', url: 'https://es.khanacademy.org/computing/computer-science/algorithms', type: 'link', description: 'Curso de algoritmos de grafos con visualizaciones en espanol' }
      );
    } else if (match(t, ['arbol', 'tree', 'binary', 'binario'])) {
      resources.push(
        { title: 'Arboles Binarios — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/binary-tree-data-structure/', type: 'link', description: 'Tutorial de arboles binarios: recorridos, BST, balanceo y aplicaciones' },
        { title: 'Tree Visualizer — Visualgo', url: 'https://visualgo.net/en/bst', type: 'tool', description: 'Visualizacion interactiva de arboles binarios de busqueda' },
        { title: 'Algorithms — Khan Academy', url: 'https://es.khanacademy.org/computing/computer-science/algorithms', type: 'link', description: 'Curso de arboles y estructuras jerarquicas en espanol' }
      );
    } else if (match(t, ['heap', 'priority queue', 'cola de prioridad'])) {
      resources.push(
        { title: 'Heap — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/heap-data-structure/', type: 'link', description: 'Tutorial de heaps: min-heap, max-heap, heapify y priority queues' },
        { title: 'Heap — Visualgo', url: 'https://visualgo.net/en/heap', type: 'tool', description: 'Visualizacion interactiva de heaps y operaciones de insercion/extraccion' },
        { title: 'Python heapq — Real Python', url: 'https://realpython.com/python-heapq-module/', type: 'link', description: 'Modulo heapq de Python: priority queues y algoritmos con heaps' }
      );
    } else if (match(t, ['hash', 'diccionario', 'tabla hash'])) {
      resources.push(
        { title: 'Hash Tables — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/hashing-data-structure/', type: 'link', description: 'Tutorial de tablas hash: funciones hash, colisiones y implementacion' },
        { title: 'Hash Table — Visualgo', url: 'https://visualgo.net/en/hashtable', type: 'tool', description: 'Visualizacion interactiva de tablas hash y resolucion de colisiones' },
        { title: 'Dictionaries — Real Python', url: 'https://realpython.com/python-dicts/', type: 'link', description: 'Diccionarios en Python: implementacion, operaciones y patrones de uso' }
      );
    } else if (match(t, ['pila', 'stack', 'cola', 'queue', 'lista enlazada', 'linked list'])) {
      resources.push(
        { title: 'Pilas y Colas — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/stack-data-structure/', type: 'link', description: 'Tutorial de pilas y colas: implementacion, operaciones y aplicaciones' },
        { title: 'Linked List — Visualgo', url: 'https://visualgo.net/en/list', type: 'tool', description: 'Visualizacion interactiva de listas enlazadas y sus operaciones' },
        { title: 'Data Structures — Khan Academy', url: 'https://es.khanacademy.org/computing/computer-science/algorithms', type: 'link', description: 'Curso de estructuras de datos fundamentales en espanol' }
      );
    } else if (match(t, ['ordenamiento', 'sort', 'bubble', 'merge sort', 'quick sort'])) {
      resources.push(
        { title: 'Sorting — Visualgo', url: 'https://visualgo.net/en/sorting', type: 'tool', description: 'Visualizacion interactiva de algoritmos de ordenamiento paso a paso' },
        { title: 'Sorting — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/sorting-algorithms/', type: 'link', description: 'Tutorial de algoritmos de ordenamiento: Bubble, Merge, Quick, Heap Sort' },
        { title: 'Algorithms — Khan Academy', url: 'https://es.khanacademy.org/computing/computer-science/algorithms', type: 'link', description: 'Curso de algoritmos de ordenamiento en espanol con visualizaciones' }
      );
    } else if (match(t, ['busqueda', 'search', 'binary search'])) {
      resources.push(
        { title: 'Binary Search — Khan Academy', url: 'https://es.khanacademy.org/computing/computer-science/algorithms', type: 'link', description: 'Tutorial de busqueda binaria y algoritmos de busqueda en espanol' },
        { title: 'Search — Visualgo', url: 'https://visualgo.net/en/sorting', type: 'tool', description: 'Visualizacion interactiva de algoritmos de busqueda' },
        { title: 'Searching — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/searching-algorithms/', type: 'link', description: 'Tutorial de algoritmos de busqueda: lineal, binaria y hash' }
      );
    } else if (match(t, ['complejidad', 'big o', 'notacion', 'tiempo', 'espacio'])) {
      resources.push(
        { title: 'Big O — Khan Academy', url: 'https://es.khanacademy.org/computing/computer-science/algorithms', type: 'link', description: 'Curso de analisis de complejidad algoritmica: Big O, tiempo y espacio' },
        { title: 'Big-O Cheat Sheet', url: 'https://www.bigocheatsheet.com/', type: 'tool', description: 'Referencia rapida de complejidad de algoritmos y estructuras de datos' },
        { title: 'Algorithms — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/fundamentals-of-algorithms/', type: 'link', description: 'Fundamentos de algoritmos: analisis, diseno y complejidad' }
      );
    } else if (match(t, ['recursion', 'recursivo'])) {
      resources.push(
        { title: 'Recursion — Khan Academy', url: 'https://es.khanacademy.org/computing/computer-science/algorithms', type: 'link', description: 'Curso de recursion y divide-and-conquer con ejercicios' },
        { title: 'Recursion — Real Python', url: 'https://realpython.com/python-recursion/', type: 'link', description: 'Tutorial de recursion en Python: casos base, pila de llamadas y optimizacion' },
        { title: 'Recursion — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/introduction-to-recursion-data-structure-and-algorithm-tutorials/', type: 'link', description: 'Fundamentos de recursion con ejemplos clasicos y analisis de complejidad' }
      );
    } else {
      resources.push(
        { title: 'Algorithms — Khan Academy (Espanol)', url: 'https://es.khanacademy.org/computing/computer-science/algorithms', type: 'link', description: 'Curso de algoritmos y estructuras de datos en espanol' },
        { title: 'Visualgo — Visualizacion', url: 'https://visualgo.net/', type: 'tool', description: 'Herramienta visual interactiva para entender algoritmos y estructuras de datos' },
        { title: 'Data Structures — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/data-structures/', type: 'link', description: 'Tutorial completo de estructuras de datos con implementaciones en Python' }
      );
    }
    return resources;
  }

  // ---- CLOUD / AWS / GCP / AZURE ----
  if (match(t, ['cloud', 'aws', 'amazon', 'gcp', 'google cloud', 'azure', 'iaas', 'paas', 'saas', 's3', 'ec2', 'lambda', 'bigquery', 'firebase', 'supabase', 'sagemaker', 'colab', 'docker', 'kubernetes', 'contenedor', 'container', 'serverless', 'data lake']) || match(s, ['cloud computing'])) {
    if (match(t, ['aws', 'amazon', 's3', 'ec2', 'lambda', 'sagemaker'])) {
      resources.push(
        { title: 'AWS Free Tier', url: 'https://aws.amazon.com/free/', type: 'link', description: '12 meses gratis de servicios AWS: EC2, S3, Lambda, RDS y mas' },
        { title: 'AWS Skill Builder', url: 'https://skillbuilder.aws/', type: 'link', description: 'Cursos gratuitos oficiales de AWS: cloud practitioner, solutions architect' },
        { title: 'AWS Documentation', url: 'https://docs.aws.amazon.com/', type: 'link', description: 'Documentacion oficial de AWS con tutoriales y guias de inicio rapido' }
      );
    } else if (match(t, ['gcp', 'google cloud', 'bigquery'])) {
      resources.push(
        { title: 'Google Cloud Free Credits', url: 'https://cloud.google.com/free', type: 'link', description: '$300 en creditos gratuitos de Google Cloud para experimentar' },
        { title: 'BigQuery — SQL para Big Data', url: 'https://cloud.google.com/bigquery/docs', type: 'link', description: 'Documentacion de BigQuery: SQL a escala de petabytes, ML integrado' },
        { title: 'Google Cloud Skills Boost', url: 'https://www.cloudskillsboost.google/', type: 'link', description: 'Cursos y labs gratuitos de Google Cloud con credenciales' }
      );
    } else if (match(t, ['azure', 'microsoft'])) {
      resources.push(
        { title: 'Azure Free Account', url: 'https://azure.microsoft.com/free/', type: 'link', description: '$200 en creditos gratuitos de Azure y 25+ servicios gratis siempre' },
        { title: 'Azure AI Documentation', url: 'https://learn.microsoft.com/en-us/azure/ai-services/', type: 'link', description: 'Documentacion de servicios de IA en Azure: Vision, Language, OpenAI' },
        { title: 'Microsoft Learn', url: 'https://learn.microsoft.com/', type: 'link', description: 'Plataforma de aprendizaje gratuita de Microsoft con labs interactivos' }
      );
    } else if (match(t, ['docker', 'contenedor', 'container'])) {
      resources.push(
        { title: 'Docker Documentation', url: 'https://docs.docker.com/get-started/', type: 'link', description: 'Tutorial oficial de Docker: conceptos, Dockerfile, compose y redes' },
        { title: 'Docker Tutorial — W3Schools', url: 'https://www.w3schools.com/docker/', type: 'link', description: 'Tutorial interactivo de Docker con ejemplos paso a paso' },
        { title: 'Play with Docker', url: 'https://labs.play-with-docker.com/', type: 'tool', description: 'Laboratorio gratuito de Docker en el navegador sin instalacion' }
      );
    } else if (match(t, ['kubernetes', 'k8s', 'orquestacion'])) {
      resources.push(
        { title: 'Kubernetes Documentation', url: 'https://kubernetes.io/docs/tutorials/', type: 'link', description: 'Tutoriales oficiales de Kubernetes: pods, services, deployments' },
        { title: 'Play with Kubernetes', url: 'https://labs.play-with-k8s.com/', type: 'tool', description: 'Laboratorio gratuito de Kubernetes en el navegador' },
        { title: 'Kubernetes Course — freeCodeCamp', url: 'https://www.freecodecamp.org/espanol/', type: 'link', description: 'Curso gratuito de Kubernetes y orquestacion de contenedores' }
      );
    } else if (match(t, ['colab', 'google colab', 'jupyter', 'notebook'])) {
      resources.push(
        { title: 'Google Colab', url: 'https://colab.research.google.com/', type: 'tool', description: 'Notebooks en la nube con GPU gratuita para Python, ML y data science' },
        { title: 'Colab Welcome Notebook', url: 'https://colab.research.google.com/notebooks/intro.ipynb', type: 'link', description: 'Notebook introductorio oficial de Google Colab con ejemplos basicos' },
        { title: 'Jupyter Documentation', url: 'https://jupyter.org/documentation', type: 'link', description: 'Documentacion de Jupyter Notebooks: instalacion, uso y extensiones' }
      );
    } else if (match(t, ['firebase', 'supabase', 'backend'])) {
      resources.push(
        { title: 'Supabase Documentation', url: 'https://supabase.com/docs', type: 'link', description: 'Documentacion de Supabase: auth, database, storage, realtime y functions' },
        { title: 'Firebase Documentation', url: 'https://firebase.google.com/docs', type: 'link', description: 'Documentacion de Firebase: Firestore, Auth, Hosting y Cloud Functions' },
        { title: 'Supabase — YouTube', url: 'https://www.youtube.com/@Supabase', type: 'video', description: 'Canal oficial de Supabase con tutoriales y ejemplos de uso' }
      );
    } else if (match(t, ['data lake', 'almacenamiento', 'storage'])) {
      resources.push(
        { title: 'AWS S3 Documentation', url: 'https://docs.aws.amazon.com/s3/', type: 'link', description: 'Documentacion de Amazon S3: almacenamiento en la nube y data lakes' },
        { title: 'Google Cloud Storage', url: 'https://cloud.google.com/storage/docs', type: 'link', description: 'Documentacion de Cloud Storage para data lakes y almacenamiento de datos' },
        { title: 'Data Lake — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de arquitectura de data lakes y almacenamiento en la nube en espanol' }
      );
    } else if (match(t, ['serverless'])) {
      resources.push(
        { title: 'AWS Lambda Documentation', url: 'https://docs.aws.amazon.com/lambda/', type: 'link', description: 'Documentacion de AWS Lambda: funciones serverless con Python y Node.js' },
        { title: 'Serverless Framework', url: 'https://www.serverless.com/framework/docs', type: 'link', description: 'Framework para desarrollar y desplegar aplicaciones serverless' },
        { title: 'Google Cloud Functions', url: 'https://cloud.google.com/functions/docs', type: 'link', description: 'Documentacion de Cloud Functions para computacion sin servidor' }
      );
    } else {
      resources.push(
        { title: 'AWS Free Tier', url: 'https://aws.amazon.com/free/', type: 'link', description: '12 meses gratis de servicios AWS para practicar cloud computing' },
        { title: 'Google Cloud Free Credits', url: 'https://cloud.google.com/free', type: 'link', description: '$300 en creditos gratuitos para experimentar con Google Cloud' },
        { title: 'Cloud Computing — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Cursos de cloud computing en espanol con enfoque practico' }
      );
    }
    return resources;
  }

  // ---- BIG DATA / SPARK / HADOOP / KAFKA ----
  if (match(t, ['big data', 'spark', 'hadoop', 'kafka', 'hive', 'hdfs', 'mapreduce', 'pyspark', 'streaming', 'tiempo real', 'real-time', 'flink', 'dask', 'airflow', 'dag', 'orquestacion', 'etl', 'elt', 'pipeline', 'data engineering', 'procesamiento distribuido', 'batch', 'data warehouse', 'dwh', 'estrella', 'copo de nieve', 'dimensional', 'hechos', 'dimensiones', 'dbt']) || match(s, ['big data', 'data engineering', 'data warehouse', 'streaming', 'procesamiento'])) {
    if (match(t, ['spark', 'pyspark'])) {
      resources.push(
        { title: 'Apache Spark Documentation', url: 'https://spark.apache.org/docs/latest/', type: 'link', description: 'Documentacion oficial de Apache Spark: RDD, DataFrame, SQL y ML' },
        { title: 'PySpark Tutorial — Real Python', url: 'https://realpython.com/pyspark-intro/', type: 'link', description: 'Tutorial de PySpark: procesamiento distribuido de datos con Python' },
        { title: 'Databricks Community Edition', url: 'https://community.cloud.databricks.com/', type: 'tool', description: 'Plataforma gratuita para practicar Spark con notebooks interactivos' }
      );
    } else if (match(t, ['hadoop', 'hdfs', 'mapreduce', 'hive'])) {
      resources.push(
        { title: 'Apache Hadoop Documentation', url: 'https://hadoop.apache.org/docs/current/', type: 'link', description: 'Documentacion oficial de Hadoop: HDFS, MapReduce, YARN y ecosistema' },
        { title: 'Hadoop Tutorial — W3Schools', url: 'https://www.w3schools.com/hadoop/', type: 'link', description: 'Tutorial introductorio del ecosistema Hadoop con ejemplos' },
        { title: 'Big Data — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de Big Data y procesamiento distribuido en espanol' }
      );
    } else if (match(t, ['kafka', 'event', 'mensaje', 'message'])) {
      resources.push(
        { title: 'Apache Kafka Documentation', url: 'https://kafka.apache.org/documentation/', type: 'link', description: 'Documentacion oficial de Kafka: producers, consumers, topics y streams' },
        { title: 'Kafka Tutorial — Confluent', url: 'https://developer.confluent.io/get-started/', type: 'link', description: 'Tutorial interactivo de Kafka con codigo en Python y Java' },
        { title: 'Kafka — DotCSV', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Explicacion de streaming de datos y procesamiento en tiempo real' }
      );
    } else if (match(t, ['airflow', 'dag', 'orquestacion', 'workflow', 'luigi'])) {
      resources.push(
        { title: 'Apache Airflow Documentation', url: 'https://airflow.apache.org/docs/', type: 'link', description: 'Documentacion oficial de Airflow: DAGs, operators, hooks y scheduling' },
        { title: 'Airflow Tutorial', url: 'https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html', type: 'link', description: 'Tutorial paso a paso de Apache Airflow: primer DAG y buenas practicas' },
        { title: 'Data Engineering — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de Data Engineering con Airflow y pipelines en espanol' }
      );
    } else if (match(t, ['etl', 'elt', 'extract', 'transform', 'load'])) {
      resources.push(
        { title: 'ETL with Python — Real Python', url: 'https://realpython.com/', type: 'link', description: 'Tutoriales de ETL con Python: pandas, sqlalchemy y automatizacion de pipelines' },
        { title: 'dbt Documentation', url: 'https://docs.getdbt.com/', type: 'link', description: 'Documentacion de dbt: transformaciones de datos, testing y lineage' },
        { title: 'Data Engineering — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de pipelines de datos y ETL en espanol con proyectos reales' }
      );
    } else if (match(t, ['data warehouse', 'dwh', 'estrella', 'copo de nieve', 'dimensional', 'hechos', 'dimensiones', 'olap'])) {
      resources.push(
        { title: 'Data Warehousing — Kimball Group', url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/', type: 'link', description: 'Tecnicas de Kimball para modelado dimensional: estrella, copo de nieve y SCD' },
        { title: 'SQL para Analytics — Kaggle', url: 'https://www.kaggle.com/learn/advanced-sql', type: 'link', description: 'SQL avanzado para data warehousing y analytics con BigQuery' },
        { title: 'Data Warehouse — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de data warehousing y modelado dimensional en espanol' }
      );
    } else if (match(t, ['dask', 'parallel', 'paralelo'])) {
      resources.push(
        { title: 'Dask Documentation', url: 'https://docs.dask.org/', type: 'link', description: 'Documentacion de Dask: parallel computing con DataFrames gigantes en Python' },
        { title: 'Dask Tutorial', url: 'https://tutorial.dask.org/', type: 'link', description: 'Tutorial interactivo de Dask: procesamiento paralelo con API similar a Pandas' },
        { title: 'Dask — Real Python', url: 'https://realpython.com/', type: 'link', description: 'Tutorial de computacion paralela con Dask para datos que no caben en memoria' }
      );
    } else if (match(t, ['flink', 'stream processing'])) {
      resources.push(
        { title: 'Apache Flink Documentation', url: 'https://flink.apache.org/docs/stable/', type: 'link', description: 'Documentacion de Flink: procesamiento de streams y batch unificado' },
        { title: 'Flink Tutorial', url: 'https://nightlies.apache.org/flink/flink-docs-stable/docs/try-flink/local_installation/', type: 'link', description: 'Tutorial de inicio rapido con Apache Flink para streaming de datos' },
        { title: 'Streaming — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de procesamiento de datos en tiempo real en espanol' }
      );
    } else if (match(t, ['dbt', 'transform'])) {
      resources.push(
        { title: 'dbt Documentation', url: 'https://docs.getdbt.com/', type: 'link', description: 'Documentacion de dbt: modelos, tests, macros y deployment' },
        { title: 'dbt Learn', url: 'https://courses.getdbt.com/', type: 'link', description: 'Cursos gratuitos oficiales de dbt: fundamentals y advanced' },
        { title: 'Analytics Engineering — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de analytics engineering y transformacion de datos en espanol' }
      );
    } else if (match(t, ['schema evolution', 'schema', 'avro', 'parquet'])) {
      resources.push(
        { title: 'Apache Avro Documentation', url: 'https://avro.apache.org/docs/current/', type: 'link', description: 'Documentacion de Avro: serializacion de datos y evolucion de schemas' },
        { title: 'Apache Parquet', url: 'https://parquet.apache.org/documentation/latest/', type: 'link', description: 'Formato columnar Parquet: almacenamiento eficiente para analytics' },
        { title: 'Data Engineering — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de formatos de datos y schemas en pipelines de datos' }
      );
    } else {
      resources.push(
        { title: 'Apache Spark Documentation', url: 'https://spark.apache.org/docs/latest/', type: 'link', description: 'Documentacion de Spark para procesamiento de big data distribuido' },
        { title: 'Big Data — Kaggle', url: 'https://www.kaggle.com/learn/advanced-sql', type: 'link', description: 'SQL avanzado para big data y analytics con BigQuery en Kaggle' },
        { title: 'Data Engineering — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Cursos de big data y data engineering en espanol con proyectos' }
      );
    }
    return resources;
  }

  // ---- EDA / DATA ANALYSIS ----
  if (match(t, ['eda', 'analisis exploratorio', 'exploratorio', 'descriptiva', 'outlier', 'missing', 'datos faltantes', 'limpieza', 'cleaning', 'data quality', 'calidad de datos']) || match(s, ['analisis exploratorio'])) {
    if (match(t, ['outlier', 'anomalia', 'atipico'])) {
      resources.push(
        { title: 'Outlier Detection — Scikit-learn', url: 'https://scikit-learn.org/stable/modules/outlier_detection.html', type: 'link', description: 'Metodos de deteccion de outliers: IQR, Isolation Forest, LOF' },
        { title: 'Data Cleaning — Kaggle', url: 'https://www.kaggle.com/learn/data-cleaning', type: 'link', description: 'Curso de limpieza de datos en Kaggle: outliers, missing values, inconsistencias' },
        { title: 'Datos del INEC Ecuador', url: 'https://www.ecuadorencifras.gob.ec/estadisticas/', type: 'dataset', description: 'Datos estadisticos de Ecuador para practicar deteccion de outliers' }
      );
    } else if (match(t, ['missing', 'faltantes', 'nulo', 'nan', 'imputacion'])) {
      resources.push(
        { title: 'Data Cleaning — Kaggle', url: 'https://www.kaggle.com/learn/data-cleaning', type: 'link', description: 'Curso de tratamiento de valores faltantes, escalado y encoding' },
        { title: 'Handling Missing Data — Real Python', url: 'https://realpython.com/python-data-cleaning-numpy-pandas/', type: 'link', description: 'Guia de limpieza de datos con Pandas: fillna, dropna, interpolacion' },
        { title: 'Datos del INEC Ecuador', url: 'https://www.ecuadorencifras.gob.ec/estadisticas/', type: 'dataset', description: 'Datos reales de Ecuador para practicar tratamiento de missing values' }
      );
    } else {
      resources.push(
        { title: 'Data Cleaning — Kaggle', url: 'https://www.kaggle.com/learn/data-cleaning', type: 'link', description: 'Curso de limpieza y analisis exploratorio de datos en Kaggle' },
        { title: 'EDA con Python — Real Python', url: 'https://realpython.com/python-data-cleaning-numpy-pandas/', type: 'link', description: 'Guia de analisis exploratorio con Pandas, Matplotlib y Seaborn' },
        { title: 'Datos del INEC Ecuador', url: 'https://www.ecuadorencifras.gob.ec/estadisticas/', type: 'dataset', description: 'Datos estadisticos oficiales de Ecuador para analisis exploratorio real' }
      );
    }
    return resources;
  }

  // ---- MLOPS / DEPLOYMENT ----
  if (match(t, ['mlops', 'deploy', 'despliegue', 'fastapi', 'flask', 'api', 'servir modelo', 'serializ', 'pickle', 'mlflow', 'dvc', 'ci/cd', 'monitoreo', 'monitoring', 'docker', 'contenedor']) || match(s, ['mlops'])) {
    if (match(t, ['fastapi', 'api', 'servir'])) {
      resources.push(
        { title: 'FastAPI Documentation', url: 'https://fastapi.tiangolo.com/', type: 'link', description: 'Documentacion oficial de FastAPI: APIs rapidas con Python y documentacion automatica' },
        { title: 'FastAPI Tutorial — Real Python', url: 'https://realpython.com/fastapi-python-web-apis/', type: 'link', description: 'Tutorial de FastAPI para crear APIs de ML con validacion y documentacion' },
        { title: 'Platzi — FastAPI', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de creacion de APIs profesionales con FastAPI en espanol' }
      );
    } else if (match(t, ['mlflow', 'tracking', 'experiment'])) {
      resources.push(
        { title: 'MLflow Documentation', url: 'https://mlflow.org/docs/latest/index.html', type: 'link', description: 'Documentacion de MLflow: tracking, projects, models y registry' },
        { title: 'MLflow Tutorial', url: 'https://mlflow.org/docs/latest/getting-started/intro-quickstart/', type: 'link', description: 'Tutorial de inicio rapido con MLflow para tracking de experimentos' },
        { title: 'MLOps — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de MLOps y ciclo de vida de modelos en espanol' }
      );
    } else if (match(t, ['dvc', 'versionado', 'versioning'])) {
      resources.push(
        { title: 'DVC Documentation', url: 'https://dvc.org/doc', type: 'link', description: 'Documentacion de DVC: versionado de datos, pipelines y experimentos' },
        { title: 'DVC Tutorial', url: 'https://dvc.org/doc/start', type: 'link', description: 'Tutorial de inicio con DVC: primer proyecto de versionado de datos' },
        { title: 'Git para ML — Real Python', url: 'https://realpython.com/', type: 'link', description: 'Guia de versionado de codigo y datos para proyectos de ML' }
      );
    } else if (match(t, ['ci/cd', 'github actions', 'continuous', 'integracion continua'])) {
      resources.push(
        { title: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions', type: 'link', description: 'Documentacion de GitHub Actions: CI/CD para proyectos de ML' },
        { title: 'CI/CD for ML — MLOps', url: 'https://ml-ops.org/', type: 'link', description: 'Guia de mejores practicas de CI/CD para Machine Learning' },
        { title: 'MLOps — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de MLOps y automatizacion de pipelines en espanol' }
      );
    } else if (match(t, ['ciclo de vida', 'lifecycle'])) {
      resources.push(
        { title: 'ML-Ops.org', url: 'https://ml-ops.org/', type: 'link', description: 'Guia completa de MLOps: ciclo de vida de modelos ML en produccion' },
        { title: 'MLflow Documentation', url: 'https://mlflow.org/docs/latest/index.html', type: 'link', description: 'Gestion del ciclo de vida de ML con MLflow: desarrollo a produccion' },
        { title: 'DotCSV — MLOps', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Explicaciones en espanol sobre MLOps y deployment de modelos' }
      );
    } else {
      resources.push(
        { title: 'ML-Ops.org', url: 'https://ml-ops.org/', type: 'link', description: 'Guia de referencia de MLOps: mejores practicas para ML en produccion' },
        { title: 'MLflow Documentation', url: 'https://mlflow.org/docs/latest/index.html', type: 'link', description: 'Plataforma open source para gestion del ciclo de vida de ML' },
        { title: 'MLOps — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de MLOps y despliegue de modelos en espanol' }
      );
    }
    return resources;
  }

  // ---- GIT / GITHUB ----
  if (match(t, ['git', 'github', 'versionamiento', 'version control', 'repositorio', 'branch', 'pull request', 'commit'])) {
    resources.push(
      { title: 'Git Tutorial — W3Schools', url: 'https://www.w3schools.com/git/', type: 'link', description: 'Tutorial interactivo de Git: commits, branches, merge y workflows' },
      { title: 'GitHub Docs', url: 'https://docs.github.com/', type: 'link', description: 'Documentacion oficial de GitHub: repositorios, PRs, Actions e Issues' },
      { title: 'Git — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de Git y GitHub en espanol con ejercicios practicos' }
    );
    return resources;
  }

  // ---- ROBOTICS / IOT ----
  if (match(t, ['robotica', 'robot', 'arduino', 'raspberry', 'sensor', 'iot', 'embebido', 'embedded', 'navegacion autonoma', 'ros']) || match(s, ['robotica'])) {
    if (match(t, ['arduino', 'sensor'])) {
      resources.push(
        { title: 'Arduino Documentation', url: 'https://docs.arduino.cc/', type: 'link', description: 'Documentacion oficial de Arduino: tutoriales, referencia y proyectos' },
        { title: 'Arduino Project Hub', url: 'https://projecthub.arduino.cc/', type: 'link', description: 'Proyectos de la comunidad Arduino con instrucciones paso a paso' },
        { title: 'Tinkercad Circuits', url: 'https://www.tinkercad.com/circuits', type: 'tool', description: 'Simulador online gratuito de Arduino y circuitos electronicos' }
      );
    } else if (match(t, ['raspberry', 'pi'])) {
      resources.push(
        { title: 'Raspberry Pi Documentation', url: 'https://www.raspberrypi.com/documentation/', type: 'link', description: 'Documentacion oficial de Raspberry Pi: setup, GPIO, proyectos de IA' },
        { title: 'Raspberry Pi Projects', url: 'https://projects.raspberrypi.org/', type: 'link', description: 'Proyectos paso a paso con Raspberry Pi para principiantes y avanzados' },
        { title: 'Edge AI — TensorFlow Lite', url: 'https://www.tensorflow.org/lite', type: 'link', description: 'TensorFlow Lite para ejecutar modelos de IA en dispositivos embebidos' }
      );
    } else {
      resources.push(
        { title: 'Arduino Documentation', url: 'https://docs.arduino.cc/', type: 'link', description: 'Documentacion y tutoriales de Arduino para robotica e IoT' },
        { title: 'TensorFlow Lite', url: 'https://www.tensorflow.org/lite', type: 'link', description: 'ML en dispositivos embebidos con TensorFlow Lite' },
        { title: 'ROS.org — Robot Operating System', url: 'https://www.ros.org/', type: 'link', description: 'Framework open source para desarrollo de software robotico' }
      );
    }
    return resources;
  }

  // ---- ETHICS / PRIVACY / GOVERNANCE ----
  if (match(t, ['etica', 'sesgo', 'bias', 'fairness', 'fake news', 'desinformacion', 'propiedad intelectual', 'privacidad', 'gdpr', 'lopdp', 'consentimiento', 'transparencia', 'responsab', 'gobernanza', 'gobierno de datos', 'data governance', 'catalogo', 'compliance', 'regulacion', 'marco legal']) || match(s, ['etica', 'gobierno de datos', 'gobernanza'])) {
    if (match(t, ['sesgo', 'bias', 'fairness'])) {
      resources.push(
        { title: 'AI Fairness 360 — IBM', url: 'https://aif360.mybluemix.net/', type: 'tool', description: 'Toolkit de IBM para detectar y mitigar sesgo en modelos de ML' },
        { title: 'Google AI — Responsible AI', url: 'https://ai.google/responsibility/responsible-ai-practices/', type: 'link', description: 'Practicas de IA responsable de Google: fairness, interpretabilidad y seguridad' },
        { title: 'DotCSV — Sesgo en IA', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Explicacion en espanol sobre sesgo algoritmico y sus consecuencias' }
      );
    } else if (match(t, ['privacidad', 'gdpr', 'lopdp', 'datos personales', 'consentimiento'])) {
      resources.push(
        { title: 'LOPDP Ecuador — Texto completo', url: 'https://www.telecomunicaciones.gob.ec/', type: 'link', description: 'Ley Organica de Proteccion de Datos Personales del Ecuador' },
        { title: 'Google AI — Privacy', url: 'https://ai.google/responsibility/responsible-ai-practices/', type: 'link', description: 'Practicas de privacidad y proteccion de datos en sistemas de IA' },
        { title: 'Differential Privacy — OpenDP', url: 'https://opendp.org/', type: 'link', description: 'Framework de privacidad diferencial para analisis de datos responsable' }
      );
    } else if (match(t, ['gobierno de datos', 'data governance', 'catalogo', 'linaje', 'lineage', 'data quality'])) {
      resources.push(
        { title: 'DAMA-DMBOK Framework', url: 'https://www.dama.org/', type: 'link', description: 'Marco de referencia DAMA para gobierno y gestion de datos' },
        { title: 'Great Expectations', url: 'https://greatexpectations.io/', type: 'tool', description: 'Framework de data quality: validacion, profiling y documentacion de datos' },
        { title: 'Data Governance — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de gobierno de datos y compliance en espanol' }
      );
    } else if (match(t, ['fake news', 'desinformacion'])) {
      resources.push(
        { title: 'AI and Misinformation — MIT', url: 'https://www.media.mit.edu/', type: 'link', description: 'Investigacion del MIT Media Lab sobre IA, desinformacion y deteccion de fake news' },
        { title: 'Google AI — Responsible AI', url: 'https://ai.google/responsibility/responsible-ai-practices/', type: 'link', description: 'Principios de IA responsable aplicados a la generacion de contenido' },
        { title: 'DotCSV — Deepfakes y Fake News', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Explicacion en espanol de deepfakes, fake news y su impacto social' }
      );
    } else if (match(t, ['propiedad intelectual', 'copyright', 'licencia'])) {
      resources.push(
        { title: 'Creative Commons', url: 'https://creativecommons.org/', type: 'link', description: 'Licencias Creative Commons para compartir contenido digital legalmente' },
        { title: 'GitHub — Licensing Guide', url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository', type: 'link', description: 'Guia de licencias de software: MIT, Apache, GPL y su uso correcto' },
        { title: 'WIPO — Propiedad Intelectual', url: 'https://www.wipo.int/portal/es/', type: 'link', description: 'Organizacion Mundial de la Propiedad Intelectual: recursos y regulaciones' }
      );
    } else {
      resources.push(
        { title: 'Google AI — Responsible AI Practices', url: 'https://ai.google/responsibility/responsible-ai-practices/', type: 'link', description: 'Principios y practicas de IA responsable de Google' },
        { title: 'AI Ethics — MIT', url: 'https://www.media.mit.edu/', type: 'link', description: 'Investigacion del MIT sobre etica en inteligencia artificial' },
        { title: 'DotCSV — Etica en IA', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Explicaciones en espanol sobre etica, sesgo y responsabilidad en IA' }
      );
    }
    return resources;
  }

  // ---- ENGLISH / INGLES TECNICO ----
  if (match(t, ['ingles', 'english', 'vocabulario', 'technical writing', 'reading', 'paper', 'abstract', 'email', 'slack', 'presentacion', 'docstring', 'readme', 'documentation en ingles']) || match(s, ['ingles tecnico'])) {
    if (match(t, ['vocabulario', 'terminos', 'terms'])) {
      resources.push(
        { title: 'AI/ML Glossary — Google', url: 'https://developers.google.com/machine-learning/glossary', type: 'link', description: 'Glosario oficial de Google de terminos de Machine Learning e IA' },
        { title: 'MDN Web Docs — Glossary', url: 'https://developer.mozilla.org/en-US/docs/Glossary', type: 'link', description: 'Glosario de terminologia web y programacion en ingles' },
        { title: 'Cambridge Dictionary — Tech', url: 'https://dictionary.cambridge.org/', type: 'tool', description: 'Diccionario Cambridge para pronunciacion y definicion de terminos tecnicos' }
      );
    } else if (match(t, ['paper', 'abstract', 'research', 'investigacion'])) {
      resources.push(
        { title: 'ArXiv — AI Papers', url: 'https://arxiv.org/list/cs.AI/recent', type: 'link', description: 'Papers de IA recientes en ArXiv para practicar lectura tecnica en ingles' },
        { title: 'Papers With Code', url: 'https://paperswithcode.com/', type: 'link', description: 'Papers de ML con codigo: leer, entender y reproducir investigaciones' },
        { title: 'Google Scholar', url: 'https://scholar.google.com/', type: 'tool', description: 'Buscador academico para encontrar papers y citas en ingles' }
      );
    } else if (match(t, ['technical writing', 'writing', 'escrit', 'documentacion'])) {
      resources.push(
        { title: 'Google Technical Writing Course', url: 'https://developers.google.com/tech-writing', type: 'link', description: 'Curso gratuito de Google sobre escritura tecnica: claridad, estructura y estilo' },
        { title: 'MDN Writing Guide', url: 'https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines', type: 'link', description: 'Guia de escritura tecnica de MDN: mejores practicas para documentacion' },
        { title: 'Grammarly', url: 'https://www.grammarly.com/', type: 'tool', description: 'Herramienta de correccion gramatical para mejorar escritura en ingles' }
      );
    } else if (match(t, ['email', 'slack', 'comunicacion', 'communication'])) {
      resources.push(
        { title: 'Business English — Cambridge', url: 'https://www.cambridgeenglish.org/learning-english/free-resources/', type: 'link', description: 'Recursos gratuitos de Cambridge para ingles de negocios y comunicacion' },
        { title: 'Grammarly', url: 'https://www.grammarly.com/', type: 'tool', description: 'Herramienta para mejorar emails y comunicacion profesional en ingles' },
        { title: 'Platzi — Ingles', url: 'https://platzi.com/', type: 'link', description: 'Cursos de ingles tecnico y profesional en espanol' }
      );
    } else if (match(t, ['presenta', 'present', 'speaking'])) {
      resources.push(
        { title: 'TED Talks — Technology', url: 'https://www.ted.com/topics/technology', type: 'video', description: 'TED Talks de tecnologia para mejorar comprension y presentacion en ingles' },
        { title: 'Google Technical Writing', url: 'https://developers.google.com/tech-writing', type: 'link', description: 'Curso de presentaciones tecnicas efectivas en ingles' },
        { title: 'Platzi — Ingles para Dev', url: 'https://platzi.com/', type: 'link', description: 'Curso de ingles para developers y presentaciones tecnicas' }
      );
    } else if (match(t, ['docstring', 'readme', 'code documentation', 'code doc'])) {
      resources.push(
        { title: 'Python Docstrings — Real Python', url: 'https://realpython.com/documenting-python-code/', type: 'link', description: 'Guia de documentacion de codigo Python: docstrings, Sphinx y mejores practicas' },
        { title: 'README Best Practices — GitHub', url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes', type: 'link', description: 'Como escribir READMEs efectivos en ingles para proyectos de codigo' },
        { title: 'Google Style Guide — Python', url: 'https://google.github.io/styleguide/pyguide.html', type: 'link', description: 'Guia de estilo de Google para docstrings y documentacion en Python' }
      );
    } else {
      resources.push(
        { title: 'Google Technical Writing', url: 'https://developers.google.com/tech-writing', type: 'link', description: 'Curso gratuito de escritura tecnica en ingles por Google' },
        { title: 'AI/ML Glossary — Google', url: 'https://developers.google.com/machine-learning/glossary', type: 'link', description: 'Glosario de terminos de ML e IA en ingles' },
        { title: 'Platzi — Ingles Tecnico', url: 'https://platzi.com/', type: 'link', description: 'Cursos de ingles tecnico para profesionales de tecnologia' }
      );
    }
    return resources;
  }

  // ---- BUSINESS / AGILE / PROJECT MANAGEMENT ----
  if (match(t, ['agile', 'scrum', 'kanban', 'sprint', 'lean', 'startup', 'business model', 'pitch', 'canvas', 'tam', 'sam', 'som', 'mvp', 'financiamiento', 'inversores', 'jira', 'trello', 'notion', 'gestion de proyecto', 'stakeholder', 'risk', 'riesgo', 'presupuesto', 'budget', 'roadmap', 'backlog', 'planning', 'retrospectiva', 'daily standup', 'user story']) || match(s, ['metodologias agiles', 'emprendimiento', 'gestion de proyectos'])) {
    if (match(t, ['scrum', 'sprint', 'daily', 'retrospectiva'])) {
      resources.push(
        { title: 'Scrum Guide — Official', url: 'https://scrumguides.org/', type: 'link', description: 'Guia oficial de Scrum en espanol: roles, eventos, artefactos y reglas' },
        { title: 'Scrum — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de Scrum y metodologias agiles en espanol con certificacion' },
        { title: 'Scrum.org — Learning Path', url: 'https://www.scrum.org/resources', type: 'link', description: 'Recursos oficiales de Scrum.org: guias, assessments y certificaciones' }
      );
    } else if (match(t, ['kanban', 'flujo', 'flow'])) {
      resources.push(
        { title: 'Kanban Guide', url: 'https://kanban.university/kanban-guide/', type: 'link', description: 'Guia oficial de Kanban: principios, practicas y metricas de flujo' },
        { title: 'Trello — Kanban Tool', url: 'https://trello.com/', type: 'tool', description: 'Herramienta gratuita de tableros Kanban para gestion de proyectos' },
        { title: 'Kanban — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de Kanban y gestion visual de trabajo en espanol' }
      );
    } else if (match(t, ['lean', 'mvp', 'startup', 'validacion'])) {
      resources.push(
        { title: 'Lean Startup — Eric Ries', url: 'https://theleanstartup.com/', type: 'link', description: 'Metodologia Lean Startup: build-measure-learn y producto minimo viable' },
        { title: 'Emprendimiento — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de emprendimiento y validacion de ideas en espanol' },
        { title: 'Y Combinator — Startup School', url: 'https://www.startupschool.org/', type: 'link', description: 'Curso gratuito de Y Combinator para emprendedores tecnologicos' }
      );
    } else if (match(t, ['business model', 'canvas', 'modelo de negocio'])) {
      resources.push(
        { title: 'Business Model Canvas — Strategyzer', url: 'https://www.strategyzer.com/business-model-canvas', type: 'tool', description: 'Herramienta oficial del Business Model Canvas para disenar modelos de negocio' },
        { title: 'Emprendimiento — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de Business Model Canvas y propuesta de valor en espanol' },
        { title: 'Canvanizer', url: 'https://canvanizer.com/', type: 'tool', description: 'Herramienta gratuita para crear Business Model Canvas online' }
      );
    } else if (match(t, ['pitch', 'presentacion', 'inversores', 'funding'])) {
      resources.push(
        { title: 'Pitch Deck Examples — Y Combinator', url: 'https://www.ycombinator.com/library/4T-how-to-design-a-better-pitch-deck', type: 'link', description: 'Guia de Y Combinator para crear pitch decks efectivos' },
        { title: 'SlideBean — Pitch Deck', url: 'https://slidebean.com/', type: 'tool', description: 'Plantillas de pitch deck y herramienta de presentaciones' },
        { title: 'Emprendimiento — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de pitch y presentacion a inversores en espanol' }
      );
    } else if (match(t, ['tam', 'sam', 'som', 'mercado', 'market'])) {
      resources.push(
        { title: 'Market Analysis — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de analisis de mercado TAM/SAM/SOM en espanol' },
        { title: 'Y Combinator — Market Size', url: 'https://www.startupschool.org/', type: 'link', description: 'Guia de Y Combinator para estimar tamano de mercado' },
        { title: 'Datos del INEC Ecuador', url: 'https://www.ecuadorencifras.gob.ec/estadisticas/', type: 'dataset', description: 'Datos demograficos y economicos de Ecuador para analisis de mercado' }
      );
    } else if (match(t, ['jira', 'trello', 'notion', 'herramient'])) {
      resources.push(
        { title: 'Jira — Atlassian', url: 'https://www.atlassian.com/software/jira', type: 'tool', description: 'Herramienta de gestion de proyectos agiles: sprints, boards y reportes' },
        { title: 'Notion — Templates', url: 'https://www.notion.so/templates', type: 'tool', description: 'Plantillas de Notion para gestion de proyectos y documentacion' },
        { title: 'Trello — Boards', url: 'https://trello.com/', type: 'tool', description: 'Herramienta visual de gestion de proyectos con tableros Kanban' }
      );
    } else if (match(t, ['financiamiento', 'funding', 'inversion'])) {
      resources.push(
        { title: 'Y Combinator — Startup School', url: 'https://www.startupschool.org/', type: 'link', description: 'Curso gratuito de financiamiento para startups de Y Combinator' },
        { title: 'Emprendimiento LATAM — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de fuentes de financiamiento para emprendedores en LATAM' },
        { title: 'SENESCYT Ecuador', url: 'https://www.senescyt.gob.ec/', type: 'link', description: 'Becas y financiamiento para educacion e innovacion en Ecuador' }
      );
    } else if (match(t, ['riesgo', 'risk', 'stakeholder', 'comunicacion'])) {
      resources.push(
        { title: 'PMI — Project Management', url: 'https://www.pmi.org/', type: 'link', description: 'Instituto de Gestion de Proyectos: recursos, certificaciones y mejores practicas' },
        { title: 'Gestion de Proyectos — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de gestion de riesgos y stakeholders en proyectos en espanol' },
        { title: 'Risk Management — Atlassian', url: 'https://www.atlassian.com/work-management/project-management', type: 'link', description: 'Guia de gestion de riesgos en proyectos de tecnologia' }
      );
    } else {
      resources.push(
        { title: 'Scrum Guide — Oficial', url: 'https://scrumguides.org/', type: 'link', description: 'Guia oficial de Scrum en espanol para gestion agil de proyectos' },
        { title: 'Emprendimiento — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Cursos de emprendimiento y gestion de proyectos en espanol' },
        { title: 'Y Combinator — Startup School', url: 'https://www.startupschool.org/', type: 'link', description: 'Curso gratuito de emprendimiento tecnologico' }
      );
    }
    return resources;
  }

  // ---- BUSINESS INTELLIGENCE / REPORTING ----
  if (match(t, ['power bi', 'looker', 'tableau', 'bi', 'business intelligence', 'kpi', 'metrica', 'reporting', 'reporte']) || match(s, ['inteligencia de negocio'])) {
    if (match(t, ['power bi', 'dax'])) {
      resources.push(
        { title: 'Power BI Documentation — Microsoft', url: 'https://learn.microsoft.com/en-us/power-bi/', type: 'link', description: 'Documentacion oficial de Power BI: modelado, DAX, visualizaciones y reportes' },
        { title: 'DAX Guide', url: 'https://dax.guide/', type: 'link', description: 'Referencia completa de funciones DAX para Power BI' },
        { title: 'Power BI — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de Power BI en espanol: desde cero hasta dashboards avanzados' }
      );
    } else if (match(t, ['looker', 'data studio'])) {
      resources.push(
        { title: 'Looker Studio Documentation', url: 'https://support.google.com/looker-studio/', type: 'link', description: 'Documentacion de Looker Studio (ex Data Studio): dashboards gratuitos de Google' },
        { title: 'Google Analytics Academy', url: 'https://analytics.google.com/analytics/academy/', type: 'link', description: 'Cursos gratuitos de Google Analytics y reporting' },
        { title: 'BI — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de Business Intelligence y dashboards en espanol' }
      );
    } else if (match(t, ['tableau'])) {
      resources.push(
        { title: 'Tableau Public', url: 'https://public.tableau.com/', type: 'tool', description: 'Version gratuita de Tableau para crear visualizaciones y dashboards interactivos' },
        { title: 'Tableau Training', url: 'https://www.tableau.com/learn/training', type: 'link', description: 'Cursos oficiales de Tableau: basico, intermedio y avanzado' },
        { title: 'BI — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de Tableau y Business Intelligence en espanol' }
      );
    } else {
      resources.push(
        { title: 'Power BI — Microsoft Learn', url: 'https://learn.microsoft.com/en-us/power-bi/', type: 'link', description: 'Cursos gratuitos de Power BI y Business Intelligence de Microsoft' },
        { title: 'Looker Studio — Google', url: 'https://lookerstudio.google.com/', type: 'tool', description: 'Herramienta gratuita de dashboards y reporting de Google' },
        { title: 'BI — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Cursos de Business Intelligence y analisis de datos en espanol' }
      );
    }
    return resources;
  }

  // ---- IA APPLIED TO BUSINESS ----
  if (match(t, ['ia para negocio', 'ia en empresa', 'automatizacion', 'rpa', 'chatbot', 'document ai', 'ocr empresarial', 'ventaja competitiva', 'ai readiness', 'roi de ia', 'transformacion digital', 'change management', 'gestion del cambio', 'cultura data', 'data-driven']) || match(s, ['ia aplicada', 'automatizacion', 'estrategia', 'transformacion'])) {
    if (match(t, ['rpa', 'automatizacion', 'zapier', 'make', 'power automate'])) {
      resources.push(
        { title: 'Zapier — Automation Platform', url: 'https://zapier.com/', type: 'tool', description: 'Plataforma de automatizacion sin codigo: conecta 5000+ apps con IA' },
        { title: 'Make (ex Integromat)', url: 'https://www.make.com/', type: 'tool', description: 'Herramienta visual de automatizacion de workflows y procesos' },
        { title: 'Automatizacion — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de automatizacion de procesos con herramientas no-code en espanol' }
      );
    } else if (match(t, ['chatbot', 'conversacional', 'asistente'])) {
      resources.push(
        { title: 'LangChain — Build Chatbots', url: 'https://python.langchain.com/docs/get_started/introduction', type: 'link', description: 'Framework para construir chatbots con LLMs: RAG, memory y agents' },
        { title: 'OpenAI API — Chat', url: 'https://platform.openai.com/docs/guides/chat', type: 'link', description: 'Documentacion de la API de Chat de OpenAI para crear chatbots' },
        { title: 'Chatbot — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de creacion de chatbots empresariales en espanol' }
      );
    } else if (match(t, ['roi', 'caso de negocio', 'business case'])) {
      resources.push(
        { title: 'McKinsey — AI in Business', url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights', type: 'link', description: 'Insights de McKinsey sobre ROI de IA y transformacion empresarial' },
        { title: 'Harvard Business Review — AI', url: 'https://hbr.org/topic/subject/ai-and-machine-learning', type: 'link', description: 'Articulos de HBR sobre aplicacion de IA en estrategia de negocios' },
        { title: 'IA para Negocios — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de estrategia de IA y ROI para ejecutivos en espanol' }
      );
    } else if (match(t, ['transformacion digital', 'digital transformation', 'madurez'])) {
      resources.push(
        { title: 'McKinsey — Digital Transformation', url: 'https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights', type: 'link', description: 'Insights de McKinsey sobre transformacion digital y estrategia' },
        { title: 'Digital Maturity Assessment', url: 'https://www.mckinsey.com/', type: 'link', description: 'Herramientas de evaluacion de madurez digital para organizaciones' },
        { title: 'Transformacion Digital — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de transformacion digital y estrategia en espanol' }
      );
    } else if (match(t, ['change management', 'gestion del cambio', 'cambio organizacional'])) {
      resources.push(
        { title: 'Prosci — Change Management', url: 'https://www.prosci.com/', type: 'link', description: 'Metodologia ADKAR de Prosci para gestion del cambio organizacional' },
        { title: 'McKinsey — Change Management', url: 'https://www.mckinsey.com/', type: 'link', description: 'Articulos sobre gestion del cambio en transformaciones digitales' },
        { title: 'Liderazgo — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de liderazgo y gestion del cambio en espanol' }
      );
    } else if (match(t, ['cultura data', 'data-driven', 'data culture'])) {
      resources.push(
        { title: 'McKinsey — Data Culture', url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights', type: 'link', description: 'Insights sobre como construir una cultura data-driven en organizaciones' },
        { title: 'Harvard Business Review — Data', url: 'https://hbr.org/topic/subject/data', type: 'link', description: 'Articulos de HBR sobre cultura de datos y toma de decisiones basada en datos' },
        { title: 'Data Culture — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de cultura de datos y analytics para equipos en espanol' }
      );
    } else if (match(t, ['document ai', 'extraccion', 'ocr', 'documento'])) {
      resources.push(
        { title: 'Google Document AI', url: 'https://cloud.google.com/document-ai', type: 'link', description: 'Plataforma de Google para extraccion inteligente de datos de documentos' },
        { title: 'AWS Textract', url: 'https://aws.amazon.com/textract/', type: 'link', description: 'Servicio de AWS para extraer texto y datos de documentos escaneados' },
        { title: 'Document AI — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de automatizacion de documentos con IA en espanol' }
      );
    } else if (match(t, ['benchmarking', 'tendencia', 'trend'])) {
      resources.push(
        { title: 'State of AI Report', url: 'https://www.stateof.ai/', type: 'link', description: 'Reporte anual sobre el estado de la IA: tendencias, inversiones y aplicaciones' },
        { title: 'McKinsey — AI Trends', url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights', type: 'link', description: 'Analisis de McKinsey sobre tendencias y futuro de la IA en negocios' },
        { title: 'DotCSV — Tendencias IA', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Ultimas tendencias de IA explicadas en espanol' }
      );
    } else {
      resources.push(
        { title: 'McKinsey — AI Insights', url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights', type: 'link', description: 'Insights de McKinsey sobre aplicacion de IA en negocios y estrategia' },
        { title: 'Harvard Business Review — AI', url: 'https://hbr.org/topic/subject/ai-and-machine-learning', type: 'link', description: 'Articulos sobre IA aplicada a negocios y toma de decisiones' },
        { title: 'IA para Negocios — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Cursos de IA aplicada a negocios en espanol' }
      );
    }
    return resources;
  }

  // ---- PORTFOLIO / JOB / CAREER ----
  if (match(t, ['portafolio', 'portfolio', 'linkedin', 'marca personal', 'kaggle', 'competencia', 'empleo', 'trabajo', 'cv', 'curriculum', 'entrevista', 'interview', 'busqueda de empleo', 'networking', 'freelance']) || match(s, ['portafolio', 'preparacion laboral'])) {
    if (match(t, ['github', 'portafolio', 'portfolio'])) {
      resources.push(
        { title: 'GitHub — Portfolio Guide', url: 'https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile', type: 'link', description: 'Guia para crear un perfil de GitHub profesional como portafolio tech' },
        { title: 'Kaggle — Competitions', url: 'https://www.kaggle.com/competitions', type: 'link', description: 'Competencias de datos para fortalecer tu portafolio con proyectos reales' },
        { title: 'Portafolio — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de creacion de portafolio profesional tech en espanol' }
      );
    } else if (match(t, ['linkedin', 'marca personal', 'personal brand'])) {
      resources.push(
        { title: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/', type: 'link', description: 'Cursos de desarrollo profesional y marca personal en LinkedIn' },
        { title: 'Marca Personal — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de marca personal y LinkedIn para profesionales tech' },
        { title: 'LinkedIn — Profile Tips', url: 'https://www.linkedin.com/help/linkedin/answer/a543680', type: 'link', description: 'Guia oficial de LinkedIn para optimizar tu perfil profesional' }
      );
    } else if (match(t, ['kaggle', 'competencia', 'competition'])) {
      resources.push(
        { title: 'Kaggle Competitions', url: 'https://www.kaggle.com/competitions', type: 'link', description: 'Competencias de ciencia de datos con premios y rankings globales' },
        { title: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', type: 'link', description: 'Cursos gratuitos de Kaggle: Python, ML, SQL, Deep Learning y mas' },
        { title: 'Kaggle Notebooks', url: 'https://www.kaggle.com/code', type: 'tool', description: 'Notebooks de la comunidad Kaggle para aprender de otros profesionales' }
      );
    } else if (match(t, ['entrevista', 'interview', 'empleo', 'trabajo', 'busqueda'])) {
      resources.push(
        { title: 'LeetCode — Interview Prep', url: 'https://leetcode.com/', type: 'tool', description: 'Plataforma de preparacion para entrevistas tecnicas con problemas de codigo' },
        { title: 'Preparacion Laboral — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de preparacion para entrevistas y busqueda de empleo tech' },
        { title: 'Glassdoor — Interview Questions', url: 'https://www.glassdoor.com/', type: 'link', description: 'Preguntas reales de entrevistas en empresas de tecnologia' }
      );
    } else {
      resources.push(
        { title: 'GitHub — Profile Guide', url: 'https://docs.github.com/', type: 'link', description: 'Guia para crear un perfil profesional de desarrollador en GitHub' },
        { title: 'Kaggle — Learn & Compete', url: 'https://www.kaggle.com/', type: 'link', description: 'Plataforma de ciencia de datos: cursos, competencias y comunidad' },
        { title: 'Carrera Tech — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Cursos de desarrollo de carrera profesional en tecnologia' }
      );
    }
    return resources;
  }

  // ---- TEACHER TRAINING / LMS ----
  if (match(t, ['lms', 'campus', 'pedagogia', 'pedagogic', 'evaluacion formativa', 'retroalimentacion', 'tutoria', 'sincronico', 'sincronica', 'videoconferencia', 'contenido interactivo', 'integridad academica', 'grabacion', 'sesion academica', 'entrega', 'progreso estudiantil', 'ces', 'marco ces', 'educacion virtual']) || match(s, ['educacion virtual', 'lms', 'evaluacion formativa', 'retroalimentacion', 'tutoria', 'facilitacion', 'contenido interactivo', 'etica, privacidad'])) {
    if (match(t, ['videoconferencia', 'sincronico', 'sincronica', 'facilitacion'])) {
      resources.push(
        { title: 'Zoom — Best Practices', url: 'https://support.zoom.us/hc/en-us/articles/201362613', type: 'link', description: 'Mejores practicas de Zoom para clases sincronicas y videoconferencia' },
        { title: 'Google Meet — Help', url: 'https://support.google.com/meet/', type: 'link', description: 'Guia de Google Meet para facilitacion de clases en linea' },
        { title: 'Educacion Virtual — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de facilitacion de clases virtuales sincronicas en espanol' }
      );
    } else if (match(t, ['evaluacion', 'retroalimentacion', 'feedback', 'rubrica'])) {
      resources.push(
        { title: 'Formative Assessment — Edutopia', url: 'https://www.edutopia.org/topic/formative-assessment', type: 'link', description: 'Recursos de Edutopia sobre evaluacion formativa y retroalimentacion efectiva' },
        { title: 'Rubric Maker — iRubric', url: 'https://www.rcampus.com/rubricshellc.cfm', type: 'tool', description: 'Herramienta gratuita para crear rubricas de evaluacion detalladas' },
        { title: 'Assessment — Khan Academy', url: 'https://es.khanacademy.org/', type: 'link', description: 'Ejemplos de evaluacion formativa en educacion en linea' }
      );
    } else if (match(t, ['contenido interactivo', 'diseno instruccional', 'h5p'])) {
      resources.push(
        { title: 'H5P — Interactive Content', url: 'https://h5p.org/', type: 'tool', description: 'Herramienta gratuita para crear contenido interactivo: quizzes, videos, presentaciones' },
        { title: 'Canva — Education', url: 'https://www.canva.com/education/', type: 'tool', description: 'Herramienta de diseno para crear material educativo visual interactivo' },
        { title: 'Diseno Instruccional — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de diseno de contenido educativo digital en espanol' }
      );
    } else if (match(t, ['integridad academica', 'plagio', 'honestidad'])) {
      resources.push(
        { title: 'Academic Integrity — ICAI', url: 'https://academicintegrity.org/', type: 'link', description: 'Centro Internacional de Integridad Academica: recursos y mejores practicas' },
        { title: 'Turnitin', url: 'https://www.turnitin.com/', type: 'tool', description: 'Herramienta de deteccion de plagio y promocion de integridad academica' },
        { title: 'Etica Educativa — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Recursos sobre integridad academica en entornos digitales' }
      );
    } else if (match(t, ['grabacion', 'edicion', 'publicacion', 'obs'])) {
      resources.push(
        { title: 'OBS Studio', url: 'https://obsproject.com/', type: 'tool', description: 'Software gratuito de grabacion y streaming para clases virtuales' },
        { title: 'YouTube Creator Academy', url: 'https://creatoracademy.youtube.com/', type: 'link', description: 'Curso de YouTube para creacion y edicion de contenido educativo' },
        { title: 'Video Education — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de grabacion y edicion de videos educativos en espanol' }
      );
    } else if (match(t, ['progreso estudiantil', 'analytics', 'riesgo', 'tutoria'])) {
      resources.push(
        { title: 'Learning Analytics — Edutopia', url: 'https://www.edutopia.org/topic/data', type: 'link', description: 'Recursos sobre uso de datos y analytics en educacion' },
        { title: 'Early Alert Systems', url: 'https://www.educause.edu/', type: 'link', description: 'Sistemas de alerta temprana para identificar estudiantes en riesgo' },
        { title: 'Tutoria Virtual — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de tutoria y acompanamiento virtual en espanol' }
      );
    } else {
      resources.push(
        { title: 'Edutopia — Education Resources', url: 'https://www.edutopia.org/', type: 'link', description: 'Recursos educativos: pedagogia, evaluacion y tecnologia educativa' },
        { title: 'Khan Academy — Educadores', url: 'https://es.khanacademy.org/', type: 'link', description: 'Recursos gratuitos para educadores y herramientas de seguimiento' },
        { title: 'Educacion Virtual — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Cursos de educacion virtual y tecnologia educativa en espanol' }
      );
    }
    return resources;
  }

  // ---- PROJECT / CAPSTONE / THESIS ----
  if (match(t, ['proyecto final', 'proyecto integrador', 'capstone', 'tesis', 'titulacion', 'defensa', 'investigacion', 'metodolog', 'hipotesis', 'revision de literatura', 'resultados', 'conclusiones', 'abstract', 'poster', 'diseno metodologico', 'analisis de resultados', 'arquitectura tecnica', 'deploy', 'pipeline productivo', 'seleccion del problema', 'go-live', 'delivery', 'sprint review', 'demo day']) || match(s, ['proyecto integrador'])) {
    if (match(t, ['metodolog', 'diseno metodologico', 'diseno experimental'])) {
      resources.push(
        { title: 'Research Methodology — Khan Academy', url: 'https://es.khanacademy.org/math/statistics-probability', type: 'link', description: 'Fundamentos de metodologia de investigacion y diseno experimental' },
        { title: 'Google Scholar', url: 'https://scholar.google.com/', type: 'tool', description: 'Buscador academico para revisar metodologias en papers relacionados' },
        { title: 'Metodologia — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de metodologia de investigacion aplicada a tecnologia' }
      );
    } else if (match(t, ['revision de literatura', 'estado del arte', 'literature review'])) {
      resources.push(
        { title: 'Google Scholar', url: 'https://scholar.google.com/', type: 'tool', description: 'Buscador de papers academicos para revision de literatura' },
        { title: 'Papers With Code', url: 'https://paperswithcode.com/', type: 'link', description: 'Papers con codigo: estado del arte en ML y IA con benchmarks' },
        { title: 'ArXiv — AI Research', url: 'https://arxiv.org/list/cs.AI/recent', type: 'link', description: 'Publicaciones recientes de IA para revision del estado del arte' }
      );
    } else if (match(t, ['deploy', 'produccion', 'pipeline', 'go-live', 'delivery'])) {
      resources.push(
        { title: 'Vercel — Deploy', url: 'https://vercel.com/docs', type: 'link', description: 'Plataforma de deployment para aplicaciones web y APIs' },
        { title: 'Docker — Deployment', url: 'https://docs.docker.com/get-started/', type: 'link', description: 'Guia de deployment con Docker para poner proyectos en produccion' },
        { title: 'MLOps — ML-Ops.org', url: 'https://ml-ops.org/', type: 'link', description: 'Mejores practicas de deployment de modelos de ML en produccion' }
      );
    } else if (match(t, ['defensa', 'presentacion', 'poster', 'demo'])) {
      resources.push(
        { title: 'How to Present — TED', url: 'https://www.ted.com/talks', type: 'video', description: 'TED Talks para inspirarse en presentaciones efectivas de proyectos' },
        { title: 'Canva — Presentations', url: 'https://www.canva.com/', type: 'tool', description: 'Herramienta de diseno para crear presentaciones y posters profesionales' },
        { title: 'Presentaciones — Platzi', url: 'https://platzi.com/', type: 'link', description: 'Curso de presentaciones efectivas para defensa de proyectos' }
      );
    } else {
      resources.push(
        { title: 'Papers With Code', url: 'https://paperswithcode.com/', type: 'link', description: 'Referencia de proyectos de ML con codigo, benchmarks y papers' },
        { title: 'Kaggle Datasets', url: 'https://www.kaggle.com/datasets', type: 'dataset', description: 'Miles de datasets para proyectos de ciencia de datos y ML' },
        { title: 'Google Scholar', url: 'https://scholar.google.com/', type: 'tool', description: 'Buscador academico para fundamentar proyectos de investigacion' }
      );
    }
    return resources;
  }

  // ---- PREDICTION / FORECASTING / ANALYTICS ----
  if (match(t, ['prediccion', 'predicti', 'forecast', 'churn', 'retencion', 'segmentacion', 'customer', 'ventas', 'demanda', 'scoring', 'clasificacion de cliente']) || match(s, ['analitica predictiva', 'ml para negocios'])) {
    if (match(t, ['churn', 'retencion'])) {
      resources.push(
        { title: 'Churn Prediction — Kaggle', url: 'https://www.kaggle.com/datasets', type: 'dataset', description: 'Datasets de churn de clientes en Kaggle para practicar prediccion' },
        { title: 'Scikit-learn — Classification', url: 'https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html', type: 'link', description: 'Modelos de clasificacion para prediccion de churn con scikit-learn' },
        { title: 'Analytics — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Curso de analitica predictiva y retencion de clientes en espanol' }
      );
    } else if (match(t, ['forecast', 'ventas', 'demanda', 'series'])) {
      resources.push(
        { title: 'Time Series — Kaggle', url: 'https://www.kaggle.com/learn/time-series', type: 'link', description: 'Curso de forecasting y series temporales para prediccion de ventas' },
        { title: 'Prophet — Facebook', url: 'https://facebook.github.io/prophet/', type: 'link', description: 'Libreria de Facebook para forecasting de series temporales' },
        { title: 'StatQuest — Forecasting', url: 'https://www.youtube.com/watch?v=nxJoHk3Mvz0', type: 'video', description: 'Explicacion visual de tecnicas de forecasting por StatQuest' }
      );
    } else if (match(t, ['segmentacion', 'customer segment', 'cluster'])) {
      resources.push(
        { title: 'Customer Segmentation — Kaggle', url: 'https://www.kaggle.com/datasets', type: 'dataset', description: 'Datasets de clientes en Kaggle para practicar segmentacion' },
        { title: 'Scikit-learn — Clustering', url: 'https://scikit-learn.org/stable/modules/clustering.html', type: 'link', description: 'Algoritmos de clustering para segmentacion de clientes: K-Means, DBSCAN' },
        { title: 'Analytics Vidhya — Segmentation', url: 'https://www.analyticsvidhya.com/', type: 'link', description: 'Tutoriales de segmentacion de clientes con Python' }
      );
    } else {
      resources.push(
        { title: 'Scikit-learn — ML for Business', url: 'https://scikit-learn.org/stable/', type: 'link', description: 'Herramientas de ML para prediccion, clasificacion y analisis de negocio' },
        { title: 'Kaggle — Business Datasets', url: 'https://www.kaggle.com/datasets', type: 'dataset', description: 'Datasets de negocios para practicar analitica predictiva' },
        { title: 'Analytics — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Cursos de analitica predictiva y ML para negocios en espanol' }
      );
    }
    return resources;
  }

  // ============================================
  // ULTIMATE FALLBACK — based on subject
  // ============================================

  // Fallback based on subject area
  if (match(s, ['python'])) {
    resources.push(
      { title: 'Python Tutorial — W3Schools', url: 'https://www.w3schools.com/python/', type: 'link', description: 'Tutorial completo de Python con editor interactivo y ejemplos' },
      { title: 'Real Python', url: 'https://realpython.com/', type: 'link', description: 'Tutoriales avanzados de Python para todos los niveles' },
      { title: 'Python — freeCodeCamp ES', url: 'https://www.freecodecamp.org/espanol/learn/scientific-computing-with-python/', type: 'link', description: 'Curso gratuito de Python en espanol con certificacion' }
    );
  } else if (match(s, ['machine learning', 'ml'])) {
    resources.push(
      { title: 'Scikit-learn Documentation', url: 'https://scikit-learn.org/stable/', type: 'link', description: 'Documentacion oficial de scikit-learn para Machine Learning' },
      { title: 'Intro to ML — Kaggle', url: 'https://www.kaggle.com/learn/intro-to-machine-learning', type: 'link', description: 'Curso practico de Machine Learning en Kaggle' },
      { title: 'DotCSV — ML en espanol', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Explicaciones de Machine Learning en espanol' }
    );
  } else if (match(s, ['datos', 'data', 'ciencia de datos'])) {
    resources.push(
      { title: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', type: 'link', description: 'Cursos gratuitos de ciencia de datos: Python, SQL, ML y mas' },
      { title: 'Datos del INEC Ecuador', url: 'https://www.ecuadorencifras.gob.ec/estadisticas/', type: 'dataset', description: 'Datos estadisticos oficiales de Ecuador para proyectos reales' },
      { title: 'Platzi — Ciencia de Datos', url: 'https://platzi.com/datos/', type: 'link', description: 'Cursos de ciencia de datos en espanol con proyectos practicos' }
    );
  } else if (match(s, ['big data'])) {
    resources.push(
      { title: 'Apache Spark Documentation', url: 'https://spark.apache.org/docs/latest/', type: 'link', description: 'Documentacion de Spark para procesamiento de big data' },
      { title: 'Databricks Community', url: 'https://community.cloud.databricks.com/', type: 'tool', description: 'Plataforma gratuita para practicar Spark y big data' },
      { title: 'Big Data — Platzi', url: 'https://platzi.com/datos/', type: 'link', description: 'Cursos de big data y procesamiento distribuido en espanol' }
    );
  } else if (match(s, ['inteligencia artificial', 'ia'])) {
    resources.push(
      { title: 'DotCSV — IA en espanol', url: 'https://www.youtube.com/c/DotCSV', type: 'video', description: 'Canal de YouTube sobre IA, ML y deep learning en espanol' },
      { title: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', type: 'link', description: 'Cursos gratuitos de IA y ML en Kaggle con ejercicios practicos' },
      { title: 'Google AI — Learning', url: 'https://ai.google/education/', type: 'link', description: 'Recursos educativos de Google sobre inteligencia artificial' }
    );
  } else {
    // Absolute fallback
    resources.push(
      { title: 'freeCodeCamp en Espanol', url: 'https://www.freecodecamp.org/espanol/', type: 'link', description: 'Cursos gratuitos de programacion y datos en espanol con certificacion' },
      { title: 'Platzi — Tecnologia', url: 'https://platzi.com/datos/', type: 'link', description: 'Plataforma educativa latinoamericana con cursos de tecnologia en espanol' },
      { title: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', type: 'link', description: 'Cursos gratuitos de ciencia de datos, ML y Python en Kaggle' }
    );
  }

  return resources;
}

function match(text, keywords) {
  return keywords.some(k => text.includes(k));
}

// ==========================================
// MAIN EXECUTION
// ==========================================

async function fetchAll(table, select, pageSize = 1000) {
  let all = [];
  let offset = 0;
  while (true) {
    const r = await fetch(`${BASE}/${table}?select=${select}&limit=${pageSize}&offset=${offset}`, {
      headers: { 'apikey': SKEY, 'Authorization': 'Bearer ' + SKEY }
    });
    const data = await r.json();
    all = all.concat(data);
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

async function main() {
  console.log('=== STEP 1: Finding sessions with 0 resources ===');

  // Fetch all sessions and resources
  const sessions = await fetchAll('sessions', 'id,number,title,subject_id');
  console.log(`Total sessions: ${sessions.length}`);

  const resources = await fetchAll('session_resources', 'session_id');
  console.log(`Total resources: ${resources.length}`);

  const subjects = await fetchAll('subjects', 'id,name,slug');
  const subjectMap = {};
  for (const sub of subjects) subjectMap[sub.id] = sub;

  // Count resources per session
  const countMap = {};
  for (const r of resources) {
    countMap[r.session_id] = (countMap[r.session_id] || 0) + 1;
  }

  // Find sessions with 0 resources
  const missing = sessions.filter(s => !countMap[s.id]);
  console.log(`Sessions with 0 resources: ${missing.length}`);

  if (missing.length === 0) {
    console.log('All sessions have resources!');
    return;
  }

  // ==========================================
  // STEP 2: Generate and insert resources
  // ==========================================
  console.log('\n=== STEP 2: Generating resources ===');

  // Build all resources to insert
  const allResources = [];
  let generated = 0;

  for (const session of missing) {
    const subjectName = subjectMap[session.subject_id]?.name || 'General';
    const res = generateResources(session.title, subjectName);

    for (let i = 0; i < res.length; i++) {
      allResources.push({
        session_id: session.id,
        title: res[i].title,
        url: res[i].url,
        type: res[i].type,
        description: res[i].description,
        order_index: i + 1
      });
    }
    generated++;
  }

  console.log(`Generated ${allResources.length} resources for ${generated} sessions`);

  // ==========================================
  // STEP 3: Bulk insert in batches of 500
  // ==========================================
  console.log('\n=== STEP 3: Inserting resources in batches ===');

  const BATCH_SIZE = 500;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < allResources.length; i += BATCH_SIZE) {
    const batch = allResources.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(allResources.length / BATCH_SIZE);

    try {
      const res = await fetch(`${BASE}/session_resources`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(batch)
      });

      if (res.ok) {
        inserted += batch.length;
        console.log(`  Batch ${batchNum}/${totalBatches}: ${batch.length} resources inserted (total: ${inserted})`);
      } else {
        const err = await res.text();
        console.log(`  Batch ${batchNum}/${totalBatches}: ERROR — ${err.substring(0, 200)}`);
        errors += batch.length;
      }
    } catch (e) {
      console.log(`  Batch ${batchNum}/${totalBatches}: NETWORK ERROR — ${e.message}`);
      errors += batch.length;
    }
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Inserted: ${inserted}`);
  console.log(`Errors: ${errors}`);
  console.log(`Total: ${inserted + errors}`);

  // ==========================================
  // STEP 4: Verify
  // ==========================================
  console.log('\n=== STEP 4: Verification ===');
  const newResources = await fetchAll('session_resources', 'session_id');
  console.log(`Total resources now: ${newResources.length}`);

  const newCountMap = {};
  for (const r of newResources) {
    newCountMap[r.session_id] = (newCountMap[r.session_id] || 0) + 1;
  }

  const stillMissing = sessions.filter(s => !newCountMap[s.id]);
  console.log(`Sessions still with 0 resources: ${stillMissing.length}`);

  if (stillMissing.length > 0) {
    console.log('Sessions still missing:');
    for (const s of stillMissing.slice(0, 10)) {
      console.log(`  S${s.number}: ${s.title} (${subjectMap[s.subject_id]?.name})`);
    }
  }
}

main().catch(e => console.error('FATAL:', e));
