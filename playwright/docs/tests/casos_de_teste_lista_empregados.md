# Cenários de Teste Sugeridos

**Página analisada:** Lista de Empregados - https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList  
**Provedor LLM:** Google Gemini (gemini-3-flash-preview)  
**Gerado em:** 17/04/2026, 05:28:12

---

# Documento de Casos de Teste - OrangeHRM (PIM - Employee List)

**Sistema:** OrangeHRM - Módulo PIM (Personal Information Management)  
**Tela:** Lista de Empregados (Employee List)  
**Analista responsável:** Analista de Qualidade Sênior

---

## 1. Identificação de Perfis e Regras de Negócio

### Perfis de Usuário
- **Admin / HR Manager:** Possui acesso total para visualizar, filtrar, adicionar, editar e excluir registros de funcionários.
- **Funcionário (Essencial):** Perfil com permissões restritas (normalmente não visualiza a lista completa de outros funcionários neste nível de detalhe, a menos que configurado).

### Regras de Negócio Inferidas
1. **Filtros de Busca:** O usuário pode combinar múltiplos filtros para refinar a busca.
2. **Autocomplete:** Os campos "Employee Name" e "Supervisor Name" devem sugerir nomes cadastrados após a digitação de caracteres iniciais ("Type for hints...").
3. **Padrão de Filtro:** O campo "Include" vem pré-selecionado como "Current Employees Only".
4. **Limpeza de Dados:** O botão "Reset" deve retornar todos os filtros ao seu estado original/vazio.
5. **Navegação de Cadastro:** O botão "+ Add" e a aba "Add Employee" devem direcionar para o mesmo formulário de criação.

---

## 2. Casos de Teste

### CT01 - Pesquisa de funcionário por nome completo (Fluxo Feliz)

#### Objetivo
Validar se o sistema retorna o registro correto ao pesquisar um funcionário utilizando o campo de autocomplete "Employee Name".

#### Pré-Condições
- Usuário autenticado com perfil de Admin ou HR Manager.
- Existência de ao menos um funcionário cadastrado (Ex: "Cassidy Hope").

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar o menu "PIM" e a aba "Employee List". | A tela de busca de informações de empregados é exibida. |
| 2  | No campo "Employee Name", digitar as primeiras letras do nome do funcionário. | O sistema exibe uma lista de sugestões (hints) correspondente aos caracteres digitados. |
| 3  | Selecionar o nome completo na lista de sugestões. | O campo é preenchido com o nome selecionado. |
| 4  | Clicar no botão "Search". | O sistema processa a busca e exibe o registro específico na tabela de resultados abaixo. |

#### Resultados Esperados
- O registro exibido na grid de resultados deve corresponder exatamente ao nome selecionado no filtro.

#### Critérios de Aceitação
- O componente de autocomplete deve carregar as sugestões em menos de 2 segundos.
- A grid de resultados deve ser atualizada conforme o filtro aplicado.

---

### CT02 - Pesquisa de funcionário por ID inexistente (Cenário Negativo)

#### Objetivo
Validar o comportamento do sistema ao realizar uma busca por um "Employee Id" que não consta na base de dados.

#### Pré-Condições
- Usuário autenticado.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | No campo "Employee Id", inserir um valor alfanumérico inexistente (Ex: "999999"). | O valor é inserido no campo. |
| 2  | Clicar no botão "Search". | O sistema realiza a busca. |

#### Resultados Esperados
- O sistema não deve retornar registros na grid.
- Uma mensagem informativa (ex: "No Records Found") deve ser exibida ao usuário.

#### Critérios de Aceitação
- O sistema não deve apresentar erro de aplicação (crash).
- A mensagem de "nenhum registro encontrado" deve ser clara para o usuário.

---

### CT03 - Funcionalidade do botão Reset

#### Objetivo
Validar se todos os campos de filtro retornam aos seus valores padrões após o acionamento do botão "Reset".

