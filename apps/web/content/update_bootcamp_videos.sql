-- ============================================================
-- ITSEIA Academy - Update Video URLs for Bootcamp IA Intensivo
-- Run this in Supabase SQL Editor OR via psql
-- Generated: 2026-03-22
--
-- 48 sessions, all Spanish YouTube videos from reputable channels:
--   mouredev, DotCSV, freeCodeCamp Espanol, Fazt, Codigo Facilito
-- ============================================================

BEGIN;

-- SUBJECT: Python Intensivo (BOOT-PY1) - 4 sesiones
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=Kp4Mvapo5kc',        updated_at = now() WHERE id = 'cb85eb96-504c-4cd8-ad70-beff92a0ddd5'; -- Variables, tipos de datos y operadores
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=Kp4Mvapo5kc&t=3600', updated_at = now() WHERE id = '6c07ddb9-51ff-4d15-ab4f-094032f41753'; -- Estructuras de control: if, for, while
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=TbcEqkabAWU',         updated_at = now() WHERE id = 'e94ee6e5-e92c-4ec0-bd9f-4761a3e2562e'; -- Funciones y modulos
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=Kp4Mvapo5kc&t=7200', updated_at = now() WHERE id = '8d292b54-036c-4e90-bfe8-c586c62ef0ed'; -- Listas, diccionarios y manejo de datos

-- SUBJECT: Matematicas para ML (BOOT-MAT1) - 4 sesiones
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=GPVsHOlRBBI',         updated_at = now() WHERE id = 'c05dbc8a-82ba-4c64-a932-e9ca2b188a03'; -- Vectores y matrices con NumPy
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=KytW151dpqU',         updated_at = now() WHERE id = '02dbe08d-4ce1-42ea-9c2b-e08d51a6c26a'; -- Estadistica descriptiva esencial
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=KytW151dpqU&t=1200',  updated_at = now() WHERE id = 'e1251af1-3b4a-4210-a72a-0057b214fab7'; -- Probabilidad para Machine Learning
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=GPVsHOlRBBI&t=2400',  updated_at = now() WHERE id = 'd3145abc-07f0-4ec9-b24f-4e68849bf0d6'; -- Algebra lineal aplicada a datos

-- SUBJECT: Intro Machine Learning (BOOT-IML1) - 4 sesiones
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=KytW151dpqU',         updated_at = now() WHERE id = '0f2fe7a5-e312-47eb-9fd9-c864e756a08e'; -- Que es Machine Learning y tipos de aprendizaje
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=GPVsHOlRBBI&t=3600',  updated_at = now() WHERE id = 'e50c5008-7a39-455c-9f1a-56e008cb1f80'; -- Preparacion de datos con Pandas
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=QVRoAi6rvOE',         updated_at = now() WHERE id = '1388d990-c713-45fc-9250-c4df3c3002ff'; -- Tu primer modelo: Regresion Lineal
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=KytW151dpqU&t=3600',  updated_at = now() WHERE id = '15fda1a4-4e94-42f9-a745-5a768399a8a2'; -- Evaluacion de modelos y metricas

-- SUBJECT: Datos y Visualizacion (BOOT-DAT1) - 4 sesiones
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=GPVsHOlRBBI&t=600',   updated_at = now() WHERE id = '4b91426d-08ea-443f-b684-7a8b466f4596'; -- EDA: Analisis Exploratorio de Datos
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=GPVsHOlRBBI&t=5400',  updated_at = now() WHERE id = '9aca1652-e313-4a15-a963-f96aadd33150'; -- Matplotlib y Seaborn: graficos profesionales
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=KytW151dpqU&t=2400',  updated_at = now() WHERE id = '79e7f43b-8c75-4c5a-b651-bbb98ff72b8c'; -- Feature Engineering basico
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=QVRoAi6rvOE',         updated_at = now() WHERE id = 'c87e2a83-4c38-46ad-8252-ce422e378ae6'; -- Proyecto: EDA completo con dataset real

