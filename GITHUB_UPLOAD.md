# 📤 Subir a GitHub - Pasos Detallados

El proyecto está listo para subir a GitHub. Sigue estos pasos:

## 🚀 Opción 1: GitHub CLI (Recomendado)

### 1. Instalar GitHub CLI (si no lo tienes)
```bash
# Windows (con scoop)
scoop install gh

# Windows (con winget)
winget install GitHub.cli

# macOS
brew install gh

# Linux (Ubuntu/Debian)
sudo apt install gh
```

### 2. Autenticarse en GitHub
```bash
gh auth login
```

### 3. Crear repositorio y subir
```bash
# Crear repositorio público
gh repo create llamados-dra-reyes --public --source=. --push

# O crear repositorio privado
gh repo create llamados-dra-reyes --private --source=. --push
```

## 📁 Opción 2: Manual (GitHub Web + Git)

### 1. Crear repositorio en GitHub
1. Ir a https://github.com
2. Hacer clic en "New repository"
3. Nombre: `llamados-dra-reyes`
4. Descripción: `Sistema de llamados en tiempo real con voz dominicana`
5. Elegir Public/Private
6. NO marcar "Add a README file" (ya tenemos uno)
7. Hacer clic en "Create repository"

### 2. Conectar y subir desde terminal
```bash
# Agregar remote
git remote add origin https://github.com/TU_USUARIO/llamados-dra-reyes.git

# Subir a GitHub
git push -u origin master

# O usar main (si GitHub lo prefiere)
git branch -M main
git push -u origin main
```

## 📁 Opción 3: GitHub Desktop (GUI)

### 1. Descargar e instalar GitHub Desktop
- Descargar desde: https://desktop.github.com/

### 2. Clonar y agregar repositorio
1. Abrir GitHub Desktop
2. File → Add Local Repository
3. Seleccionar carpeta del proyecto
4. Hacer clic en "Publish repository"
5. Configurar nombre y visibilidad
6. Publicar

## ✅ Verificación

### Verificar en GitHub
1. Ir a https://github.com/TU_USUARIO/llamados-dra-reyes
2. Verificar que todos los archivos estén presentes
3. Confirmar que README.md se muestre correctamente

### Archivos clave que deben estar:
- ✅ README.md
- ✅ package.json
- ✅ server.js
- ✅ api/index.js
- ✅ vercel.json
- ✅ autoplay.html
- ✅ conexiones.html
- ✅ .gitignore
- ✅ .env.example

## 🔄 Actualizar cambios futuros

### Para subir nuevos cambios:
```bash
# Ver cambios
git status

# Agregar archivos
git add .

# Commitear con mensaje descriptivo
git commit -m "Add nueva funcionalidad"

# Subir a GitHub
git push
```

### Usar GitHub Desktop:
1. Cambios aparecen en la sidebar izquierda
2. Escribir resumen del cambio
3. Hacer clic en "Commit to main"
4. Hacer clic en "Push origin"

## 🌐 Configurar Vercel con GitHub

### 1. Conectar Vercel a GitHub
1. Ir a https://vercel.com
2. Hacer clic en "New Project"
3. Importar desde GitHub
4. Seleccionar `llamados-dra-reyes`

### 2. Configurar variables de entorno
En Vercel dashboard:
```bash
SUPABASE_URL=https://tu-project.supabase.co
SUPABASE_KEY=tu-anon-key
NODE_ENV=production
```

### 3. Deploy automático
Cada push a GitHub → Deploy automático en Vercel

## 📱 Acceso rápido una vez subido

### GitHub Repository:
- URL: https://github.com/TU_USUARIO/llamados-dra-reyes

### Vercel App (después del deploy):
- URL: https://llamados-dra-reyes-tu-usuario.vercel.app

### Comandos útiles:
```bash
# Ver remotes configurados
git remote -v

# Ver estado actual
git status

# Ver historial de commits
git log --oneline

# Ver última versión del README
cat README.md
```

## 🎯 Checklist Final

- [ ] Repositorio creado en GitHub
- [ ] Archivos subidos correctamente
- [ ] README.md visible en GitHub
- [ ] Vercel conectado al repositorio
- [ ] Variables de entorno configuradas en Vercel
- [ ] Deploy automático funcionando
- [ ] URL de producción accesible

---

**¡Proyecto listo para producción en GitHub + Vercel!** 🎉