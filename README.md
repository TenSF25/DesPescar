# 🐧 DesPescar - Guía de Desarrollo Interna 🚀

Este es el repositorio central (Monorepo) de DesPescar. Acá abajo están los comandos exactos y las reglas técnicas que tenemos que seguir el equipo para no romper nada.

---

## 🛠️ Requisitos Obligatorios antes de arrancar

Antes de clonar, asegurate de tener instalado:

- **Node.js** (Versión LTS v20 o superior)
- **pnpm** (Gestor de paquetes obligatorio) -> `npm i -g pnpm`

---

## 🚀 Setup Inicial (Puesta en marcha)

### 1. Clonar el proyecto y pararse en la raíz

```bash
git clone https://github.com/TenSF25/DesPescar.git
cd despescar
```

### 2. Levantar el Frontend (React + TS + Tailwind v4)

⚠️ PROHIBIDO usar npm install. Usamos pnpm para mantener el archivo pnpm-lock.yaml unificado.

```bash
pnpm install
pnpm dev
```
