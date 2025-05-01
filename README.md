# Frontend - Projeto piUnivesp

## Overview
Este projeto é o frontend de um sistema desenvolvido como parte do projeto integrador da Universidade Virtual do Estado de São Paulo (Univesp). Ele utiliza tecnologias modernas para criar uma interface de usuário interativa e responsiva, com suporte a gerenciamento de estado, gráficos e modais.

## Tools and Libraries
- **Next.js**: React framework com suporte a roteamento, renderização no lado do servidor (SSR) e mais.
- **TypeScript**: Desenvolvimento com tipagem estática para maior segurança e produtividade.
- **Chakra UI**: Biblioteca de componentes acessíveis e personalizáveis.
- **React Icons**: Biblioteca de ícones fácil de usar.
- **next-themes**: Suporte para alternância entre temas claro e escuro.
- **@emotion/react**: Motor de estilização necessário para o Chakra UI.
- **@tanstack/react-query**: Gerenciamento de estado assíncrono.
- **@tanstack/react-table**: Biblioteca para criação de tabelas dinâmicas e interativas.
- **Axios**: Cliente HTTP para comunicação com APIs.
- **Recharts**: Biblioteca para criação de gráficos interativos.

## Dependencies
- **Node.js**: v18 ou superior.
- **NVM** (opcional): Para gerenciar múltiplas versões do Node.js.

## Group
- Daniela Martins Costa
- Guilherme da Silveira Santos
- Guilherme Fontainha Machado
- Ítalo Oliveira Almeida
- João Vitor Alves Ribeiro
- José Lucas Silva Rodrigues

## Project Architecture
O projeto segue a estrutura de diretórios do Next.js, com organização adicional para componentes reutilizáveis, hooks, serviços e tipos.

```
src/
├── app/                # Páginas principais do aplicativo
│   ├── home/           # Página inicial com gráficos
│   ├── client/         # Página de gerenciamento de clientes
│   ├── budget/         # Página de orçamentos
│   ├── scheduling/     # Página de agendamentos
│   └── layout.tsx      # Layout principal com cabeçalho e menu
├── components/         # Componentes reutilizáveis (Header, Menu, Modal, Table, etc.)
├── hooks/              # Hooks personalizados (ex.: ToastManager, BudgetContext)
├── service/            # Configuração de serviços (ex.: Axios)
├── types/              # Tipos TypeScript compartilhados
└── styles/             # Estilos globais e módulos CSS
```

## Quick Start

### Localmente
1. Certifique-se de ter o **Node.js** (v18 ou superior) instalado.
2. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/piUnivesp-frontend.git
   cd piUnivesp-frontend
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse o aplicativo em [http://localhost:3000](http://localhost:3000).

### Usando Docker
1. Certifique-se de ter o **Docker** instalado.
2. Construa a imagem Docker:
   ```bash
   docker-compose build
   ```
3. Inicie o container:
   ```bash
   docker-compose up
   ```
4. Acesse o aplicativo em [http://localhost:3000](http://localhost:3000).

## Features
- **Gerenciamento de Clientes**: Adicionar, editar, visualizar e excluir clientes.
- **Orçamentos**: Criar, editar e gerenciar orçamentos com status e valores.
- **Agendamentos**: Planejar e gerenciar agendamentos de visitas.
- **Gráficos Interativos**: Visualização de dados com gráficos de barras e pizza.
- **Notificações Toast**: Feedback visual para ações do usuário.
- **Tema Claro/Escuro**: Alternância entre temas com suporte a personalização.

## Scripts Disponíveis
- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila o projeto para produção.
- `npm run start`: Inicia o servidor em modo de produção.
- `npm run lint`: Executa o linter para verificar problemas no código.

## Contribuição
Contribuições são bem-vindas! Siga as etapas abaixo:
1. Faça um fork do repositório.
2. Crie uma branch para sua feature/bugfix:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça commit das suas alterações:
   ```bash
   git commit -m "Descrição da minha feature"
   ```
4. Envie suas alterações:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request.

## License
Este projeto é licenciado sob a [MIT License](LICENSE).