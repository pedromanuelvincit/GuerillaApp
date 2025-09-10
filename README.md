# **Cognanvas K.I.A. (Knowledge Integration Assistant)**

Bem-vindo ao repositório oficial do Cognanvas K.I.A., a ferramenta de suporte para o **Framework de Estudos KIA**.

O Framework KIA é um método de estudo projetado para otimizar o processo de aprendizagem em áreas complexas. O objetivo não é apenas aprender um tópico, mas **aprender a aprender** de forma mais eficaz, utilizando um ecossistema de ferramentas e processos que se retroalimentam.

## **🧠 O que é o Framework KIA?**

O framework estrutura o aprendizado num ciclo de 5 fases interdependentes:

1. **Aula:** O ponto de partida, onde o conhecimento inicial é adquirido.  
2. **Aumento de Repertório:** A fase de aprofundamento teórico através de leituras e materiais complementares.  
3. **Missão Prática (com Cognos):** A aplicação do conhecimento em cenários práticos, utilizando uma IA parceira ("Cognos") para simular casos de uso e obter feedback técnico.  
4. **Registro no Cognanvas:** A utilização desta aplicação para documentar cada fase do estudo, desde o planeamento até a descoberta principal e a reflexão final.  
5. **Análise Estratégica (com Mentor G.E.M.):** A utilização do mentor de IA integrado para analisar o histórico de estudos, identificar padrões de longo prazo e otimizar o processo de meta-aprendizagem.

## **✨ Principais Funcionalidades do Cognanvas**

O Cognanvas K.I.A. é uma aplicação web de ficheiro único que serve como o seu "diário de bordo" para o framework.

* **📝 Canvas Estruturado:** O layout da aplicação espelha perfeitamente as fases do Framework KIA, guiando o seu estudo.  
* **🤖 Assistentes de IA (Requer Configuração):** Utiliza a API do Gemini para gerar perguntas-chave, missões práticas e planos anti-obstáculos.  
* **📈 Mentor G.E.M. Integrado (Requer Configuração):** Um coach de IA que analisa o seu histórico completo e fornece insights estratégicos sobre a sua evolução.  
* **🔒 Gestão de Dados Local:** Todo o seu histórico é guardado de forma segura e privada no seu navegador.  
* **🔄 Portabilidade:** Funcionalidades de importação e exportação do seu histórico em formato CSV, compatível com Notion, Excel e outras ferramentas.

## **🚀 Como Começar**

1. Faça o download do ficheiro app\_canvas\_ia\_integrado.html deste repositório.  
2. Abra o ficheiro em qualquer navegador de internet moderno (Chrome, Firefox, Edge, etc.).  
3. A aplicação funciona 100% no seu navegador para registo e gestão de histórico.  
4. Para ativar todo o potencial da ferramenta, configure as funcionalidades de IA seguindo os passos abaixo.

## **⚠️ Ativando as Funcionalidades de IA (Importante)**

As funcionalidades de assistência e análise por IA (Mentor G.E.M., sugestões de perguntas, etc.) são alimentadas pela API do Google Gemini. Para que funcionem na sua cópia local do aplicativo, você **precisará de inserir a sua própria chave de API**.

**Siga estes passos:**

1. **Obtenha uma Chave de API:** Vá ao [**Google AI Studio**](https://aistudio.google.com/), faça login com a sua conta Google e crie uma nova chave de API gratuita.  
2. **Edite o Ficheiro:** Abra o ficheiro app\_canvas\_ia\_integrado.html num editor de texto ou de código (como o VS Code).  
3. **Insira a Chave:** Procure pela linha de código (perto do final do ficheiro) que diz:  
   const apiKey \= ""; // Deixar em branco, será gerido pelo ambiente

   E insira a sua chave de API entre as aspas:  
   const apiKey \= "SUA\_CHAVE\_DE\_API\_AQUI";

4. **Salve o Ficheiro:** Salve as alterações e abra o ficheiro no seu navegador. As funcionalidades de IA estarão agora ativas.

**Nota sobre o Prompt:** A inteligência do Mentor G.E.M. reside no prompt detalhado que já se encontra no código. Ele foi desenhado especificamente para entender a estrutura de dados e a filosofia do Framework KIA. Para extrair todo o potencial da ferramenta, recomenda-se manter este prompt.

## **📜 Licença**

Este projeto é distribuído sob a Licença MIT. Veja o ficheiro LICENSE para mais detalhes. Sinta-se à vontade para usar, modificar e distribuir este trabalho.
