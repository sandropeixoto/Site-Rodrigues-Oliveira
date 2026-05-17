<div align="center">
  <img src="https://nano.net.br/assets/programacao-DzAvORjU.png" width="50" alt="Logo NANO" />
  
  # NANO
  
  ### TECNOLOGIA SOB MEDIDA
</div>

---

## Visão Geral

O projeto consiste no desenvolvimento da página institucional (Landing Page) para o escritório **Rodrigues & Oliveira Consultoria e Assessoria Jurídica**. Esta aplicação tem como objetivo principal apresentar o escritório para o público, divulgar as áreas de atuação da equipe de advogados e estabelecer um canal de comunicação direto e dinâmico (através de integração via WhatsApp e envio de formulário com proxy de e-mails).

Trata-se de uma aplicação de interface única (SPA - Single Page Application), com um design moderno e responsivo focado em proporcionar credibilidade, acessibilidade corporativa e engajamento para a captação de clientes da área legal, otimizada para o segmento jurídico.

---

## Funcionalidades Principais

> Apresentação Institucional em formato Landing Page com navegação fluida (smooth scroll).

> Catálogo de Áreas de Atuação Jurídica (Cível, Trabalhista, Previdenciário, Administrativo e Tributário).

> Formulário de Contato com validação em tempo real e máscara de telefone.

> Envio assíncrono de formulário de contato integrado a um *Mail Proxy* em nuvem.

> Botão flutuante de WhatsApp para atendimento direto e rápido.

> Animações e micro-interações de rolagem para engajamento contínuo.

---

## Stack Técnica

| Categoria | Tecnologia |
|---|---|
| Frontend | React (v19) |
| Tipagem | TypeScript |
| Estilização | Tailwind CSS (v4) |
| Biblioteca de Animação | Motion (Framer Motion) |
| Gerenciamento de Formulários | React Hook Form |
| Validação de Schema | Zod |
| Ícones | Lucide React |
| Build Tool / Bundler | Vite |
| Node.js / Server | Express |
| Comunicação Email | Mail Proxy via Fetch API (Cloud Run) |

---

## Arquitetura do Projeto

A arquitetura escolhida reflete uma abordagem pragmática para uma Single Page Application focada em performance e manutenção simplificada:

- **Componentização Unificada:** Todo o fluxo de visão (Header, Hero, Serviços, Sobre, Contato e Footer) é centralizado no aplicativo. Com interações gerenciadas por estado (`React.useState` e `React.useEffect`).
- **Validação Isolada:** A validação dos dados utiliza esquemas Zod atrelados ao `react-hook-form`, operando em uma camada de serviço front-end que desacopla lógica de validação da representação.
- **Proxy Serverless para E-mails:** A integração com envios de formulário dispensa um backend complexo local, delegando a responsabilidade para um serviço de Mail Proxy distribuído no Google Cloud Run, garantindo segurança ao não expor credenciais SMTP do cliente.
- **Micro-animações baseadas no Viewport:** O estado das animações confia no scroll do navegador, garantindo performance fluida com o uso do módulo `motion/react`.

---

## Instalação e Execução

### Pré-requisitos
- Node.js (v18 ou superior recomendado)
- Gerenciador de dependências (NPM ou Yarn)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/sandropeixoto/Site-Rodrigues-Oliveira.git

# Entre no diretório do projeto
cd Site-Rodrigues-Oliveira

# Instale as dependências
npm install
```

### Variáveis de Ambiente
Crie um arquivo `.env` baseado no arquivo de exemplo (se necessário para ambientes estendidos). Por padrão, as URIs do backend (Mail Proxy) já se encontram isoladas na comunicação.
```env
# Não há dependências complexas de env publicadas no momento.
```

### Execução Local

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```
A aplicação estará disponível em `http://localhost:3000`.

### Build para Produção

```bash
# Realiza o processo de tipagem e minificação da build
npm run build
```

---

## Scripts Disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o Vite dev server (host: 0.0.0.0 na porta 3000). |
| `npm run build` | Processa os arquivos Typescript, o TailwindCSS e exporta para o diretório de distribuição `dist/`. |
| `npm run preview` | Inicia um servidor local servindo a pasta `dist` gerada em produção. |
| `npm run clean` | Apaga a pasta com resultados da build `dist`. |
| `npm run lint` | Executa a verificação estática do TypeScript sem emissão de arquivos compilados. |

---

## Estrutura de Pastas

```text
/
├── public/                 # Imagens, favicons, meta informações
├── src/                    # Código Fonte da aplicação
│   ├── App.tsx             # Arquivo principal / Raiz de UI e roteamento interno
│   ├── index.css           # Repositório de variáveis globais e declaração do Tailwind CSS
│   ├── main.tsx            # Ponto de inicialização do React
│   └── vite-env.d.ts       # Declarações do Vite e do TypeScript
├── package.json            # Metadados do projeto e dependências Node.js
├── tsconfig.json           # Definições avançadas e restrições do TypeScript
└── vite.config.ts          # Configuração de base da URL, build e integração com React
```

---

## Deploy

A aplicação está configurada e preparada para distribuição via hospedagem estática ou CI/CD otimizado. 
No estado atual, o software adota as seguintes diretrizes:

- **Deploy Estático Frontend:** O projeto se encontra empacotado para o domínio próprio do cliente via Github / provedores de hospedagem estáticos tradicionais.
- **Domínio Base:** A propriedade `base` na configuração do Vite está parametrizada como `/` para operação transparente no domínio primário `rodrigueseoliveira.adv.br`.
- **APIs Conectadas:** O backend que sustenta envios confia no uso isolado e distribuído em Cloud Run (`mail-proxy-has46dauxa-rj.a.run.app`).

---

## Considerações Técnicas

- **Padrões de Acessibilidade:** Uso inteligente de modais amigáveis a leitores de tela e gerenciamento por links e âncoras da página seguindo premissas semânticas do HTML5 adequando-se ao SEO corporativo exigido, utilizando JSON-LD / Structured Data (Google Data Markup).
- **Escalabilidade Componentizada:** A abordagem centralizada no `App.tsx` possui arquitetura simplificada devido à escala da aplicação, mas é altamente preparada para o split code em subcomponentes do React caso novos segmentos institucionais sejam acrescentados posteriormente.
- **Segurança Transacional:** O isolamento imposto pelo Cloud Run previne que robôs extraiam credenciais do backend (SMTPs, emails). O frontend limita-se a transitar payloads de JSON. Adicionalmente, as bibliotecas de input (zod) efetuam higienização dos campos contra formulários abusivos (e-mails inválidos, strings de tamanho incoerente, entre outros).
- **Performance Nativa:** Utilização do ESM (EcmaScript Modules) do Vite com substituição a quente garantem builds velozes e entrega de payloads mínimos aos clientes de final de ponta, essenciais para conversão de vendas/acessos via Mobile.

---

## 🚀 Desenvolvido por

> **Sandro Peixoto**  
> https://www.sandropeixoto.com.br
>
> **NANO**  
> https://nano.net.br
