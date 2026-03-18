

# PetMatch Totem — Frontend de Validação

## Visão Geral
Aplicação de totem para evento público de adoção de animais (cães e gatos). Frontend-only com dados mockados, autenticação simulada, e fluxo completo de adoção com feedback visual.

> **Nota:** Lovable utiliza React + Vite + TypeScript + Tailwind CSS. Não suporta Next.js, CSS Modules puros, ou NestJS. Adaptaremos o design system com variáveis CSS customizadas no Tailwind, seguindo fielmente as cores e a linguagem visual "matte ceramic" do brief.

---

## 1. Design System & Cores
- Variáveis CSS: `--blue-01: #005CA9`, `--blue-02: #00B1EB`, `--gray-700: #706F6F`, `--gray-100: #F1F5F9`
- Fonte: Public Sans via Google Fonts
- Superfícies brancas com sombras suaves, border-radius 16px/8px
- Targets mínimos de 44px para touch em totem

## 2. Estado Global (Zustand)
- **authStore**: token, login/logout, persistência em localStorage
- **animalStore**: lista de animais mockados, filtro por tipo, ação `adoptAnimal` que marca status como "adopted"

## 3. Dados Mockados
- ~12 animais (6 cães, 6 gatos) com fotos do Unsplash, nome, idade, raça, descrição, comportamento, vacinas, porte
- Função simuladora de delay (300-800ms) para simular latência de rede
- Persistência via Zustand persist para manter estado entre refreshes

## 4. Tela 1 — Login (Gatekeeper)
- Card centralizado com backdrop blur no fundo
- Campos: email e senha (teste@teste.com / teste123)
- Validação com feedback de erro inline
- Ao autenticar, redireciona para o Hub

## 5. Tela 2 — Hub de Seleção
- Header com logo/título e botão de logout
- Segmented Control (Tabs): [Cachorros] e [Gatos]
- Grid responsivo: 3 colunas em landscape, 2 em portrait
- AnimalCard: imagem 4:5, nome em azul primário, idade/raça em cinza
- Skeleton loading durante "fetch"
- Apenas animais com status "available" são exibidos

## 6. Tela 3 — Detalhes + Formulário de Adoção
- Layout duas colunas em landscape, stack em portrait
- Carrossel de fotos (Embla Carousel) com indicadores
- Info detalhada: descrição, comportamento, vacinas, porte
- Formulário: Nome, CPF (máscara), Telefone (máscara), Email
- Validação com Zod + react-hook-form
- Botão "Confirmar Adoção" → toast de sucesso → redireciona ao Hub com animal removido

## 7. Proteção de Rotas
- Componente ProtectedRoute que verifica auth no Zustand store
- Não autenticado → redireciona para /login
- Já autenticado em /login → redireciona para /hub

## 8. Animações & Feedback
- Transições de página com Framer Motion (fade + slide-up)
- Botões com scale-down no active (0.96)
- AnimatePresence para remoção suave de animais adotados
- Toast via Sonner (já configurado)

## 9. Responsividade Totem
- Media queries para landscape vs portrait
- Tamanhos de fonte mínimos: body 16px, labels 14px uppercase
- Sem hover-only states (tudo visível por padrão)
- Sem scroll infinito — grid fixo paginado se necessário