#### Pré-Condições
- Estar na tela "Employee List" com diversos filtros preenchidos (Nome, ID, Status, etc).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Preencher "Employee Name", "Employee Id" e alterar "Employment Status" para "Full-Time Permanent". | Os campos refletem os dados inseridos/selecionados. |
| 2  | Clicar no botão "Reset". | Todos os campos de entrada de texto são limpos e os dropdowns voltam ao estado "-- Select --", exceto "Include" que volta para "Current Employees Only". |

#### Resultados Esperados
- O formulário de busca deve ser reiniciado para o estado inicial de carregamento da página.

#### Critérios de Aceitação
- Nenhum filtro anterior deve permanecer ativo após o clique em "Reset".

---

### CT04 - Validação de redirecionamento para inclusão de novo funcionário

#### Objetivo
Garantir que o botão "+ Add" direciona o usuário corretamente para a funcionalidade de cadastro.

#### Pré-Condições
- Usuário autenticado com permissão de escrita no módulo PIM.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Localizar o botão "+ Add" acima da grid de resultados. | O botão está visível e habilitado. |
| 2  | Clicar no botão "+ Add". | O sistema redireciona o usuário para a tela de formulário "Add Employee". |

#### Resultados Esperados
- A URL deve mudar para a rota de criação de empregado e o formulário de cadastro deve ser exibido.

#### Critérios de Aceitação
- O redirecionamento deve ser funcional.
- A aba ativa no menu superior deve mudar de "Employee List" para "Add Employee".

---

### CT05 - Busca combinada com múltiplos filtros (Regras de Negócio)

#### Objetivo
Validar a precisão da busca quando mais de um critério de filtragem é aplicado simultaneamente.

#### Pré-Condições
- Existência de funcionários com diferentes "Job Titles" e "Sub Units".

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Selecionar uma opção no dropdown "Job Title" (Ex: "Software Engineer"). | O valor é selecionado. |
| 2  | Selecionar uma opção no dropdown "Sub Unit" (Ex: "Engineering"). | O valor é selecionado. |
| 3  | No campo "Include", selecionar "Current and Past Employees". | O valor é alterado. |
| 4  | Clicar em "Search". | O sistema deve exibir apenas funcionários que atendam a TODOS os critérios selecionados simultaneamente. |

#### Resultados Esperados
- A grid deve ser filtrada respeitando a regra lógica "E" (Job Title = X AND Sub Unit = Y).

#### Critérios de Aceitação
- Se não houver funcionário que atenda a todos os critérios simultaneamente, a lista deve ficar vazia.

---

### CT06 - Acesso à tela como usuário sem permissão (Segurança/Perfil)

#### Objetivo
Validar que um usuário sem perfil administrativo não consiga visualizar ou acessar o módulo PIM/Employee List.

#### Pré-Condições
- Possuir um usuário com perfil de acesso restrito (Ex: Funcionário comum sem permissões de RH).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Realizar login com o usuário restrito. | Login realizado com sucesso, direcionando ao Dashboard. |
| 2  | Observar o menu lateral esquerdo. | O item "PIM" não deve estar visível no menu. |
| 3  | Tentar acessar a URL direta da lista de empregados. | O sistema deve exibir uma mensagem de "Access Denied" ou redirecionar para uma página de erro/dashboard. |

#### Resultados Esperados
- O acesso à funcionalidade deve ser bloqueado conforme o nível de permissão do perfil.

#### Critérios de Aceitação
- Impedir o acesso não autorizado tanto via interface quanto via URL.

---

### CT07 - Validação do campo Autocomplete "Supervisor Name"

#### Objetivo
Verificar se o campo de Supervisor funciona corretamente como um filtro de busca dinâmico.

#### Pré-Condições
- Funcionários cadastrados com supervisores atribuídos.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | No campo "Supervisor Name", digitar parte do nome de um supervisor conhecido. | O sistema exibe o hint com nomes correspondentes. |
| 2  | Selecionar o nome e clicar em "Search". | O sistema retorna todos os funcionários que estão sob a supervisão da pessoa selecionada. |

#### Resultados Esperados
- A lista de funcionários retornada deve conter apenas subordinados do supervisor filtrado.

#### Critérios de Aceitação
- O campo deve aceitar apenas nomes sugeridos pelo sistema (vínculo com base de dados).
