# BRIEFING VISUAL — Remodelagem da plataforma de cursos

Preciso de uma nova identidade visual completa para uma plataforma de cursos em
vídeo que já está no ar e vai ser remodelada, com nome novo. Abaixo está tudo o
que você precisa saber. As medidas foram extraídas do código em produção, então
são reais, não aproximações.

---

## 1. O PRODUTO

Plataforma própria de cursos em vídeo, criada como alternativa sem taxas às
plataformas tipo Hotmart. Os vídeos ficam no YouTube como não listados e são
exibidos dentro do site.

**Fluxo completo:** a cabeleireira se cadastra (email/senha ou conta Google) →
cai numa tela de "cadastro em análise" → uma administradora libera o acesso
manualmente → ela passa a ver todos os cursos publicados e assiste as aulas,
marcando cada uma como assistida.

## 2. QUEM USA

Cabeleireiras brasileiras, majoritariamente entre **35 e 55 anos**, acessando
quase sempre pelo **celular**, muitas vezes entre um atendimento e outro, em
rede móvel instável. Familiaridade digital variada: algumas dominam Instagram,
outras travam num link de confirmação de email.

Isso não é observação de mercado — é o motivo de decisões que já estão no
código, como a base tipográfica em 17px. A identidade nova precisa continuar
servindo essa pessoa.

---

## 3. RESTRIÇÕES QUE NÃO PODEM SER QUEBRADAS

Não são preferências. São decisões já implementadas que sustentam
acessibilidade, ou limites da tecnologia usada.

| Restrição | Valor | Por quê |
|---|---|---|
| Tamanho base do texto | **17px** | Não são os 16px padrão. Subido de propósito pelo público 40+. Pode aumentar, não diminuir. |
| Alvo de toque | **≥ 44px** | Celular, muitas vezes com a mão ocupada ou molhada. |
| Contraste | **WCAG AA** | Mínimo 4,5:1 em texto corrido. Visão cansada é a regra nessa faixa etária. |
| Estado nunca só por cor | ícone + texto | Publicada / rascunho / standby precisam ser distinguíveis sem enxergar cor. |
| Ordem de projeto | **mobile primeiro** | A maioria do acesso é celular. |
| Framework | **Tailwind CSS 3.4** | Cores e raios novos entram como tokens no `tailwind.config.ts`. Prefira paleta enxuta e nomeada. |
| Ícones | **lucide-react** | Já instalada e usada em todas as telas. Trocar é possível, mas custa. |
| Biblioteca de UI | **nenhuma** | Componentes todos próprios. Sem Material, shadcn ou Bootstrap limitando formas. |
| Imagens externas | lista liberada | Domínio precisa ser autorizado no `next.config.mjs`. |

**Atenção com a fonte:** a atual (Satoshi) vem de CDN externo. Se a identidade
nova trouxer outra família, ela precisa ter licença web e não atrasar o primeiro
carregamento — que é justamente onde a conexão da aluna é pior. Fonte variável
em arquivo único é o cenário ideal.

---

## 4. INVENTÁRIO DE TELAS

São **12 telas com interface**, mais 3 de carregamento e 1 rota técnica sem
visual. Toda tela precisa existir em celular e computador.

| Rota | Tela | Quem vê | O que tem dentro |
|---|---|---|---|
| `/login` | Entrar | visitante | Botão Google, divisor "ou", email, senha, link de senha esquecida, link pra cadastro |
| `/cadastro` | Criar conta | visitante | Botão Google, nome, email, senha com dica, link pra login. Estado extra: "confirme seu email" |
| `/esqueci-senha` | Recuperar senha | visitante | Campo de email e confirmação de envio |
| `/nova-senha` | Definir nova senha | visitante com link | Campo de senha nova |
| `/aguardando` | Cadastro em análise | aluna não liberada | Ícone grande, título com primeiro nome, explicação, caixa de instrução |
| `/` | Catálogo | aluna liberada | Hero com foto e chamada, título de seção, grade de cards. Estado vazio: "cursos em breve" |
| `/curso/[id]` | Curso e aulas | aluna liberada | Voltar, título, descrição, player, botão de marcar assistida, bloco de progresso, lista de aulas |
| `/admin` | Painel | admin | Aviso de pendências, cartões com contagem de usuárias e cursos |
| `/admin/usuarios` | Usuárias | admin | Tabela: pessoa, status, ações (liberar, revogar, excluir) |
| `/admin/cursos` | Cursos | admin | Formulário de criação, lista com reordenar, publicar, editar, excluir |
| `/admin/cursos/[id]` | Editar curso | admin | Dados do curso, formulário de nova aula, lista de aulas com edição expansível |
| — | Cabeçalho do app | logada | Logo, botão Painel (só admin), saudação com nome, sair. Fixo no topo, 64px |