-- SUBJECT: ML Supervisado (BOOT-SUP2) - 4 sesiones
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=QVRoAi6rvOE',         updated_at = now() WHERE id = '8e2c436d-329c-44f1-83f8-76ca4de221fc'; -- Regresion Logistica y arboles de decision
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=swpAfyZFt-8',         updated_at = now() WHERE id = '037a5fe6-73d1-430a-8250-dc11fe8cb873'; -- Random Forest y Gradient Boosting
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=swpAfyZFt-8&t=1800',  updated_at = now() WHERE id = '89208cbf-79b1-4ae2-b3bf-0346e8b80c77'; -- SVM y KNN: modelos clasicos
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=KytW151dpqU&t=5400',  updated_at = now() WHERE id = '3b30f8d3-f2a3-4d46-a0c9-46c1b5b62247'; -- Hyperparameter tuning y seleccion de modelo

-- SUBJECT: ML No Supervisado (BOOT-UNS2) - 4 sesiones
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=swpAfyZFt-8&t=2700',  updated_at = now() WHERE id = 'f5b26e63-2c57-48f0-9cb4-9cd3ccc7b779'; -- K-Means y clustering jerarquico
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=KytW151dpqU&t=7200',  updated_at = now() WHERE id = 'b4abf33e-1dd8-4c91-89b6-7363a377873a'; -- PCA y reduccion de dimensionalidad
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=swpAfyZFt-8&t=3600',  updated_at = now() WHERE id = 'f5fb733e-3ada-4c07-bd68-e55502e4702c'; -- Deteccion de anomalias
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=swpAfyZFt-8&t=4500',  updated_at = now() WHERE id = '62ac1b94-2d39-4f36-aeb5-21b07bdc63fb'; -- Proyecto: Segmentacion de clientes

-- SUBJECT: Deep Learning Intro (BOOT-DL2) - 4 sesiones
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=MU3cLsSfnME',         updated_at = now() WHERE id = 'b7d2e95c-c659-4825-a26f-9da6405ff825'; -- Perceptron y redes neuronales basicas
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=W8AeOXa_FqU',         updated_at = now() WHERE id = '93ddf2d8-5196-4767-9910-5ebdbdb54f83'; -- Entrenamiento, backpropagation y optimizadores
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=V8j1oENVz00',         updated_at = now() WHERE id = 'acdc3b84-24ec-4ee0-bac0-1dad1e14ed6a'; -- CNNs para vision por computadora
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=V8j1oENVz00&t=1800',  updated_at = now() WHERE id = '44573b9d-97b3-42cd-8203-07ab245effde'; -- Proyecto: Clasificador de imagenes

-- SUBJECT: NLP Basico (BOOT-NLP2) - 4 sesiones
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=ji5CpHaakyY',         updated_at = now() WHERE id = '1e9d339e-0db8-446f-89ea-14171a402690'; -- Fundamentos de NLP y preprocesamiento de texto
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=ji5CpHaakyY&t=1200',  updated_at = now() WHERE id = '4a32a2e7-e290-4793-a007-c0aab0f6ea3d'; -- Bag of Words y TF-IDF
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=ji5CpHaakyY&t=2400',  updated_at = now() WHERE id = 'ffbb87fc-6af4-4b6b-b0ea-7b807c05bef9'; -- Clasificacion de texto y analisis de sentimiento
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=ndT-3ACvnsQ',         updated_at = now() WHERE id = 'a096742b-7827-4121-9c11-8f0dd75598d8'; -- Introduccion a LLMs y APIs de IA

