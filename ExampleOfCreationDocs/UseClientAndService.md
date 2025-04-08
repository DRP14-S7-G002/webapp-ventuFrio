# 🔷 "use client" → Renderização no Cliente

## Quando Usar?
- Componentes interativos (eventos de clique, estado local, hooks do React).
- Componentes que usam `useState`, `useEffect`, `useContext`, etc.
- Componentes que manipulam o DOM (`document`, `window`).

---

## Exemplo de Componente Cliente

```tsx
"use client";  // Esse componente será renderizado no navegador

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  );
}
```

## 🔹 Comportamento Padrão no Next.js 13+

Por padrão, um componente no Next.js 13+ é `"use server"`  
Ou seja, se você não definir nada, ele será tratado como código do **servidor**.

---

## 🔷 `"use server"` → Execução no Servidor

### Quando Usar?

- Funções que acessam bancos de dados.
- Funções que fazem requisições externas.
- Leitura de arquivos do servidor.
- APIs que retornam dados para o frontend.
- Código que **não deve ser enviado ao navegador** por segurança.

---

### 📦 Exemplo de Função Servidor

```tsx
"use server";  // Esse código só roda no servidor

import { sql } from "@vercel/postgres";

export async function getUsers() {
  const users = await sql`SELECT * FROM users`;
  return users;
}
```
## 🔷 Resumo: Quando usar cada um?

| Caso de Uso                 | `"use client"` (Navegador)           | `"use server"` (Servidor) |
|----------------------------|--------------------------------------|----------------------------|
| Estado (`useState`)        | ✅ Sim                               | ❌ Não                     |
| Eventos (`onClick`)        | ✅ Sim                               | ❌ Não                     |
| Requisições HTTP (`fetch`) | ✅ Sim, mas melhor usar no servidor  | ✅ Sim                     |
| Banco de Dados (`sql`)     | ❌ Não                               | ✅ Sim                     |
| Manipular `document`       | ✅ Sim                               | ❌ Não                     |