**Duas molduras diferentes.** As quatro telas de acesso vivem num **cartão
centralizado de 448px**, sobre fundo colorido suave, com a logo acima e uma
frase de posicionamento abaixo. As telas de dentro usam **cabeçalho fixo** e
conteúdo em coluna de até 1088px. São dois ambientes visuais distintos e ambos
precisam ser desenhados.

---

## 5. SISTEMA ATUAL — O QUE SERÁ SUBSTITUÍDO

Paleta em produção hoje, herdada da loja Nouê Cosméticos. Serve como referência
do que cada cor **faz** — a identidade nova precisa cobrir os mesmos papéis,
com as cores que ela quiser.

| Token | Hex | Papel |
|---|---|---|
| verde | `#00A341` | Cor âncora. Botão principal, links, barra de progresso, destaques |
| verde-dark | `#008A37` | Hover da âncora e texto sobre fundo claro dela |
| verde-light | `#E0F4E8` | Fundo suave: aula ativa, mensagem de sucesso, fundo das telas de acesso |
| tinta | `#1A1A1A` | Títulos e texto principal. Também fundo do botão Painel e da etiqueta Admin |
| ambar | `#FFB74A` | Atenção sem erro: aguardando liberação, aula em standby, pendências |
| erro | `#F83A3A` | Mensagens de erro e ações destrutivas |

### Tipografia, medidas e formas em uso

| Item | Valor | Observação |
|---|---|---|
| Família | Satoshi | Pesos 400, 500, 700, 900. CDN externo |
| Base | 17px | Todas as medidas em `rem` escalam 6% acima do padrão da web |
| Título de tela | ~34–51px | Peso 700, entrelinha fechada |
| Corpo | 17–19px | Entrelinha nunca abaixo de 1,5 |
| Rótulo de campo | ~14px | Peso 700, sempre acima do campo — nunca placeholder no lugar de rótulo |
| Raio grande | 21px | Cartões, blocos, caixas de destaque |
| Raio médio | ~13px | Botões e campos |
| Largura do conteúdo | 1088px | Mais 17px de respiro em cada lado |
| Cartão de acesso | 448px | Largura máxima do login e cadastro |
| Altura do cabeçalho | 64px | Fixo no topo, branco a 90% com desfoque atrás |
| Pontos de quebra | 640 / 768 / 1024 | A virada principal do layout é em 768px |

### Logo

Hoje é o wordmark da Nouê em imagem, com a palavra "Class" ao lado em peso leve
e na cor âncora. Existem três arquivos: preta, branca e uma segunda branca
alternativa. A identidade nova precisa entregar pelo menos essas três situações.

---

## 6. COMPONENTES A REDESENHAR

Dezoito peças montam todas as telas.

| Componente | O que é | Variações |
|---|---|---|
| Botão | Ação principal | principal · secundário · discreto · destrutivo |
| Campo de texto | Entrada de uma linha | normal · foco · erro |
| Área de texto | Entrada de várias linhas | idem |
| Rótulo de campo | Título mais dica opcional abaixo | com e sem dica |
| Aviso | Mensagem em bloco | erro · sucesso · informação |
| Indicador de espera | Círculo girando dentro de botões | fundo claro e escuro |
| Esqueleto | Bloco pulsante do carregamento | retângulo e círculo |
| Barra de progresso | Fina, no card do curso | vazia · parcial · cheia |
| Bloco de progresso | Percentual, barra e contagem de aulas | em andamento · concluído |
| Card de curso | Capa, título, descrição, progresso | com capa · sem capa · concluído · sem aulas |
| Logo | Marca da plataforma | completa · reduzida · fundo escuro |
| Cabeçalho | Barra fixa do topo | aluna · admin |
| Botão de sair | Encerrar sessão | normal · processando |
| Botão do Google | Entrar com conta Google | normal · processando |
| Botão de envio | Submeter formulário | normal · processando |
| Botão de confirmação | Ação destrutiva que pergunta antes | normal · processando |
| Botão de ação rápida | Publicar, reordenar, liberar | normal · processando · desabilitado |
| Barra de navegação | Linha fina no topo ao trocar de página | única |