-- SUBJECT: MLOps Basico (BOOT-OPS3) - 4 sesiones
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=_y9qQZXE24A',         updated_at = now() WHERE id = '83b85f5a-3234-4b26-8812-c27c230a7afd'; -- Serializar modelos y crear APIs con FastAPI
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=NVvZNmfqg6M',         updated_at = now() WHERE id = 'ff06ca16-217f-4be6-b0e7-410e08eeca5b'; -- Docker y contenedores para ML
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=3GymExBkKjE',         updated_at = now() WHERE id = 'a5913db7-382c-4c3a-8d9e-4041d6cb1243'; -- Git, GitHub y versionamiento de codigo ML
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=_y9qQZXE24A&t=7200',  updated_at = now() WHERE id = '9d58881b-c39f-4ca4-b86f-ac17655ccf45'; -- CI/CD y monitoreo de modelos

-- SUBJECT: Proyecto Capstone (BOOT-CAP3) - 4 sesiones
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=KytW151dpqU&t=8400',  updated_at = now() WHERE id = '4d0b1b90-9184-4a7f-9cce-7726f2119465'; -- Definicion del problema y recopilacion de datos
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=swpAfyZFt-8&t=5400',  updated_at = now() WHERE id = '39c1631f-7d4c-427e-9b02-af158ee04bf2'; -- Desarrollo del modelo y experimentacion
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=_y9qQZXE24A&t=3600',  updated_at = now() WHERE id = '981a7d5f-8890-40ab-bb5d-87e538ae0b02'; -- Despliegue y presentacion del proyecto
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=TbcEqkabAWU&t=1800',  updated_at = now() WHERE id = '7e3653db-9e91-4b71-8c73-8f8a1df53831'; -- Code review, feedback y mejoras

-- SUBJECT: Portafolio Profesional (BOOT-POR3) - 4 sesiones
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=3GymExBkKjE',         updated_at = now() WHERE id = '98a05872-3c1d-4e0c-8379-b5ef39e64e45'; -- GitHub como portafolio profesional
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=q2lCm2KAz3w',         updated_at = now() WHERE id = '53b5c420-5516-4ba4-b208-46229de9d18b'; -- LinkedIn y marca personal tech
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=90QDe6DQXF4',         updated_at = now() WHERE id = 'be7edd7a-284c-45a6-be63-95b1d67475c1'; -- Kaggle y competencias de ML
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=q2lCm2KAz3w&t=600',   updated_at = now() WHERE id = '7a748e85-cceb-4834-9665-b9f1c46d69a1'; -- Estrategia de busqueda de empleo en IA

-- SUBJECT: Preparacion Laboral (BOOT-LAB3) - 4 sesiones
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=TbcEqkabAWU&t=3600',  updated_at = now() WHERE id = '8ff38002-8c19-4f7a-923b-d450138ee51b'; -- Entrevistas tecnicas de ML
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=OqjnAPp3VmQ',         updated_at = now() WHERE id = '96e2eac8-77fd-4ed7-ad69-d469eff8c499'; -- SQL para Data Science
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=5S5k4C0Kh2k',         updated_at = now() WHERE id = '185da772-503a-45db-9f69-c07308c8ad76'; -- Comunicacion tecnica y storytelling con datos
UPDATE public.sessions SET video_url = 'https://www.youtube.com/watch?v=q2lCm2KAz3w&t=1200',  updated_at = now() WHERE id = '55e48fae-eb2a-4efd-b6b7-417aece44335'; -- Plan de carrera y aprendizaje continuo

COMMIT;

-- Verify
SELECT
  s.number,
  s.title,
  CASE WHEN s.video_url IS NOT NULL THEN 'HAS_VIDEO' ELSE 'MISSING' END AS status,
  LEFT(s.video_url, 60) AS video_preview
FROM public.sessions s
WHERE s.subject_id IN (
  SELECT id FROM public.subjects
  WHERE semester_id IN (
    SELECT id FROM public.semesters
    WHERE program_id = '5576eaaa-8357-4cf0-bdf1-ca2be5b2404e'
  )
)
ORDER BY s.order_index, s.number;