---

## 7. ESTADOS QUE PRECISAM DE FORMA VISUAL

A parte mais fácil de esquecer e a que mais gera retrabalho. Cada estado precisa
ser reconhecível **sem depender só da cor**.

| Onde | Estados | O que precisa comunicar |
|---|---|---|
| Aula (painel) | standby · rascunho · publicada | Standby é aula sem vídeo — não pode ser publicada. Diferente de rascunho, que tem vídeo mas está escondida |
| Curso (painel) | rascunho · publicado | Só publicado aparece pra aluna |
| Usuária (painel) | aguardando · liberada · admin | Aguardando é fila de trabalho: precisa puxar o olho de quem administra |
| Progresso | não começou · em andamento · concluído | Concluído merece comemoração discreta, não só a barra cheia |
| Aula na lista | assistida · tocando agora · não assistida | Três marcadores distintos, lado a lado na mesma lista vertical |
| Qualquer botão | normal · hover · foco · processando · desabilitado | Foco visível por teclado é obrigatório |
| Telas vazias | sem cursos · sem aulas · sem usuárias | Nunca área em branco. Cada vazio explica o que houve e o que fazer |

---

## 8. MEDIDAS FIXAS DE IMAGEM

O corte é automático e centralizado — imagem fora da proporção perde as bordas
sem aviso.

| Imagem | Celular | Computador | Entrega |
|---|---|---|---|
| Foto do hero | quadrada | metade da largura, altura ≥ 500px | Largura mínima 1920px. Assunto centralizado |
| Capa de curso | 16:9 | 16:9 | 1280×720 basta. Cadastrada por URL no painel |
| Vídeo da aula | 16:9 | 16:9 | Vem do YouTube, não é arte |
| Ícone do site | quadrado | quadrado | Legível a 16px na aba do navegador |

**Descrição de imagem é entregável.** Toda imagem de conteúdo precisa vir com um
texto que descreva o que ela mostra. É o que uma aluna com baixa visão ouve no
leitor de tela e o que o Google usa pra entender a página. Faz parte da arte.

---

## 9. O QUE PRECISO RECEBER

1. **Marca** — logo em versão principal, reduzida (pro cabeçalho de 64px) e para
   fundo escuro. Mais o ícone quadrado do site.
2. **Cor** — paleta nomeada com o papel de cada cor: uma âncora, sua variação
   escura pra hover, sua variação clara pra fundo, neutro de texto, cor de
   atenção e cor de erro. Todas com hex e contraste verificado.
3. **Tipo** — duas famílias (títulos e corpo), pesos usados, tamanho de cada
   nível, entrelinha. Licença web confirmada.
4. **Telas** — as 12 da seção 4, em celular e computador. Celular primeiro.
5. **Peças** — os 18 componentes da seção 6, com todos os estados da seção 7.
   É aqui que uma entrega parece completa e não é.
6. **Vazios** — catálogo sem curso, curso sem aula, painel sem usuária, mais os
   três esqueletos de carregamento.
7. **Texto** — revisão da escrita da interface. Botões, mensagens de erro e
   telas vazias fazem parte do design. O tom atual é próximo e direto, tratando
   a aluna por "você".

---

## 10. DECISÕES QUE EU AINDA PRECISO TOMAR

*(preencher antes de começar — mudam tudo o que vem depois)*

**Nome novo:** ________________

Define a logo, o título da aba do navegador, o texto dos emails automáticos de
recuperação de senha e a frase de posicionamento embaixo do cartão de login.

**Continua ligada à marca-mãe?** ________________

Hoje a plataforma é visivelmente uma extensão da Nouê Cosméticos: mesma cor,
mesmo wordmark. A identidade nova mantém esse vínculo ou anda sozinha? As duas
respostas são defensáveis e levam a resultados opostos.

**Escola ou clube?** ________________

O tom atual mistura os dois: fala em "aulas" e "alunas", mas com emoji e
saudação pelo primeiro nome. Vale decidir de que lado pende — escola
profissional séria ou comunidade próxima — porque tipografia, cor e escrita
seguem essa escolha juntas.
